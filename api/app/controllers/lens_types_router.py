from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.lens_type import LensTypeEntity
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.lens_types_service import LensTypesService

router = APIRouter()


@router.get(
    "/lens_types/",
    response_model=list[LensTypeEntity],
    summary="Get all lens types",
    description="Returns a list of all lens types",
)
async def get_all_lens_types(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lens_types_service = LensTypesService(db)
    return await lens_types_service.get_all_lens_types()
