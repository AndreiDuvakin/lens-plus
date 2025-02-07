from typing import Optional

from pydantic import BaseModel, Field


class UserEntity(BaseModel):
    id: int = Field(..., example=1)
    first_name: str = Field(..., example='Ivan')
    last_name: str = Field(..., example='Ivanov')
    patronymic: Optional[str] = Field(None, example='Ivanov')
    login: str = Field(..., example='user@example.com')

    role_id: int = Field(..., example=1)

