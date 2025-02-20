from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.entities.patient import PatientEntity
from app.infrastructure.dependencies import get_current_user
from app.infrastructure.patients_service import PatientsService

router = APIRouter()


@router.get(
    "/patients/",
    response_model=list[PatientEntity],
    summary="Get all patients",
    description="Returns a list of all patients",
)
async def get_all_patients(
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    patients_service = PatientsService(db)
    return await patients_service.get_all_patients()


@router.post(
    "/patients/",
    response_model=PatientEntity,
    summary="Create a new patient",
    description="Creates a new patient",
)
async def create_patient(
        patient: PatientEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    patients_service = PatientsService(db)
    return await patients_service.create_patient(patient)


@router.put(
    "/patients/{patient_id}/",
    response_model=PatientEntity,
    summary="Update a patient",
    description="Updates a patient",
)
async def update_patient(
        patient_id: int,
        patient: PatientEntity,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    patients_service = PatientsService(db)
    return await patients_service.update_patient(patient_id, patient)


@router.delete(
    "/patients/{patient_id}/",
    response_model=PatientEntity,
    summary="Delete a patient",
    description="Deletes a patient",
)
async def delete_patient(
        patient_id: int,
        db: AsyncSession = Depends(get_db),
        user=Depends(get_current_user),
):
    patient_service = PatientsService(db)
    return await patient_service.delete_patient(patient_id)
