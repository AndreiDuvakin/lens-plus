from typing import Sequence, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Lens


class LensesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[Lens]:
        stmt = select(Lens)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, lens_id: int) -> Optional[Lens]:
        stmt = select(Lens).filter(Lens.id == lens_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, lens: Lens) -> Lens:
        self.db.add(lens)
        await self.db.commit()
        await self.db.refresh(lens)
        return lens

    async def update(self, lens: Lens) -> Lens:
        await self.db.merge(lens)
        await self.db.commit()
        return lens

    async def delete(self, lens: Lens) -> Lens:
        await self.db.delete(lens)
        await self.db.commit()
        return lens
