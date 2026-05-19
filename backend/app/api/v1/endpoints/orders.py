"""Endpoints Orders + Checkout Stripe."""
import uuid
from fastapi import APIRouter, HTTPException, status

from app.api.deps import DbSession, CurrentUser
from app.schemas.order import CheckoutRequest, OrderRead, CheckoutResponse
from app.services import order_service, stripe_service

router = APIRouter()


@router.post("/checkout", response_model=CheckoutResponse, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutRequest,
    current_user: CurrentUser,
    db: DbSession,
):
    try:
        order = order_service.create_pending_order(db, current_user, payload.items)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    try:
        session = stripe_service.create_checkout_session(order)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erreur Stripe : {str(e)}",
        )

    order_service.attach_stripe_session(db, order, session.id)

    return CheckoutResponse(order_id=order.id, checkout_url=session.url)


@router.get("/me", response_model=list[OrderRead])
def list_my_orders(current_user: CurrentUser, db: DbSession):
    return order_service.list_user_orders(db, current_user)


@router.get("/{order_id}", response_model=OrderRead)
def get_my_order(order_id: uuid.UUID, current_user: CurrentUser, db: DbSession):
    order = order_service.get_order_for_user(db, order_id, current_user)
    if order is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Commande introuvable.")
    return order