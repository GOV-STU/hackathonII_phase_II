"""
Database module for SQLModel engine and session management.
Provides connection pooling for Neon Serverless PostgreSQL.
"""
from typing import AsyncGenerator
from sqlmodel import SQLModel, create_engine
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from .config import settings


# Convert database URL for async support
async_database_url = settings.database_url
if async_database_url.startswith("postgresql://"):
    async_database_url = async_database_url.replace(
        "postgresql://", "postgresql+asyncpg://"
    )
elif async_database_url.startswith("sqlite://"):
    async_database_url = async_database_url.replace(
        "sqlite://", "sqlite+aiosqlite://"
    )

# Create async engine with appropriate configuration
if "postgresql" in async_database_url:
    engine = create_async_engine(
        async_database_url,
        echo=settings.environment == "development",
        future=True,
        pool_size=5,
        max_overflow=10,
    )
else:
    # SQLite configuration
    engine = create_async_engine(
        async_database_url,
        echo=settings.environment == "development",
        future=True,
        connect_args={"check_same_thread": False},
    )

# Create async session factory
async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db() -> None:
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency for getting async database sessions.

    Yields:
        AsyncSession: Database session
    """
    async with async_session_maker() as session:
        yield session
