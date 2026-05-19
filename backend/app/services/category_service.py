"""Logique metier Categories."""
import re
import uuid
import unicodedata
from typing import Sequence

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def _slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", text)


def list_categories(db: Session) -> Sequence[Category]:
    return db.scalars(select(Category).order_by(Category.name)).all()


def get_category(db: Session, category_id: uuid.UUID) -> Category | None:
    return db.scalar(select(Category).where(Category.id == category_id))


def create_category(db: Session, payload: CategoryCreate) -> Category:
    slug = _slugify(payload.name)
    existing = db.scalar(select(Category).where(Category.slug == slug))
    if existing is not None:
        raise ValueError("Une categorie avec ce nom existe deja.")

    category = Category(name=payload.name, slug=slug)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category: Category, payload: CategoryUpdate) -> Category:
    if payload.name is not None:
        category.name = payload.name
        category.slug = _slugify(payload.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category: Category) -> None:
    db.delete(category)
    db.commit()