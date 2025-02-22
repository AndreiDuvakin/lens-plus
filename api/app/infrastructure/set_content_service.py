from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.lens_types_repository import LensTypesRepository
from app.application.set_content_repository import SetContentRepository
from app.application.sets_repository import SetsRepository
from app.domain.entities.set_content import SetContentEntity
from app.domain.models import SetContent
from app.domain.models.lens import SideEnum


class SetContentService:
    def __init__(self, db: AsyncSession):
        self.set_content_repository = SetContentRepository(db)
        self.set_repository = SetsRepository(db)
        self.lens_types_repository = LensTypesRepository(db)

    async def get_all_set_content(self) -> list[SetContentEntity]:
        set_content = await self.set_content_repository.get_all()

        return [
            self.model_to_entity(content)
            for content in set_content
        ]

    async def get_content_by_set_id(self, set_id: int) -> Optional[list[SetContentEntity]]:
        _set = await self.set_repository.get_by_id(set_id)

        if not _set:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The set with this ID was not found',
            )

        set_content = await self.set_content_repository.get_by_set_id(set_id)

        return [
            self.model_to_entity(content)
            for content in set_content
        ]

    async def create_list_sets(self, set_id: int, sets_content: list[SetContentEntity]) -> list[SetContentEntity]:
        _set = await self.set_repository.get_by_id(set_id)

        if not _set:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The set with this ID was not found',
            )

        sets_content_models = []

        for content in sets_content:
            lens_type = await self.lens_types_repository.get_by_id(content.type_id)

            if not lens_type:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail='The lens type with this ID was not found',
                )

            sets_content_models.append(
                self.entity_to_model(content, set_id)
            )

        await self.set_content_repository.create_list(sets_content_models)

        return [
            self.model_to_entity(content)
            for content in sets_content_models
        ]

    async def create_set_content(self, set_id: int, set_content: SetContentEntity) -> SetContentEntity:
        _set = await self.set_repository.get_by_id(set_id)

        if not _set:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The set with this ID was not found',
            )

        lens_type = await self.lens_types_repository.get_by_id(set_content.type_id)

        if not lens_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The lens type with this ID was not found',
            )

        _set = await self.set_repository.get_by_id(set_content.set_id)

        if not _set:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The set with this ID was not found',
            )

        set_content_model = self.entity_to_model(set_content, set_id)

        await self.set_content_repository.create(set_content_model)

        return self.model_to_entity(set_content_model)

    async def update_set_content_by_set_id(self, set_id: int, sets_content: list[SetContentEntity]) -> list[
        SetContentEntity
    ]:
        _set = await self.set_repository.get_by_id(set_id)

        if not _set:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The set with this ID was not found',
            )

        old_set_content = await self.set_content_repository.get_by_set_id(set_id)

        await self.set_content_repository.delete_list_sets(
            list(old_set_content)
        )

        result = []

        for content in sets_content:
            model_content = self.entity_to_model(content)
            model_content = await self.set_content_repository.create(model_content)
            result.append(model_content)

        return [
            self.model_to_entity(content)
            for content in result
        ]

    async def update_set_content(self, set_content_id: int, set_content: SetContentEntity) -> Optional[
        SetContentEntity
    ]:
        set_content_model = await self.set_content_repository.get_by_id(set_content_id)

        if not set_content_model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set content not found")

        _set = await self.set_repository.get_by_id(set_content.set_id)

        if not _set:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The set with this ID was not found',
            )

        try:
            side_enum = SideEnum(set_content_model.side)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid side value: {set_content_model.side}. Must be 'левая' or 'правая'."
            )

        set_content_model.tor = set_content.tor
        set_content_model.trial = set_content.trial
        set_content_model.esa = set_content.esa
        set_content_model.fvc = set_content.fvc
        set_content_model.preset_refraction = set_content.preset_refraction
        set_content_model.diameter = set_content.diameter
        set_content_model.periphery_toricity = set_content.periphery_toricity
        set_content_model.side = side_enum
        set_content_model.count = set_content.count
        set_content_model.type_id = set_content.type_id
        set_content_model.set_id = set_content.set_id

        await self.set_content_repository.update(set_content_model)

        return self.model_to_entity(set_content_model)

    async def delete_set_content(self, set_content_id: int) -> Optional[SetContentEntity]:
        set_content = await self.set_content_repository.get_by_id(set_content_id)

        if not set_content:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Set content not found")

        result = await self.set_content_repository.delete(set_content)

        return self.model_to_entity(result)

    @staticmethod
    def entity_to_model(set_content: SetContentEntity, set_id=None) -> SetContent:

        if set_id is None:
            set_id = set_content.set_id

        try:
            side_enum = SideEnum(set_content.side)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid side value: {set_content.side}. Must be 'левая' or 'правая'."
            )

        set_content_model = SetContent(
            tor=set_content.tor,
            trial=set_content.trial,
            esa=set_content.esa,
            fvc=set_content.fvc,
            preset_refraction=set_content.preset_refraction,
            diameter=set_content.diameter,
            periphery_toricity=set_content.periphery_toricity,
            side=side_enum,
            count=set_content.count,
            type_id=set_content.type_id,
            set_id=set_id,
        )

        if set_content.id is not None:
            set_content_model.id = set_content.id

        return set_content_model

    @staticmethod
    def model_to_entity(set_content_model: SetContent) -> SetContentEntity:
        return SetContentEntity(
            id=set_content_model.id,
            tor=set_content_model.tor,
            trial=set_content_model.trial,
            esa=set_content_model.esa,
            fvc=set_content_model.fvc,
            preset_refraction=set_content_model.preset_refraction,
            diameter=set_content_model.diameter,
            periphery_toricity=set_content_model.periphery_toricity,
            side=set_content_model.side.value,
            count=set_content_model.count,
            type_id=set_content_model.type_id,
            set_id=set_content_model.set_id,
        )
