from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.lenses_repository import LensesRepository
from app.application.set_content_repository import SetContentRepository
from app.application.sets_repository import SetsRepository
from app.domain.entities.lens import LensEntity
from app.domain.entities.set import SetEntity
from app.domain.models import Set, Lens


class SetsService:
    def __init__(self, db: AsyncSession):
        self.sets_repository = SetsRepository(db)
        self.set_content_repository = SetContentRepository(db)
        self.lenses_repository = LensesRepository(db)

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
            title=set_model.title,
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

        set_content = await self.set_content_repository.get_by_set_id(set_id)
        await self.set_content_repository.delete_list_sets(
            list(set_content)
        )

        result = await self.sets_repository.delete(_set)

        return SetEntity(
            id=result.id,
            title=result.title,
        )

    async def append_set_content_to_lenses(self, set_id: int) -> Optional[list[LensEntity]]:
        _set = await self.sets_repository.get_by_id(set_id)

        if not _set:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set not found")

        set_content = await self.set_content_repository.get_by_set_id(set_id)

        lenses = []
        for content in set_content:
            lens = Lens(
                tor=content.tor,
                trial=content.trial,
                esa=content.esa,
                fvc=content.fvc,
                preset_refraction=content.preset_refraction,
                diameter=content.diameter,
                periphery_toricity=content.periphery_toricity,
                side=content.side,
                type_id=content.type_id,
            )
            await self.lenses_repository.create(lens)
            lenses.append(
                LensEntity(
                    id=lens.id,
                    tor=lens.tor,
                    trial=lens.trial,
                    esa=lens.esa,
                    fvc=lens.fvc,
                    preset_refraction=lens.preset_refraction,
                    diameter=lens.diameter,
                    periphery_toricity=lens.periphery_toricity,
                    side=lens.side.value,
                    type_id=lens.type_id,
                )
            )

        return lenses

    @staticmethod
    def model_to_entity(_set: Set) -> SetEntity:
        return SetEntity(
            id=_set.id,
            title=_set.title,
        )

    @staticmethod
    def entity_to_model(_set: SetEntity) -> Set:
        set_model = Set(
            title=_set.title,
        )
