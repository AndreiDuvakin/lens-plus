from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.sets_repository import SetsRepository
from app.domain.entities.set import SetEntity
from app.domain.models import Set


class SetsService:
    def __init__(self, db: AsyncSession):
        self.sets_repository = SetsRepository(db)

    async def get_all_sets(self) -> list[SetEntity]:
        sets = await self.sets_repository.get_all()
        return [
            SetEntity(
                id=_set.id,
                title=_set.title,
            )
            for _set in sets
        ]

    async def create_set(self, _set: SetEntity) -> SetEntity:
        set_model = Set(
            title=_set.title,
        )
        await self.sets_repository.create(set_model)
        return SetEntity(
            id=set_model.id,
            title=set_model.id,
        )

    async def update_set(self, set_id: int, _set: SetEntity) -> SetEntity:
        set_model = await self.sets_repository.get_by_id(set_id)

        if not set_model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set not found")

        set_model.title = _set.title

        await self.sets_repository.update(set_model)

        return SetEntity(
            id=set_model.id,
            title=set_model.title,
        )

    async def delete_set(self, set_id: int) -> Optional[SetEntity]:
        _set = await self.sets_repository.get_by_id(set_id)

        if not _set:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set not found")

        result = await self.sets_repository.delete(_set)

        return SetEntity(
            id=result.id,
            title=result.title,
        )
