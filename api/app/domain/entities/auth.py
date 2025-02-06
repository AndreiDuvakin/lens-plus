from pydantic import BaseModel, Field


class AuthEntity(BaseModel):
    login: str = Field(...)
    password: str = Field(..., min_length=5)
