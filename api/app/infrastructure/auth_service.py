import datetime
from typing import Optional

import jwt
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.users_repository import UsersRepository
from app.settings import get_auth_data


class AuthService:
    def __init__(self, db: AsyncSession):
        self.users_repository = UsersRepository(db)

    async def authenticate_user(self, login: str, password: str) -> Optional[dict]:
        user = await self.users_repository.get_by_login(login)
        if user and user.check_password(password):
            access_token = self.create_access_token({"user_id": user.id})
            return {
                "access_token": access_token,
                "user_id": user.id
            }

        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid login or password")

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30)
        to_encode.update({"exp": expire})
        auth_data = get_auth_data()
        encode_jwt = jwt.encode(to_encode, auth_data['secret_key'], algorithm=auth_data['algorithm'])

        return encode_jwt
