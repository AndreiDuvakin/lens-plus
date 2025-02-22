from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.lens_types_repository import LensTypesRepository
from app.application.lenses_repository import LensesRepository
from app.domain.entities.lens import LensEntity
from app.domain.models import Lens
from app.domain.models.lens import SideEnum


class LensesService:
    def __init__(self, db: AsyncSession):
        self.lenses_repository = LensesRepository(db)
        self.lens_types_repository = LensTypesRepository(db)

    async def get_all_lenses(self) -> list[LensEntity]:
        lenses = await self.lenses_repository.get_all()

        return [
            self.model_to_entity(lens)
            for lens in lenses
        ]

    async def create_lens(self, lens: LensEntity) -> LensEntity:
        lens_type = await self.lens_types_repository.get_by_id(lens.type_id)

        if not lens_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The lens type with this ID was not found',
            )

        lens_model = self.entity_to_model(lens)

        await self.lenses_repository.create(lens_model)

        return self.model_to_entity(lens_model)

    async def update_lens(self, lens_id: int, lens: LensEntity) -> LensEntity:
        lens_model = await self.lenses_repository.get_by_id(lens_id)

        if not lens_model:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lens not found")

        try:
            side_enum = SideEnum(lens.side)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid side value: {lens.side}. Must be 'левая' or 'правая'."
            )

        lens_model.tor = lens.tor
        lens_model.trial = lens.trial
        lens_model.esa = lens.esa
        lens_model.fvc = lens.fvc
        lens_model.preset_refraction = lens.preset_refraction
        lens_model.diameter = lens.diameter
        lens_model.periphery_toricity = lens.periphery_toricity
        lens_model.side = side_enum
        lens_model.issued = lens.issued
        lens_model.type_id = lens.type_id

        await self.lenses_repository.update(lens_model)

        return self.model_to_entity(lens_model)

    async def delete_lens(self, lens_id: int) -> Optional[LensEntity]:
        lens = await self.lenses_repository.get_by_id(lens_id)

        if not lens:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lens not found")

        result = await self.lenses_repository.delete(lens)

        return self.model_to_entity(result)

    @staticmethod
    def entity_to_model(lens: LensEntity) -> Lens:

        try:
            side_enum = SideEnum(lens.side)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid side value: {lens.side}. Must be 'левая' or 'правая'."
            )

        lens_model = Lens(
            tor=lens.tor,
            trial=lens.trial,
            esa=lens.esa,
            fvc=lens.fvc,
            preset_refraction=lens.preset_refraction,
            diameter=lens.diameter,
            periphery_toricity=lens.periphery_toricity,
            side=side_enum,
            type_id=lens.type_id,
        )

        if lens.id is not None:
            lens.id = lens.id

        return lens_model

    @staticmethod
    def model_to_entity(lens_model: Lens) -> LensEntity:
        return LensEntity(
            id=lens_model.id,
            tor=lens_model.tor,
            trial=lens_model.trial,
            esa=lens_model.esa,
            fvc=lens_model.fvc,
            preset_refraction=lens_model.preset_refraction,
            diameter=lens_model.diameter,
            periphery_toricity=lens_model.periphery_toricity,
            side=lens_model.side.value,
            issued=lens_model.issued,
            type_id=lens_model.type_id,
        )
