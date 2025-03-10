from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.lens_issues_repository import LensIssuesRepository
from app.application.lenses_repository import LensesRepository
from app.application.patients_repository import PatientsRepository
from app.application.users_repository import UsersRepository
from app.domain.entities.lens_issues import LensIssueEntity
from app.domain.models import LensIssue
from app.infrastructure.lenses_service import LensesService
from app.infrastructure.patients_service import PatientsService
from app.infrastructure.users_service import UsersService


class LensIssuesService:
    def __init__(self, db: AsyncSession):
        self.lens_issues_repository = LensIssuesRepository(db)
        self.patient_repository = PatientsRepository(db)
        self.users_repository = UsersRepository(db)
        self.lenses_repository = LensesRepository(db)

    async def get_all_lens_issues(self) -> list[LensIssueEntity]:
        lens_issues = await self.lens_issues_repository.get_all()

        return [
            self.model_to_entity(lens_issue)
            for lens_issue in lens_issues
        ]

    async def create_lens_issue(self, lens_issue: LensIssueEntity, user_id: int) -> LensIssueEntity:
        patient = await self.patient_repository.get_by_id(lens_issue.patient_id)

        if not patient:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The patient with this ID was not found',
            )

        user = await self.users_repository.get_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The user with this ID was not found',
            )

        lens_issue.doctor_id = user_id

        lens = await self.lenses_repository.get_by_id(lens_issue.lens_id)

        if not lens:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The lens with this ID was not found',
            )

        if lens.issued:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='The lens is already issued',
            )

        lens_issue_model = self.entity_to_model(lens_issue)

        await self.lens_issues_repository.create(lens_issue_model)

        lens.issued = True

        await self.lenses_repository.update(lens)

        return self.model_to_entity(lens_issue_model)

    @staticmethod
    def entity_to_model(lens_issue: LensIssueEntity) -> LensIssue:
        lens_issue_model = LensIssue(
            issue_date=lens_issue.issue_date,
            patient_id=lens_issue.patient_id,
            doctor_id=lens_issue.doctor_id,
            lens_id=lens_issue.lens_id,
        )

        if lens_issue.id is not None:
            lens_issue_model.id = lens_issue.id

        return lens_issue_model

    @staticmethod
    def model_to_entity(lens_issue_model: LensIssue) -> LensIssueEntity:
        lens_issue_entity = LensIssueEntity(
            id=lens_issue_model.id,
            issue_date=lens_issue_model.issue_date,
            patient_id=lens_issue_model.patient_id,
            doctor_id=lens_issue_model.doctor_id,
            lens_id=lens_issue_model.lens_id,
        )

        if lens_issue_model.doctor is not None:
            lens_issue_entity.doctor = UsersService.model_to_entity(lens_issue_model.doctor)

        if lens_issue_model.patient is not None:
            lens_issue_entity.patient = PatientsService.model_to_entity(lens_issue_model.patient)

        if lens_issue_model.lens is not None:
            lens_issue_entity.lens = LensesService.model_to_entity(lens_issue_model.lens)

        return lens_issue_entity
