from typing import Optional

from pydantic import BaseModel, Field


class RegisterEntity(BaseModel):
    first_name: str = Field(..., example='Ivan')
    last_name: str = Field(..., example='Ivanov')
    patronymic: Optional[str] = Field(None, example='Ivanov')
    role_id: int = Field(..., example=1)
    login: str = Field(..., example='user@example.com')
    password: str = Field(..., min_length=5, example='strongpassword')
