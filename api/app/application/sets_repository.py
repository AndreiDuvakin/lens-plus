from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Set


class SetsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[Set]:
        stmt = select(Set)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, set_id: int) -> Optional[Set]:
        stmt = select(Set).filter(Set.id == set_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, _set: Set) -> Set:
        self.db.add(_set)
        await self.db.commit()
        await self.db.refresh(_set)
        return _set

    async def update(self, _set: Set) -> Set:
        await self.db.merge(_set)
        await self.db.commit()
        return _set

    async def delete(self, _set: Set) -> Set:
        await self.db.delete(_set)
        await self.db.commit()
        return _set
