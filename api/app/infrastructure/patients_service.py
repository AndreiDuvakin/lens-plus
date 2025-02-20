from typing import Optional

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status

from app.application.patients_repository import PatientsRepository
from app.domain.entities.patient import PatientEntity
from app.domain.models import Patient


class PatientsService:
    def __init__(self, db: AsyncSession):
        self.patient_repository = PatientsRepository(db)

    async def get_all_patients(self) -> list[PatientEntity]:
        patients = await self.patient_repository.get_all()
        return [
            PatientEntity(
                id=patient.id,
                first_name=patient.first_name,
                last_name=patient.last_name,
                patronymic=patient.patronymic,
                birthday=patient.birthday,
                address=patient.address,
                email=patient.email,
                phone=patient.phone,
                diagnosis=patient.diagnosis,
                correction=patient.correction,
            )
            for patient in patients
        ]

    async def create_patient(self, patient: PatientEntity) -> PatientEntity:
        patient_model = Patient(
            first_name=patient.first_name,
            last_name=patient.last_name,
            patronymic=patient.patronymic,
            birthday=patient.birthday,
            address=patient.address,
            email=patient.email,
            phone=patient.phone,
            diagnosis=patient.diagnosis,
            correction=patient.correction,
        )
        await self.patient_repository.create(patient_model)
        return PatientEntity(
            id=patient_model.id,
            first_name=patient_model.first_name,
            last_name=patient_model.last_name,
            patronymic=patient_model.patronymic,
            birthday=patient_model.birthday,
            address=patient_model.address,
            email=patient_model.email,
            phone=patient_model.phone,
            diagnosis=patient_model.diagnosis,
            correction=patient_model.correction,
        )

    async def update_patient(self, patient_id: int, patient: PatientEntity) -> Optional[PatientEntity]:
        patient_model = await self.patient_repository.get_by_id(patient_id)

        if not patient_model:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Patient not found")

        patient_model.first_name = patient.first_name
        patient_model.last_name = patient.last_name
        patient_model.patronymic = patient.patronymic
        patient_model.birthday = patient.birthday
        patient_model.address = patient.address
        patient_model.email = patient.email
        patient_model.phone = patient.phone
        patient_model.diagnosis = patient.diagnosis
        patient_model.correction = patient.correction
        await self.patient_repository.update(patient_model)
        return PatientEntity(
            id=patient_model.id,
            first_name=patient_model.first_name,
            last_name=patient_model.last_name,
            patronymic=patient_model.patronymic,
            birthday=patient_model.birthday,
            address=patient_model.address,
            email=patient_model.email,
            phone=patient_model.phone,
            diagnosis=patient_model.diagnosis,
            correction=patient_model.correction,
        )


    async def delete_patient(self, patient_id: int) -> Optional[PatientEntity]:
        patient = await self.patient_repository.get_by_id(patient_id)

        if not patient:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Patient not found")

        result = await self.patient_repository.delete(patient)

        return PatientEntity(
            id=result.id,
            first_name=result.first_name,
            last_name=result.last_name,
            patronymic=result.patronymic,
            birthday=result.birthday,
            address=result.address,
            email=result.email,
            phone=result.phone,
            diagnosis=result.diagnosis,
            correction=result.correction,
        )
