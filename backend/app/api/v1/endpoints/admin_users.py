"""Endpoints admin pour la gestion des comptes utilisateurs."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.api.deps import DbSession, CurrentAdmin
from app.models.user import UserRole
from app.schemas.user import UserRead, UserAdminUpdate
from app.services import user_service

router = APIRouter()


class UserListResponse(BaseModel):
    items: list[UserRead]
    total: int
    page: int
    page_size: int


@router.get("/", response_model=UserListResponse)
def list_users(
    _admin: CurrentAdmin,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    role: Optional[UserRole] = None,
    is_active: Optional[bool] = None,
):
    items, total = user_service.list_users(
        db,
        page=page,
        page_size=page_size,
        search=search,
        role=role,
        is_active=is_active,
    )
    return UserListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: uuid.UUID, _admin: CurrentAdmin, db: DbSession):
    user = user_service.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")
    return user


@router.patch("/{user_id}", response_model=UserRead)
def update_user(
    user_id: uuid.UUID,
    payload: UserAdminUpdate,
    _admin: CurrentAdmin,
    db: DbSession,
):
    user = user_service.get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Utilisateur introuvable.")
    return user_service.admin_update_user(db, user, payload)