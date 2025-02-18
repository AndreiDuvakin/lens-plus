from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.lens_types_repository import LensTypesRepository
from app.application.lenses_repository import LensesRepository
from app.domain.entities.lens import LensEntity
from app.domain.models import Lens


class LensesService:
    def __init__(self, db: AsyncSession):
        self.lenses_repository = LensesRepository(db)
        self.lens_types_repository = LensTypesRepository(db)

    async def get_all_lenses(self) -> list[LensEntity]:
        lenses = await self.lenses_repository.get_all()
        return [
            LensEntity(
                id=lens.id,
                tor=lens.tor,
                trial=lens.trial,
                esa=lens.esa,
                fvc=lens.fvc,
                preset_refraction=lens.preset_refraction,
                diameter=lens.diameter,
                periphery_toricity=lens.periphery_toricity,
                side=lens.side,
                issued=lens.issued,
                type_id=lens.type_id,
            )
            for lens in lenses
        ]

    async def create_lens(self, lens: LensEntity) -> LensEntity:
        lens_type = self.lens_types_repository.get_by_id(lens.type_id)

        if not lens_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The lens type with this ID was not found'
            )

        lens_model = Lens(
            tor=lens.tor,
            trial=lens.trial,
            esa=lens.esa,
            fvc=lens.fvc,
            preset_refraction=lens.preset_refraction,
            diameter=lens.diameter,
            periphery_toricity=lens.periphery_toricity,
            side=lens.side,
            type_id=lens.type_id,
        )
        await self.lenses_repository.create(lens_model)
        return LensEntity(
            id=lens_model.id,
            tor=lens_model.tor,
            trial=lens_model.trial,
            esa=lens_model.esa,
            fvc=lens_model.fvs,
            preset_refraction=lens_model.preset_refraction,
            diameter=lens_model.diameter,
            periphery_toricity=lens_model.periphery_toricity,
            side=lens_model.side,
            issued=lens_model.issued,
            type_id=lens_model.type_id,
        )

    async def update_lens(self, lens_id: int, lens: LensEntity) -> LensEntity:
        lens_model = await self.lenses_repository.get_by_id(lens_id)

        if lens_model:
            lens_model.tor = lens.tor
            lens_model.trial = lens.trial
            lens_model.esa = lens.esa
            lens_model.fvc = lens.fvc
            lens_model.preset_refraction = lens.preset_refraction
            lens_model.diameter = lens.diameter
            lens_model.periphery_toricity = lens.periphery_toricity
            lens_model.side = lens.side
            lens_model.issued = lens.issued
            lens_model.type_id = lens.type_id
            await self.lenses_repository.update(lens_model)
            return LensEntity(
                id=lens_model.id,
                tor=lens_model.tor,
                trial=lens_model.trial,
                esa=lens_model.esa,
                fvc=lens_model.fvs,
                preset_refraction=lens_model.preset_refraction,
                diameter=lens_model.diameter,
                periphery_toricity=lens_model.periphery_toricity,
                side=lens_model.side,
                issued=lens_model.issued,
                type_id=lens_model.type_id,
            )

        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lens not found")

    async def delete_lens(self, lens_id: int) -> Optional[bool]:
        result = await self.lenses_repository.delete(lens_id) is not None

        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lens not found")

        return result
