"""Endpoints KPI : seller stats + admin stats."""
from fastapi import APIRouter

from app.api.deps import DbSession, CurrentUser, CurrentAdmin
from app.schemas.stats import SellerStats, AdminStats
from app.services import stats_service

router = APIRouter()


@router.get("/seller/me", response_model=SellerStats)
def my_seller_stats(current_user: CurrentUser, db: DbSession):
    return stats_service.get_seller_stats(db, current_user.id)


@router.get("/admin", response_model=AdminStats)
def admin_stats(_admin: CurrentAdmin, db: DbSession):
    return stats_service.get_admin_stats(db)