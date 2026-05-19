"""Schemas Pydantic pour Product."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.schemas.category import CategoryRead


class ProductBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=160)
    description: str = Field(..., min_length=10)
    color: Optional[str] = Field(None, max_length=50)
    price: Decimal = Field(..., gt=0, decimal_places=2)
    stock: int = Field(1, ge=0)
    image_url: Optional[str] = Field(None, max_length=500)


class ProductCreate(ProductBase):
    category_id: uuid.UUID


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=160)
    description: Optional[str] = Field(None, min_length=10)
    color: Optional[str] = Field(None, max_length=50)
    price: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    stock: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = Field(None, max_length=500)
    category_id: Optional[uuid.UUID] = None
    is_published: Optional[bool] = None


class SellerMini(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    full_name: Optional[str]


class ProductRead(ProductBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_published: bool
    views_count: int
    created_at: datetime
    category: CategoryRead
    seller: SellerMini


class ProductListResponse(BaseModel):
    items: list[ProductRead]
    total: int
    page: int
    page_size: int