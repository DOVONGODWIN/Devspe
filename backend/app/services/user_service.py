"""Logique metier admin pour la gestion des users."""
import uuid
from typing import Sequence, Optional

from sqlalchemy.orm import Session
from sqlalchemy import select, func, or_

from app.models.user import User, UserRole
from app.schemas.user import UserAdminUpdate


def list_users(
    db: Session,
    *,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
) -> tuple[Sequence[User], int]:
    query = select(User)
    filters = []

    if search:
        pattern = f"%{search.lower()}%"
        filters.append(
            or_(
                func.lower(User.email).like(pattern),
                func.lower(func.coalesce(User.full_name, "")).like(pattern),
            )
        )
    if role is not None:
        filters.append(User.role == role)
    if is_active is not None:
        filters.append(User.is_active.is_(is_active))

    if filters:
        query = query.where(*filters)

    count_query = select(func.count()).select_from(User)
    if filters:
        count_query = count_query.where(*filters)
    total = db.scalar(count_query) or 0

    offset = (page - 1) * page_size
    query = query.order_by(User.created_at.desc()).offset(offset).limit(page_size)
    items = list(db.scalars(query).all())

    return items, total


def get_user(db: Session, user_id: uuid.UUID) -> User | None:
    return db.scalar(select(User).where(User.id == user_id))


def admin_update_user(db: Session, user: User, payload: UserAdminUpdate) -> User:
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user