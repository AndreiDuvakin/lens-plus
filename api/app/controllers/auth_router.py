from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.auth import AuthEntity
from app.domain.entities.token_entity import TokenEntity
from app.infrastructure.auth_service import AuthService

router = APIRouter()


@router.post(
    "/login/",
    response_model=TokenEntity,
    responses={401: {"description": "Invalid username or password"}},
    summary="User authentication",
    description="Logs in the user and outputs the `access_token` in the `cookie'",
)
async def auth_user(
        response: Response,
        user_data: AuthEntity,
        db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)

    token = await auth_service.authenticate_user(user_data.login, user_data.password)

    if token is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password"
        )

    response.set_cookie(
        key="users_access_token",
        value=token["access_token"],
        httponly=True,
        samesite="Lax",
    )

    return token
