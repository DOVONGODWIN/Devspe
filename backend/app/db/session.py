"""Session SQLAlchemy synchrone (compatible Passenger WSGI sur N0C)."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Engine SYNC - volontaire pour la compatibilite WSGI/Passenger sur N0C.
# Ne pas migrer vers create_async_engine, le pont a2wsgi ne supporte pas bien l'async DB.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,   # detecte les connexions zombies (utile en mutualise)
    pool_size=5,
    max_overflow=10,
    echo=settings.APP_DEBUG and not settings.is_production,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Session:
    """Dependency FastAPI : fournit une session DB par requete."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()