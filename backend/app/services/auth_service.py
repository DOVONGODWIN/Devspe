"""Logique metier pour l'authentification."""
import hashlib
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.schemas.user import UserCreate


def _hash_refresh_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def register_user(db: Session, payload: UserCreate) -> User:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing is not None:
        raise ValueError("Un compte existe deja avec cet email.")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = db.scalar(select(User).where(User.email == email))
    if user is None or not user.is_active:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def issue_tokens(db: Session, user: User) -> tuple[str, str]:
    access = create_access_token(user.id)
    refresh, expires_at = create_refresh_token(user.id)

    db_token = RefreshToken(
        user_id=user.id,
        token_hash=_hash_refresh_token(refresh),
        expires_at=expires_at,
    )
    db.add(db_token)
    db.commit()

    return access, refresh


def refresh_access_token(db: Session, refresh_token: str) -> tuple[str, str]:
    try:
        payload = decode_token(refresh_token)
    except Exception:
        raise ValueError("Refresh token invalide ou expire.")

    if payload.get("type") != "refresh":
        raise ValueError("Mauvais type de token.")

    user_id = payload.get("sub")
    if user_id is None:
        raise ValueError("Token mal forme.")

    token_hash = _hash_refresh_token(refresh_token)
    db_token = db.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    )
    if db_token is None or db_token.revoked:
        raise ValueError("Refresh token revoque ou inconnu.")

    if db_token.expires_at < datetime.now(timezone.utc):
        raise ValueError("Refresh token expire.")

    user = db.scalar(select(User).where(User.id == uuid.UUID(user_id)))
    if user is None or not user.is_active:
        raise ValueError("Utilisateur introuvable ou inactif.")

    # Rotation : on revoque l'ancien avant d'emettre le nouveau
    db_token.revoked = True
    db.add(db_token)
    db.commit()

    return issue_tokens(db, user)


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    token_hash = _hash_refresh_token(refresh_token)
    db_token = db.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == token_hash)
    )
    if db_token is not None and not db_token.revoked:
        db_token.revoked = True
        db.add(db_token)
        db.commit()