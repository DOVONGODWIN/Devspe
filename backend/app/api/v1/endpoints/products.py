"""Endpoints Products."""
import uuid
from decimal import Decimal
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import DbSession, CurrentUser
from app.models.user import UserRole
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductRead,
    ProductListResponse,
)
from app.services import product_service

router = APIRouter()


@router.get("/", response_model=ProductListResponse)
def list_products(
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[uuid.UUID] = None,
    min_price: Optional[Decimal] = Query(None, ge=0),
    max_price: Optional[Decimal] = Query(None, ge=0),
):
    items, total = product_service.list_products(
        db,
        page=page,
        page_size=page_size,
        search=search,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
    )
    return ProductListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/me", response_model=ProductListResponse)
def list_my_products(
    current_user: CurrentUser,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
):
    items, total = product_service.list_products(
        db,
        page=page,
        page_size=page_size,
        seller_id=current_user.id,
        only_published=False,
    )
    return ProductListResponse(items=items, total=total, page=page, page_size=page_size)


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: uuid.UUID, db: DbSession):
    product = product_service.get_product(db, product_id)
    if product is None or not product.is_published:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")
    product_service.increment_views(db, product)
    return product


@router.post("/", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    current_user: CurrentUser,
    db: DbSession,
):
    try:
        return product_service.create_product(db, current_user, payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.patch("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: uuid.UUID,
    payload: ProductUpdate,
    current_user: CurrentUser,
    db: DbSession,
):
    product = product_service.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")

    if product.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse.")

    try:
        return product_service.update_product(db, product, payload)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: uuid.UUID, current_user: CurrentUser, db: DbSession):
    product = product_service.get_product(db, product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produit introuvable.")

    if product.seller_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces refuse.")

    product_service.delete_product(db, product)
    return None