"""
Authentication service for user signup and login.
Handles user creation, authentication, and password verification.
"""
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from ..models.user import User, UserCreate, UserLogin, UserRead
from ..utils.password import hash_password, verify_password


async def signup(user_data: UserCreate, session: AsyncSession) -> UserRead:
    """
    Create a new user account.

    Args:
        user_data: User creation data with email and password
        session: Database session

    Returns:
        UserRead: Created user data (without password)

    Raises:
        HTTPException: If email already exists (409 Conflict)
    """
    # Check if user already exists
    statement = select(User).where(User.email == user_data.email)
    result = await session.execute(statement)
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered"
        )

    # Hash password and create user
    hashed_password = hash_password(user_data.password)
    new_user = User(
        email=user_data.email,
        hashed_password=hashed_password
    )

    session.add(new_user)
    await session.commit()
    await session.refresh(new_user)

    return UserRead(
        id=new_user.id,
        email=new_user.email,
        created_at=new_user.created_at
    )


async def login(login_data: UserLogin, session: AsyncSession) -> UserRead:
    """
    Authenticate a user and return user data.

    Args:
        login_data: Login credentials with email and password
        session: Database session

    Returns:
        UserRead: Authenticated user data (without password)

    Raises:
        HTTPException: If credentials are invalid (401 Unauthorized)
    """
    # Find user by email
    statement = select(User).where(User.email == login_data.email)
    result = await session.execute(statement)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    return UserRead(
        id=user.id,
        email=user.email,
        created_at=user.created_at
    )


async def get_user_by_email(email: str, session: AsyncSession) -> Optional[User]:
    """
    Get a user by email address.

    Args:
        email: User email address
        session: Database session

    Returns:
        User if found, None otherwise
    """
    statement = select(User).where(User.email == email)
    result = await session.execute(statement)
    return result.scalar_one_or_none()
