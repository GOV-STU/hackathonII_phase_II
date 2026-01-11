"""
Todo data models using SQLModel.
Defines the Todo entity with status and priority enums.
"""
from datetime import datetime
from enum import Enum
from typing import Optional
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel, Column
from sqlalchemy import JSON


class TodoStatus(str, Enum):
    """Todo completion status."""
    PENDING = "pending"
    COMPLETED = "completed"


class TodoPriority(str, Enum):
    """Todo priority level."""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class TodoBase(SQLModel):
    """Base model for Todo with shared fields."""
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: TodoStatus = Field(default=TodoStatus.PENDING)
    priority: TodoPriority = Field(default=TodoPriority.MEDIUM)
    tags: list[str] = Field(default_factory=list, sa_column=Column(JSON))


class Todo(TodoBase, table=True):
    """Todo database model."""
    __tablename__ = "todos"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class TodoCreate(TodoBase):
    """Model for creating a new todo."""
    pass


class TodoUpdate(SQLModel):
    """Model for updating an existing todo (all fields optional)."""
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[TodoStatus] = None
    priority: Optional[TodoPriority] = None
    tags: Optional[list[str]] = None


class TodoRead(TodoBase):
    """Model for reading a todo (includes generated fields)."""
    id: UUID
    created_at: datetime
    updated_at: datetime
