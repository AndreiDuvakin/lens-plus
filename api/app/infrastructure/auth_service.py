import datetime

import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.users_repository import UsersRepository
from app.settings import get_auth_data


class AuthService:
    def __init__(self, db: AsyncSession):
        self.user_repository = UsersRepository(db)

    async def authenticate_user(self, login: str, password: str):
        user = await self.user_repository.get_by_login(login)

        if not user:
            return None

        if not user.check_password(password):
            return None

        return user

    @staticmethod
    def create_access_token(data: dict) -> str:
        to_encode = data.copy()
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=30)
        to_encode.update({"exp": expire})
        auth_data = get_auth_data()
        encode_jwt = jwt.encode(to_encode, auth_data['secret_key'], algorithm=auth_data['algorithm'])

        return encode_jwt
