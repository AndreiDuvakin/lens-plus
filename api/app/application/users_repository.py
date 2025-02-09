from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from app.domain.models.users import User


class UsersRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        stmt = select(User)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, user_id: int) -> Optional[User]:
        stmt = select(User).filter(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_by_login(self, user_login: str) -> Optional[User]:
        stmt = (
            select(User)
            .filter(User.login == user_login)
            .options(joinedload(User.role))
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_by_id_with_role(self, user_id: int) -> Optional[User]:
        stmt = (
            select(User)
            .filter(User.id == user_id)
            .options(joinedload(User.role))
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
