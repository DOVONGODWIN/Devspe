"""Logique metier Products."""
import uuid
from decimal import Decimal
from typing import Optional

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, or_

from app.models.product import Product
from app.models.category import Category
from app.models.user import User
from app.schemas.product import ProductCreate, ProductUpdate


def _base_query():
    return (
        select(Product)
        .options(joinedload(Product.category), joinedload(Product.seller))
    )


def list_products(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 12,
    search: Optional[str] = None,
    category_id: Optional[uuid.UUID] = None,
    min_price: Optional[Decimal] = None,
    max_price: Optional[Decimal] = None,
    seller_id: Optional[uuid.UUID] = None,
    only_published: bool = True,
) -> tuple[list[Product], int]:
    query = _base_query()
    filters = []

    if only_published:
        filters.append(Product.is_published.is_(True))

    if search:
        pattern = f"%{search.lower()}%"
        filters.append(
            or_(
                func.lower(Product.name).like(pattern),
                func.lower(Product.description).like(pattern),
            )
        )

    if category_id is not None:
        filters.append(Product.category_id == category_id)

    if min_price is not None:
        filters.append(Product.price >= min_price)

    if max_price is not None:
        filters.append(Product.price <= max_price)

    if seller_id is not None:
        filters.append(Product.seller_id == seller_id)

    if filters:
        query = query.where(*filters)

    count_query = select(func.count()).select_from(Product)
    if filters:
        count_query = count_query.where(*filters)
    total = db.scalar(count_query) or 0

    offset = (page - 1) * page_size
    query = query.order_by(Product.created_at.desc()).offset(offset).limit(page_size)
    items = list(db.scalars(query).unique().all())

    return items, total


def get_product(db: Session, product_id: uuid.UUID) -> Product | None:
    query = _base_query().where(Product.id == product_id)
    return db.scalar(query)


def create_product(
    db: Session,
    seller: User,
    payload: ProductCreate,
) -> Product:
    category = db.scalar(select(Category).where(Category.id == payload.category_id))
    if category is None:
        raise ValueError("Categorie introuvable.")

    product = Product(
        name=payload.name,
        description=payload.description,
        color=payload.color,
        price=payload.price,
        stock=payload.stock,
        image_url=payload.image_url,
        category_id=payload.category_id,
        seller_id=seller.id,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return get_product(db, product.id)


def update_product(
    db: Session,
    product: Product,
    payload: ProductUpdate,
) -> Product:
    data = payload.model_dump(exclude_unset=True)

    if "category_id" in data and data["category_id"] is not None:
        category = db.scalar(select(Category).where(Category.id == data["category_id"]))
        if category is None:
            raise ValueError("Categorie introuvable.")

    for key, value in data.items():
        setattr(product, key, value)

    db.add(product)
    db.commit()
    db.refresh(product)
    return get_product(db, product.id)


def delete_product(db: Session, product: Product) -> None:
    db.delete(product)
    db.commit()


def increment_views(db: Session, product: Product) -> None:
    product.views_count += 1
    db.add(product)
    db.commit()