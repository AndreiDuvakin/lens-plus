from typing import Optional, Sequence

from sqlalchemy import select, Row, RowMapping
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import LensType


class LensTypesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[LensType]:
        stmt = select(LensType)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, lens_type_id: int) -> Optional[LensType]:
        stmt = select(LensType).filter(LensType.id == lens_type_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, lens_type: LensType) -> LensType:
        self.db.add(lens_type)
        await self.db.commit()
        await self.db.refresh(lens_type)
        return lens_type

    async def update(self, lens_type: LensType) -> LensType:
        await self.db.merge(lens_type)
        await self.db.commit()
        return lens_type

    async def delete(self, lens_type_id: int) -> Row[LensType] | RowMapping | None:
        stmt = select(LensType).filter(LensType.id == lens_type_id)
        result = await self.db.execute(stmt)
        lens_type = result.scalars().first()

        if lens_type:
            await self.db.delete(lens_type)
            await self.db.commit()
            return lens_type

        return None
