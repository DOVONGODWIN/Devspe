"""Integration Stripe : creation de Checkout Session et verification webhook."""
import stripe

from app.core.config import settings
from app.models.order import Order


stripe.api_key = settings.STRIPE_SECRET_KEY


def create_checkout_session(order: Order) -> stripe.checkout.Session:
    """Cree une session Stripe Checkout pour une commande pending."""
    line_items = []
    for item in order.items:
        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {
                    "name": item.product.name,
                    "description": (item.product.description[:100] + "...")
                                   if len(item.product.description) > 100
                                   else item.product.description,
                },
                "unit_amount": int(item.unit_price * 100),  # Stripe veut des centimes
            },
            "quantity": item.quantity,
        })

    session = stripe.checkout.Session.create(
        mode="payment",
        line_items=line_items,
        success_url=f"{settings.STRIPE_SUCCESS_URL}?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=settings.STRIPE_CANCEL_URL,
        metadata={"order_id": str(order.id)},
        client_reference_id=str(order.id),
    )
    return session


def verify_webhook_signature(payload: bytes, sig_header: str) -> stripe.Event:
    """Verifie la signature HMAC du webhook. Leve si invalide."""
    return stripe.Webhook.construct_event(
        payload=payload,
        sig_header=sig_header,
        secret=settings.STRIPE_WEBHOOK_SECRET,
    )