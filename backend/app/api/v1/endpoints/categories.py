"""Endpoints Categories."""
import uuid
from fastapi import APIRouter, HTTPException, status

from app.api.deps import DbSession, CurrentAdmin
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryRead
from app.services import category_service

router = APIRouter()


@router.get("/", response_model=list[CategoryRead])
def list_categories(db: DbSession):
    return category_service.list_categories(db)


@router.get("/{category_id}", response_model=CategoryRead)
def get_category(category_id: uuid.UUID, db: DbSession):
    category = category_service.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categorie introuvable.")
    return category


@router.post(
    "/",
    response_model=CategoryRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[],
)
def create_category(payload: CategoryCreate, db: DbSession, _admin: CurrentAdmin):
    try:
        return category_service.create_category(db, payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(e))


@router.patch("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: uuid.UUID,
    payload: CategoryUpdate,
    db: DbSession,
    _admin: CurrentAdmin,
):
    category = category_service.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categorie introuvable.")
    return category_service.update_category(db, category, payload)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: uuid.UUID, db: DbSession, _admin: CurrentAdmin):
    category = category_service.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categorie introuvable.")
    category_service.delete_category(db, category)
    return None