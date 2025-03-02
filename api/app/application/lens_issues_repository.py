from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.domain.models import LensIssue


class LensIssuesRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[LensIssue]:
        stmt = (
            select(LensIssue)
            .options(joinedload(LensIssue.lens))
            .options(joinedload(LensIssue.patient))
            .options(joinedload(LensIssue.doctor))
            .order_by(LensIssue.issue_date)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, lens_issue_id: int) -> Optional[LensIssue]:
        stmt = select(LensIssue).filter(LensIssue.id == lens_issue_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, lens_issue: LensIssue) -> LensIssue:
        self.db.add(lens_issue)
        await self.db.commit()
        await self.db.refresh(lens_issue)
        return lens_issue
