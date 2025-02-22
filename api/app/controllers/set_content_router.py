from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.set_content import SetContentEntity
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.set_content_service import SetContentService

router = APIRouter()


@router.get(
    '/set_content/{set_id}/',
    response_model=list[SetContentEntity],
    summary='Get all set content by set ID',
    description='Returns a list of set content by set ID',
)
async def get_set_content_by_set_id(
        set_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    set_content_service = SetContentService(db)
    return await set_content_service.get_content_by_set_id(set_id)


@router.post(
    '/set_content/{set_id}/',
    response_model=list[SetContentEntity],
    summary='Create a new set content by set_id',
    description='Create a new set content by set_id',
)
async def create_set_content(
        set_id: int,
        set_content: list[SetContentEntity],
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    set_content_service = SetContentService(db)
    return await set_content_service.create_list_sets(set_id, set_content)


@router.put(
    '/set_content/{set_id}/',
    response_model=list[SetContentEntity],
    summary='Update a set content by set_id',
    description='Update a set content by set_id',
)
async def update_set_content(
        set_id: int,
        set_content: list[SetContentEntity],
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    set_content_service = SetContentService(db)
    return await set_content_service.update_set_content_by_set_id(set_id, set_content)
