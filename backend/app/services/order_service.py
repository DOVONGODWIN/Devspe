"""Logique metier Orders."""
import uuid
from decimal import Decimal
from typing import Sequence

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select

from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.schemas.order import OrderItemCreate


def _load_products(db: Session, product_ids: list[uuid.UUID]) -> dict[uuid.UUID, Product]:
    products = db.scalars(select(Product).where(Product.id.in_(product_ids))).all()
    return {p.id: p for p in products}


def create_pending_order(
    db: Session,
    buyer: User,
    items: list[OrderItemCreate],
) -> Order:
    if not items:
        raise ValueError("Le panier est vide.")

    product_ids = [it.product_id for it in items]
    products = _load_products(db, product_ids)

    if len(products) != len(set(product_ids)):
        raise ValueError("Un ou plusieurs produits sont introuvables.")

    total = Decimal("0.00")
    order_items: list[OrderItem] = []

    for it in items:
        product = products[it.product_id]

        if not product.is_published:
            raise ValueError(f"Le produit '{product.name}' n'est plus disponible.")

        if product.stock < it.quantity:
            raise ValueError(f"Stock insuffisant pour '{product.name}'.")

        if product.seller_id == buyer.id:
            raise ValueError("Vous ne pouvez pas acheter vos propres produits.")

        line_total = product.price * it.quantity
        total += line_total

        order_items.append(OrderItem(
            product_id=product.id,
            quantity=it.quantity,
            unit_price=product.price,
        ))

    order = Order(
        buyer_id=buyer.id,
        total_amount=total,
        status=OrderStatus.PENDING,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def attach_stripe_session(
    db: Session,
    order: Order,
    session_id: str,
) -> Order:
    order.stripe_session_id = session_id
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def mark_order_paid(
    db: Session,
    order: Order,
    payment_intent: str | None = None,
) -> Order:
    if order.status == OrderStatus.PAID:
        return order

    order.status = OrderStatus.PAID
    if payment_intent:
        order.stripe_payment_intent = payment_intent

    for item in order.items:
        product = item.product
        product.stock = max(0, product.stock - item.quantity)
        db.add(product)

    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def get_order_by_stripe_session(db: Session, session_id: str) -> Order | None:
    query = (
        select(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .where(Order.stripe_session_id == session_id)
    )
    return db.scalar(query)


def list_user_orders(db: Session, user: User) -> Sequence[Order]:
    query = (
        select(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .where(Order.buyer_id == user.id)
        .order_by(Order.created_at.desc())
    )
    return db.scalars(query).unique().all()


def get_order_for_user(db: Session, order_id: uuid.UUID, user: User) -> Order | None:
    query = (
        select(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .where(Order.id == order_id, Order.buyer_id == user.id)
    )
    return db.scalar(query)