from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.patients_service import PatientsService

router = APIRouter()


@router.get("/patients/")
async def get_all_patients(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user)
):
    patients_service = PatientsService(db)
    return await patients_service.get_all_patients()
