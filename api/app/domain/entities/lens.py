from typing import Optional

from pydantic import BaseModel


class LensEntity(BaseModel):
    id: Optional[int] = None
    tor: float
    trial: float
    esa: float
    fvc: float
    preset_refraction: float
    diameter: float
    periphery_toricity: float
    side: str
    issued: bool

    type_id: int
