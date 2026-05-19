"""Base declarative SQLAlchemy + import de tous les modeles pour Alembic."""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Classe de base pour tous les modeles ORM."""
    pass


# IMPORTANT : importer ici TOUS les modeles pour qu'Alembic les detecte.
# A completer au fur et a mesure que tu ajoutes des modeles.
from app.models.user import User  # noqa: E402, F401
from app.models.category import Category  # noqa: E402, F401
from app.models.product import Product  # noqa: E402, F401
from app.models.order import Order, OrderItem  # noqa: E402, F401
from app.models.refresh_token import RefreshToken  # noqa: E402, F401