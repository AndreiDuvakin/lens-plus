from typing import Optional

from pydantic import BaseModel


class LensTypeEntity(BaseModel):
    id: Optional[int] = None
    title: str
