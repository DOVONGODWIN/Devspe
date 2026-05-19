"""Endpoint webhook Stripe."""
import uuid
from fastapi import APIRouter, Request, HTTPException, status
import stripe

from app.api.deps import DbSession
from app.services import order_service, stripe_service

router = APIRouter()


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(request: Request, db: DbSession):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if sig_header is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Signature manquante.")

    try:
        event = stripe_service.verify_webhook_signature(payload, sig_header)
    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Signature invalide.")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        order_id = session.get("metadata", {}).get("order_id")
        payment_intent = session.get("payment_intent")

        if order_id is None:
            return {"received": True, "ignored": "no order_id in metadata"}

        order = order_service.get_order_by_stripe_session(db, session["id"])
        if order is None:
            order = order_service.get_order_for_user_raw(db, uuid.UUID(order_id))

        if order is not None:
            order_service.mark_order_paid(db, order, payment_intent=payment_intent)

    return {"received": True}