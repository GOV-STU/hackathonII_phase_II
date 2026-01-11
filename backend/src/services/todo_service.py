"""
Todo service layer.
Handles business logic for todo CRUD operations.
"""
from typing import Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlmodel import col

from ..models.todo import Todo, TodoCreate, TodoUpdate, TodoStatus, TodoPriority


async def create_todo(session: AsyncSession, todo_data: TodoCreate) -> Todo:
    """
    Create a new todo item.

    Args:
        session: Database session
        todo_data: Todo creation data

    Returns:
        Created todo item
    """
    todo = Todo.model_validate(todo_data)
    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


async def get_todos(
    session: AsyncSession,
    status: Optional[TodoStatus] = None,
    priority: Optional[TodoPriority] = None,
    search: Optional[str] = None,
    tag: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
) -> list[Todo]:
    """
    Get all todos with optional filtering and sorting.

    Args:
        session: Database session
        status: Filter by status
        priority: Filter by priority
        search: Search text in title and description
        tag: Filter by tag
        sort_by: Sort field (priority, title, created_at)
        sort_order: Sort order (asc, desc)

    Returns:
        List of todo items
    """
    query = select(Todo)

    # Apply filters
    if status:
        query = query.where(Todo.status == status)
    if priority:
        query = query.where(Todo.priority == priority)
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            or_(
                Todo.title.ilike(search_pattern),
                Todo.description.ilike(search_pattern),
            )
        )
    if tag:
        query = query.where(Todo.tags.contains([tag]))

    # Apply sorting
    if sort_by == "priority":
        # Custom priority sorting: high > medium > low
        priority_order = {
            TodoPriority.HIGH: 1,
            TodoPriority.MEDIUM: 2,
            TodoPriority.LOW: 3,
        }
        # Note: This is a simplified approach. For production, use CASE in SQL
        todos = (await session.execute(query)).scalars().all()
        todos = sorted(
            todos,
            key=lambda t: priority_order[t.priority],
            reverse=(sort_order == "desc"),
        )
        return list(todos)
    elif sort_by == "title":
        order_col = Todo.title
    else:  # created_at
        order_col = Todo.created_at

    if sort_order == "desc":
        query = query.order_by(order_col.desc())
    else:
        query = query.order_by(order_col.asc())

    result = await session.execute(query)
    return list(result.scalars().all())


async def get_todo_by_id(session: AsyncSession, todo_id: UUID) -> Optional[Todo]:
    """
    Get a todo by ID.

    Args:
        session: Database session
        todo_id: Todo ID

    Returns:
        Todo item or None if not found
    """
    result = await session.execute(select(Todo).where(Todo.id == todo_id))
    return result.scalar_one_or_none()


async def update_todo(
    session: AsyncSession, todo_id: UUID, todo_data: TodoUpdate
) -> Optional[Todo]:
    """
    Update a todo item.

    Args:
        session: Database session
        todo_id: Todo ID
        todo_data: Update data

    Returns:
        Updated todo item or None if not found
    """
    todo = await get_todo_by_id(session, todo_id)
    if not todo:
        return None

    # Update only provided fields
    update_data = todo_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)

    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo


async def delete_todo(session: AsyncSession, todo_id: UUID) -> bool:
    """
    Delete a todo item.

    Args:
        session: Database session
        todo_id: Todo ID

    Returns:
        True if deleted, False if not found
    """
    todo = await get_todo_by_id(session, todo_id)
    if not todo:
        return False

    await session.delete(todo)
    await session.commit()
    return True


async def toggle_todo_status(session: AsyncSession, todo_id: UUID) -> Optional[Todo]:
    """
    Toggle todo completion status.

    Args:
        session: Database session
        todo_id: Todo ID

    Returns:
        Updated todo item or None if not found
    """
    todo = await get_todo_by_id(session, todo_id)
    if not todo:
        return None

    # Toggle status
    todo.status = (
        TodoStatus.COMPLETED
        if todo.status == TodoStatus.PENDING
        else TodoStatus.PENDING
    )

    session.add(todo)
    await session.commit()
    await session.refresh(todo)
    return todo
