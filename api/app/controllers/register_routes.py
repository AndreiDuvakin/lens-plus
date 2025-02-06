from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.register import RegisterEntity
from app.infrastructure.auth_service import AuthService

router = APIRouter()


@router.post(
    "/register/",
    response_model=dict,
    summary="Регистрация пользователя",
    description="Производит регистрацию пользователя в системе.",
)
async def register_user(
        response: Response,
        user_data: RegisterEntity,
        db: AsyncSession = Depends(get_db)
):
    return {}
