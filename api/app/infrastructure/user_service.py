import re

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.roles_repository import RolesRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.register import RegisterEntity
from app.domain.entities.user import UserEntity
from app.domain.models import User


class UserService:
    def __init__(self, db: AsyncSession):
        self.user_repository = UsersRepository(db)
        self.role_repository = RolesRepository(db)

    async def register_user(self, register_entity: RegisterEntity) -> UserEntity:
        role = await self.role_repository.get_by_id(register_entity.role_id)
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The role with this ID was not found'
            )

        user = await self.user_repository.get_by_login(register_entity.login)
        if user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Such a login already exists'
            )

        if not self.is_strong_password(register_entity.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is too weak. It must contain at least 8 characters, including an uppercase letter, a lowercase letter, a digit, and a special character."
            )

        user_model = User(
            first_name=register_entity.first_name,
            last_name=register_entity.last_name,
            patronymic=register_entity.patronymic,
            login=register_entity.login,
            role_id=register_entity.role_id,
        )
        user_model.set_password(register_entity.password)

        created_user = await self.user_repository.create(user_model)

        return UserEntity(
            id=created_user.id,
            first_name=created_user.first_name,
            last_name=created_user.last_name,
            patronymic=created_user.patronymic,
            login=created_user.login,
            role_id=created_user.role_id,
        )

    @staticmethod
    def is_strong_password(password: str) -> bool:
        if len(password) < 8:
            return False

        if not re.search(r"[A-Z]", password):
            return False

        if not re.search(r"[a-z]", password):
            return False

        if not re.search(r"\d", password):
            return False

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False

        return True
