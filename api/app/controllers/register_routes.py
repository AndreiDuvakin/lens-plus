from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.register import RegisterEntity
from app.infrastructure.users_service import UsersService

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
    user_service = UsersService(db)
    user = await user_service.register_user(user_data)
    return user.model_dump()
