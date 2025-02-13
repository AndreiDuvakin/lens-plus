from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.patient import PatientEntity
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


@router.post("/patients/")
async def create_patient(
        patient: PatientEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user)
):
    patients_service = PatientsService(db)
    return await patients_service.create_patient(patient)


@router.put("/patients/{patient_id}/")
async def update_patient(
        patient_id: int,
        patient: PatientEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user)
):
    patients_service = PatientsService(db)
    return await patients_service.update_patient(patient_id, patient)

@router.delete("/patients/{patient_id}/", response_model=bool)
async def delete_patient(
        patient_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user)
):
    patient_service = PatientsService(db)
    return await patient_service.delete_patient(patient_id)
