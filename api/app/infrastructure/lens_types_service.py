from sqlalchemy.ext.asyncio import AsyncSession

from app.application.lens_types_repository import LensTypesRepository
from app.domain.entities.lens_type import LensTypeEntity


class LensTypesService:
    def __init__(self, db: AsyncSession):
        self.lens_types_repository = LensTypesRepository(db)

    async def get_all_lens_types(self) -> list[LensTypeEntity]:
        lens_types = await self.lens_types_repository.get_all()
        return [
            LensTypeEntity(
                id=lens_type.id,
                title=lens_type.title,
            )
            for lens_type in lens_types
        ]
