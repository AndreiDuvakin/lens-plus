import datetime
from typing import Optional

from pydantic import BaseModel

from app.domain.entities.lens import LensEntity
from app.domain.entities.patient import PatientEntity
from app.domain.entities.user import UserEntity


class LensIssueEntity(BaseModel):
    id: Optional[int] = None
    issue_date: datetime.date

    patient_id: int
    doctor_id: Optional[int] = None
    lens_id: int

    patient: Optional[PatientEntity] = None
    doctor: Optional[UserEntity] = None
    lens: Optional[LensEntity] = None
