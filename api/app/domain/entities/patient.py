import datetime
from typing import Optional

from pydantic import BaseModel


class PatientEntity(BaseModel):
    id: Optional[int] = None
    first_name: str
    last_name: str
    patronymic: Optional[str] = None
    birthday: datetime.date
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    diagnosis: Optional[str] = None
    correction: Optional[str] = None
