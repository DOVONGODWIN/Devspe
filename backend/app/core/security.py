"""Hashage de mots de passe et JWT."""
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

# Contexte de hashage : bcrypt avec cout 12 (bon compromis vitesse/securite)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


# ===== Mots de passe =====
def hash_password(plain_password: str) -> str:
    """Hash un mot de passe en clair avec bcrypt."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifie qu'un mot de passe en clair correspond au hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ===== JWT =====
def create_access_token(subject: UUID | str, extra_claims: Optional[dict] = None) -> str:
    """Genere un JWT d'acces de courte duree (15 min par defaut)."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access",
    }
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(subject: UUID | str) -> tuple[str, datetime]:
    """Genere un refresh token long. Retourne (token, expiration_datetime)."""
    expire = datetime.now(timezone.utc) + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "refresh",
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, expire


def decode_token(token: str) -> dict:
    """Decode et verifie un JWT. Leve JWTError si invalide ou expire."""
    return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])