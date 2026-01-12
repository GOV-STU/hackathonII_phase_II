"""
User data models using SQLModel.
Defines the User entity for authentication.
"""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    """Base model for User with shared fields."""
    email: str = Field(unique=True, index=True, max_length=255)


class User(UserBase, table=True):
    """User database model."""
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class UserCreate(SQLModel):
    """Model for creating a new user."""
    email: str = Field(max_length=255)
    password: str = Field(min_length=6, max_length=100)


class UserLogin(SQLModel):
    """Model for user login."""
    email: str = Field(max_length=255)
    password: str = Field(min_length=6, max_length=100)


class UserRead(UserBase):
    """Model for reading a user (excludes password)."""
    id: UUID
    created_at: datetime
