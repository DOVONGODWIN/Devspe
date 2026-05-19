"""Schemas Pydantic pour Order et OrderItem."""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: uuid.UUID
    quantity: int = Field(..., ge=1, le=100)


class CheckoutRequest(BaseModel):
    items: list[OrderItemCreate] = Field(..., min_length=1)


class ProductMini(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    image_url: Optional[str]


class OrderItemRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    product: ProductMini
    quantity: int
    unit_price: Decimal


class OrderRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    total_amount: Decimal
    status: OrderStatus
    created_at: datetime
    items: list[OrderItemRead]


class CheckoutResponse(BaseModel):
    order_id: uuid.UUID
    checkout_url: str