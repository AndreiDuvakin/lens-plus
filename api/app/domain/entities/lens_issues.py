import datetime
from typing import Optional

from pydantic import BaseModel


class LensIssueEntity(BaseModel):
    id: Optional[int] = None
    issue_date: datetime.date

    patient_id: int
    doctor_id: Optional[int] = None
    lens_id: int
