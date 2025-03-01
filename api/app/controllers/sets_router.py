from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.lens import LensEntity
from app.domain.entities.set import SetEntity
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.sets_service import SetsService

router = APIRouter()


@router.get(
    '/sets/',
    response_model=list[SetEntity],
    summary='Get all sets',
    description='Returns a list of all sets',
)
async def get_all_sets(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    sets_service = SetsService(db)
    return await sets_service.get_all_sets()


@router.post(
    '/sets/',
    response_model=SetEntity,
    summary='Create a new set',
    description='Create a new set',
)
async def create_set(
        _set: SetEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    sets_service = SetsService(db)
    return await sets_service.create_set(_set)


@router.put(
    '/sets/{set_id}/',
    response_model=SetEntity,
    summary='Update a set',
    description='Update a set,'
)
async def update_set(
        set_id: int,
        _set: SetEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    sets_service = SetsService(db)
    return await sets_service.update_set(set_id, _set)


@router.post(
    '/sets/append_lenses/{set_id}/',
    response_model=list[LensEntity],
    summary='Append content from set to lenses',
    description='Get all content from set, converting to lens and appending to database',
)
async def append_lenses_set(
        set_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    sets_service = SetsService(db)
    return await sets_service.append_set_content_to_lenses(set_id)


@router.delete(
    '/sets/{set_id}/',
    response_model=SetEntity,
    summary='Delete set',
    description='Delete an existing set',
)
async def delete_set(
        set_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    sets_service = SetsService(db)
    return await sets_service.delete_set(set_id)
