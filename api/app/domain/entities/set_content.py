from typing import Optional

from pydantic import BaseModel


class SetContentEntity(BaseModel):
    id: Optional[int] = None
    tor: float
    trial: float
    esa: float
    fvc: float
    preset_refraction: float
    diameter: float
    periphery_toricity: float
    side: str
    count: int

    set_id: int
