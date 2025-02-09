from typing import Optional

from pydantic import BaseModel


class PatientEntity(BaseModel):
    id: Optional[int]
    first_name: str
    last_name: str
    patronymic: Optional[str]
    birthday: str
    address: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    diagnosis: Optional[str]
    correction: Optional[str]
