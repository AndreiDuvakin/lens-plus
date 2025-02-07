from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.domain.models import Role


class RolesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self):
        stmt = select(Role)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, role_id: int):
        stmt = select(Role).filter(Role.id == role_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()
