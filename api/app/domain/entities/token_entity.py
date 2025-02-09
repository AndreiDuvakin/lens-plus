from typing import Optional

from pydantic import BaseModel


class TokenEntity(BaseModel):
    access_token: str
    user_id: int

    class Config:
        from_attributes = True
