from typing import Sequence, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import SetContent


class SetContentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[SetContent]:
        stmt = select(SetContent)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, set_content_id: int) -> Optional[SetContent]:
        stmt = select(SetContent).filter(SetContent.id == set_content_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_by_set_id(self, set_id: int) -> Sequence[SetContent]:
        stmt = select(SetContent).filter(SetContent.set_id == set_id)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def create_list(self, sets_content: list[SetContent]) -> list[SetContent]:
        self.db.add_all(sets_content)
        await self.db.commit()
        await self.db.refresh(sets_content)
        return sets_content

    async def create(self, set_content: SetContent) -> SetContent:
        self.db.add(set_content)
        await self.db.commit()
        await self.db.refresh(set_content)
        return set_content

    async def update(self, set_content: SetContent) -> SetContent:
        await self.db.merge(set_content)
        await self.db.commit()
        return set_content

    async def delete(self, set_content: SetContent) -> SetContent:
        await self.db.delete(set_content)
        await self.db.commit()
        return set_content

    async def delete_list_sets(self, sets_content: list[SetContent]) -> list[SetContent]:
        await self.db.delete(sets_content)
        await self.db.commit()
        return sets_content
