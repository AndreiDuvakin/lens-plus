from typing import Optional

from pydantic import BaseModel


class SetEntity(BaseModel):
    id: Optional[int] = None
    title: str
