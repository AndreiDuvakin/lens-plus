from typing import Optional

from pydantic import BaseModel


class UserEntity(BaseModel):
    id: int
    first_name: str
    last_name: str
    patronymic: Optional[str]
    login: str

    role_id: int
