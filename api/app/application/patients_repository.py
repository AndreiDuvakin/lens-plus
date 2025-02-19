from typing import Sequence

from sqlalchemy import select, Row, RowMapping
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.models import Patient


class PatientsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> Sequence[Patient]:
        stmt = select(Patient)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, patient_id: int) -> Patient:
        stmt = select(Patient).filter(Patient.id == patient_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create(self, patient: Patient) -> Patient:
        self.db.add(patient)
        await self.db.commit()
        await self.db.refresh(patient)
        return patient

    async def update(self, patient: Patient) -> Patient:
        await self.db.merge(patient)
        await self.db.commit()
        return patient

    async def delete(self, patient_id: int) -> Row[Patient] | RowMapping | None:
        stmt = select(Patient).filter(Patient.id == patient_id)
        result = await self.db.execute(stmt)
        patient = result.scalars().first()

        if patient:
            await self.db.delete(patient)
            await self.db.commit()
            return patient

        return None
