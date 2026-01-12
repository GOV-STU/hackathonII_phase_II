"""
Authentication API endpoints.
Provides signup and login functionality.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_session
from ..models.user import UserCreate, UserLogin, UserRead
from ..services import auth_service

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_session)
) -> UserRead:
    """
    Create a new user account.

    Args:
        user_data: User registration data (email and password)
        session: Database session

    Returns:
        UserRead: Created user data (without password)

    Raises:
        409: Email already registered
        400: Invalid input data
        500: Internal server error
    """
    return await auth_service.signup(user_data, session)


@router.post("/login", response_model=UserRead, status_code=status.HTTP_200_OK)
async def login(
    login_data: UserLogin,
    session: AsyncSession = Depends(get_session)
) -> UserRead:
    """
    Authenticate a user and return user data.

    Args:
        login_data: Login credentials (email and password)
        session: Database session

    Returns:
        UserRead: Authenticated user data (without password)

    Raises:
        401: Invalid credentials
        400: Invalid input data
        500: Internal server error
    """
    return await auth_service.login(login_data, session)
