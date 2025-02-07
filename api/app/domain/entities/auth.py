from pydantic import BaseModel


class AuthEntity(BaseModel):
    login: str
    password: str

