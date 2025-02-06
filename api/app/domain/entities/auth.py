from pydantic import BaseModel, Field


class AuthEntity(BaseModel):
    login: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=5, example="strongpassword")

