"""Import de tous les modeles pour qu'Alembic les detecte."""
from app.db.base import Base  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.models.product import Product  # noqa: F401
from app.models.order import Order, OrderItem  # noqa: F401
from app.models.refresh_token import RefreshToken  # noqa: F401