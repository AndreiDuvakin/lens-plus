from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.lens_issues import LensIssueEntity
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.lens_issues_service import LensIssuesService

router = APIRouter()


@router.get(
    "/lens_issues/",
    response_model=list[LensIssueEntity],
    summary="Get all lens issues",
    description="Returns a list of all lens issues",
)
async def get_all_lens_issues(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lens_issues_service = LensIssuesService(db)
    return await lens_issues_service.get_all_lens_issues()


@router.post(
    "/lens_issues/",
    response_model=LensIssueEntity,
    summary="Create lens issue",
    description="Creates a new lens issue",
)
async def create_lens_issue(
        lens_issue: LensIssueEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    lens_issues_service = LensIssuesService(db)
    return await lens_issues_service.create_lens_issue(lens_issue, user.id)
