"""Logique metier pour les KPI vendeur et admin."""
import uuid
from decimal import Decimal

from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_

from app.models.user import User
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order, OrderItem, OrderStatus


def get_seller_stats(db: Session, seller_id: uuid.UUID) -> dict:
    paid_filter = and_(
        OrderItem.product_id == Product.id,
        Product.seller_id == seller_id,
        Order.id == OrderItem.order_id,
        Order.status == OrderStatus.PAID,
    )

    sales_query = (
        select(
            func.count(OrderItem.id).label("total_sales"),
            func.coalesce(func.sum(OrderItem.unit_price * OrderItem.quantity), 0).label("revenue"),
        )
        .select_from(OrderItem)
        .join(Product, Product.id == OrderItem.product_id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(Product.seller_id == seller_id, Order.status == OrderStatus.PAID)
    )
    sales_row = db.execute(sales_query).one()
    total_sales = sales_row.total_sales or 0
    total_revenue = Decimal(sales_row.revenue or 0)

    average_basket = (total_revenue / total_sales) if total_sales > 0 else Decimal("0.00")

    product_counts = db.execute(
        select(
            func.count(Product.id).label("total"),
            func.count(Product.id).filter(Product.is_published.is_(True)).label("published"),
            func.coalesce(func.sum(Product.views_count), 0).label("views"),
        ).where(Product.seller_id == seller_id)
    ).one()

    top_query = (
        select(
            Product.id.label("product_id"),
            Product.name,
            func.sum(OrderItem.quantity).label("total_sold"),
            func.sum(OrderItem.unit_price * OrderItem.quantity).label("revenue"),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(Product.seller_id == seller_id, Order.status == OrderStatus.PAID)
        .group_by(Product.id, Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
    )
    top_rows = db.execute(top_query).all()
    top_products = [
        {
            "product_id": row.product_id,
            "name": row.name,
            "total_sold": int(row.total_sold),
            "revenue": Decimal(row.revenue),
        }
        for row in top_rows
    ]

    return {
        "total_sales": int(total_sales),
        "total_revenue": total_revenue,
        "average_basket": average_basket,
        "total_products": int(product_counts.total or 0),
        "published_products": int(product_counts.published or 0),
        "total_views": int(product_counts.views or 0),
        "top_products": top_products,
    }


def get_admin_stats(db: Session) -> dict:
    users_row = db.execute(
        select(
            func.count(User.id).label("total"),
            func.count(User.id).filter(User.is_active.is_(True)).label("active"),
        )
    ).one()

    products_row = db.execute(
        select(
            func.count(Product.id).label("total"),
            func.count(Product.id).filter(Product.is_published.is_(True)).label("published"),
        )
    ).one()

    orders_row = db.execute(
        select(
            func.count(Order.id).label("total"),
            func.count(Order.id).filter(Order.status == OrderStatus.PAID).label("paid"),
            func.count(Order.id).filter(Order.status == OrderStatus.PENDING).label("pending"),
            func.coalesce(
                func.sum(Order.total_amount).filter(Order.status == OrderStatus.PAID),
                0,
            ).label("revenue"),
        )
    ).one()

    categories_query = (
        select(
            Category.id.label("category_id"),
            Category.name,
            func.count(Product.id).label("product_count"),
        )
        .outerjoin(Product, Product.category_id == Category.id)
        .group_by(Category.id, Category.name)
        .order_by(func.count(Product.id).desc())
        .limit(5)
    )
    categories_rows = db.execute(categories_query).all()
    top_categories = [
        {
            "category_id": row.category_id,
            "name": row.name,
            "product_count": int(row.product_count),
        }
        for row in categories_rows
    ]

    return {
        "total_users": int(users_row.total or 0),
        "active_users": int(users_row.active or 0),
        "total_products": int(products_row.total or 0),
        "published_products": int(products_row.published or 0),
        "total_orders": int(orders_row.total or 0),
        "paid_orders": int(orders_row.paid or 0),
        "pending_orders": int(orders_row.pending or 0),
        "total_revenue": Decimal(orders_row.revenue or 0),
        "top_categories": top_categories,
    }