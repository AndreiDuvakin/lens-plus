from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.auth import AuthEntity
from app.infrastructure.auth_service import AuthService

router = APIRouter()


@router.post(
    "/login/",
    response_model=dict,
    responses={401: {"description": "Неверный логин или пароль"}},
    summary="Аутентификация пользователя",
    description="Производит вход пользователя и выдает `access_token` в `cookie`.",
)
async def auth_user(
        response: Response,
        user_data: AuthEntity,
        db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)

    check = await auth_service.authenticate_user(
        login=user_data.login, password=user_data.password
    )

    if check is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
        )

    access_token = auth_service.create_access_token({"sub": str(check.id)})

    response.set_cookie(
        key="users_access_token",
        value=access_token,
        httponly=True,
        samesite="Lax",
    )

    return {"access_token": access_token, "refresh_token": None}

