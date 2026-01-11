"""
Todo API endpoints.
Provides RESTful CRUD operations for todo items.
"""
from typing import Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..models.todo import TodoCreate, TodoUpdate, TodoRead, TodoStatus, TodoPriority
from ..services import todo_service

router = APIRouter(prefix="/api/v1/todos", tags=["todos"])


@router.post("", response_model=TodoRead, status_code=201)
async def create_todo(
    todo_data: TodoCreate,
    session: AsyncSession = Depends(get_session),
):
    """
    Create a new todo item.

    Args:
        todo_data: Todo creation data
        session: Database session

    Returns:
        Created todo item
    """
    todo = await todo_service.create_todo(session, todo_data)
    return todo


@router.get("", response_model=list[TodoRead])
async def list_todos(
    status: Optional[TodoStatus] = Query(None, description="Filter by status"),
    priority: Optional[TodoPriority] = Query(None, description="Filter by priority"),
    search: Optional[str] = Query(None, max_length=200, description="Search text"),
    tag: Optional[str] = Query(None, max_length=50, description="Filter by tag"),
    sort_by: str = Query("created_at", pattern="^(priority|title|created_at)$"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$"),
    session: AsyncSession = Depends(get_session),
):
    """
    List all todos with optional filtering and sorting.

    Args:
        status: Filter by completion status
        priority: Filter by priority level
        search: Search text in title and description
        tag: Filter by tag
        sort_by: Sort field (priority, title, created_at)
        sort_order: Sort order (asc, desc)
        session: Database session

    Returns:
        List of todo items
    """
    todos = await todo_service.get_todos(
        session,
        status=status,
        priority=priority,
        search=search,
        tag=tag,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    return todos


@router.get("/{todo_id}", response_model=TodoRead)
async def get_todo(
    todo_id: UUID,
    session: AsyncSession = Depends(get_session),
):
    """
    Get a todo by ID.

    Args:
        todo_id: Todo ID
        session: Database session

    Returns:
        Todo item

    Raises:
        HTTPException: 404 if todo not found
    """
    todo = await todo_service.get_todo_by_id(session, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.put("/{todo_id}", response_model=TodoRead)
async def update_todo(
    todo_id: UUID,
    todo_data: TodoUpdate,
    session: AsyncSession = Depends(get_session),
):
    """
    Update a todo item.

    Args:
        todo_id: Todo ID
        todo_data: Update data
        session: Database session

    Returns:
        Updated todo item

    Raises:
        HTTPException: 404 if todo not found
    """
    todo = await todo_service.update_todo(session, todo_id, todo_data)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.delete("/{todo_id}", status_code=204)
async def delete_todo(
    todo_id: UUID,
    session: AsyncSession = Depends(get_session),
):
    """
    Delete a todo item.

    Args:
        todo_id: Todo ID
        session: Database session

    Raises:
        HTTPException: 404 if todo not found
    """
    deleted = await todo_service.delete_todo(session, todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")


@router.post("/{todo_id}/toggle", response_model=TodoRead)
async def toggle_todo_status(
    todo_id: UUID,
    session: AsyncSession = Depends(get_session),
):
    """
    Toggle todo completion status.

    Args:
        todo_id: Todo ID
        session: Database session

    Returns:
        Updated todo item

    Raises:
        HTTPException: 404 if todo not found
    """
    todo = await todo_service.toggle_todo_status(session, todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo
