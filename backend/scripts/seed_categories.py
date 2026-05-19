"""Seed initial des categories de base."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db.session import SessionLocal
from app.db import base_all  # noqa: F401
from app.services.category_service import create_category
from app.schemas.category import CategoryCreate


CATEGORIES = [
    "Alimentation",
    "Accessoire electronique",
    "Mode",
]


def main():
    db = SessionLocal()
    try:
        for name in CATEGORIES:
            try:
                cat = create_category(db, CategoryCreate(name=name))
                print(f"OK  {cat.name} -> {cat.slug}")
            except ValueError as e:
                print(f"SKIP {name}: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    main()