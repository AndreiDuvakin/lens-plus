from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.register import RegisterEntity
from app.infrastructure.auth_service import AuthService
from app.infrastructure.user_service import UserService

router = APIRouter()


@router.post(
    "/register/",
    response_model=dict,
    summary="User Registration",
    description="Performs user registration in the system",
)
async def register_user(
        user_data: RegisterEntity,
        db: AsyncSession = Depends(get_db)
):
    user_service = UserService(db)
    user = await user_service.register_user(user_data)
    return user.model_dump()
