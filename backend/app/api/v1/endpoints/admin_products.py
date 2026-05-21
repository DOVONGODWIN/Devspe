"""Endpoints admin pour la moderation des produits."""
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from app.api.deps import DbSession, CurrentAdmin
from app.schemas.product import ProductRead
from app.services import product_service

router = APIRouter()


class AdminProductListResponse(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    page_size: int


@router.get("/", response_model=AdminProductListResponse)
def list_all_products(
    _admin: CurrentAdmin,
    db: DbSession,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
):
    items, total = product_service.list_products(
        db,
        page=page,
        page_size=page_size,
        search=search,
        only_published=False,
    )
    return AdminProductListResponse(items=items, total=total, page=page, page_size=page_size)