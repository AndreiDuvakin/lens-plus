from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.lens import LensEntity
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.lenses_service import LensesService

router = APIRouter()


@router.get(
    "/lenses/",
    response_model=list[LensEntity],
    summary="Get all lenses",
    description="Returns a list of all lenses",
)
async def get_all_lenses(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lenses_service = LensesService(db)
    return await lenses_service.get_all_lenses()


@router.post(
    "/lenses/",
    response_model=LensEntity,
    summary="Create lens",
    description="Creates a new lens",
)
async def create_lens(
        lens: LensEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lenses_service = LensesService(db)
    return await lenses_service.create_lens(lens)


@router.put(
    "/lenses/{lens_id}/",
    response_model=LensEntity,
    summary="Update lens",
    description="Updates an existing lens",
)
async def update_lens(
        lens_id: int,
        lens: LensEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lenses_service = LensesService(db)
    return await lenses_service.update_lens(lens_id, lens)


@router.delete(
    "/lenses/{lens_id}/",
    response_model=bool,
    summary="Delete lens",
    description="Deletes an existing lens",
)
async def delete_lens(
        lens_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lenses_service = LensesService(db)
    return await lenses_service.delete_lens(lens_id)
