from typing import Optional

from pydantic import BaseModel, Field


class RegisterEntity(BaseModel):
    first_name: str
    last_name: str
    patronymic: Optional[str]
    role_id: int
    login: str
    password: str
