"""
FastAPI application entry point.
Initializes the app with CORS middleware and error handlers.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

from .config import settings
from .database import init_db

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    logger.info("Starting Todo API...")
    await init_db()
    logger.info("Database initialized")
    yield
    # Shutdown
    logger.info("Shutting down Todo API...")


# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="RESTful API for managing todo items in the Phase II Todo application",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions."""
    logger.error(f"Unexpected error: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


# Import routers
from .api.health import router as health_router
from .api.todos import router as todos_router
from .api.auth import router as auth_router

# Register routers
app.include_router(health_router)
app.include_router(todos_router)
app.include_router(auth_router)


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Todo API",
        "version": "1.0.0",
        "docs": "/docs",
    }
