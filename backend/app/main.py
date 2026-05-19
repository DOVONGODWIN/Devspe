"""Point d'entree FastAPI."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db import base_all  # noqa: F401  -- enregistre tous les modeles SQLAlchemy

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import auth, categories
from app.api.v1.endpoints import auth, categories, products
from app.api.v1.endpoints import auth, categories, products, orders



@asynccontextmanager
async def lifespan(app: FastAPI):
    """Hooks startup / shutdown."""
    # Startup
    print(f"[{settings.APP_NAME}] Demarrage en mode {settings.APP_ENV}")
    yield
    # Shutdown
    print(f"[{settings.APP_NAME}] Arret")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.APP_DEBUG,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    openapi_url="/openapi.json" if not settings.is_production else None,
    lifespan=lifespan,
)

# ===== CORS =====
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])


@app.get("/")
def bonjour():
    return {"message": " backnd marche tourn sur le port 8003 "}

# ===== Healthcheck =====
@app.get("/health", tags=["meta"])
def health():
    """hello app depuis backend"""
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


# ===== Routers a brancher au fur et a mesure =====
# from app.api.v1.endpoints import auth, users, products, categories, orders, stripe_webhook
# app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
# app.include_router(users.router, prefix="/api/v1/users", tags=["users"])
# app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
# app.include_router(categories.router, prefix="/api/v1/categories", tags=["categories"])
# app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
# app.include_router(stripe_webhook.router, prefix="/api/v1/stripe", tags=["stripe"])