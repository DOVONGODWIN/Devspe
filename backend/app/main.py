"""Point d'entree FastAPI."""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db import base_all  # noqa: F401

from app.api.v1.endpoints import (
    auth, categories, products, orders, stripe_webhook, stats,
    admin_users, admin_products, uploads
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[{settings.APP_NAME}] Demarrage en mode {settings.APP_ENV}")
    yield
    print(f"[{settings.APP_NAME}] Arret")


# 1. On cree l'app D'ABORD
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.APP_DEBUG,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    openapi_url="/openapi.json" if not settings.is_production else None,
    lifespan=lifespan,
)

# 2. CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Dossier statique pour les images uploadees (APRES la creation de app)
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# 4. Healthcheck
@app.get("/")
def bonjour():
    return {"message": " backnd marche tourn sur le port 8003 "}

@app.get("/health", tags=["meta"])
def health():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "env": settings.APP_ENV,
    }


@app.get("/", tags=["meta"])
def root():
    return JSONResponse({
        "message": "Nexaa Market API",
        "docs": "/docs",
        "version": settings.APP_VERSION,
    })


# 5. Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(stripe_webhook.router, prefix="/api/v1/stripe", tags=["stripe"])
app.include_router(stats.router, prefix="/api/v1/stats", tags=["stats"])
app.include_router(admin_users.router, prefix="/api/v1/admin/users", tags=["admin"])
app.include_router(admin_products.router, prefix="/api/v1/admin/products", tags=["admin"])
app.include_router(uploads.router, prefix="/api/v1/uploads", tags=["uploads"])


