"""Schemas pour les KPI."""
import uuid
from decimal import Decimal
from pydantic import BaseModel, ConfigDict


class TopProduct(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: uuid.UUID
    name: str
    total_sold: int
    revenue: Decimal


class SellerStats(BaseModel):
    total_sales: int
    total_revenue: Decimal
    average_basket: Decimal
    total_products: int
    published_products: int
    total_views: int
    top_products: list[TopProduct]


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_products: int
    published_products: int
    total_orders: int
    paid_orders: int
    pending_orders: int
    total_revenue: Decimal
    top_categories: list["CategoryStats"]


class CategoryStats(BaseModel):
    category_id: uuid.UUID
    name: str
    product_count: int