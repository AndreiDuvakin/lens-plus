from enum import Enum as PyEnum

from sqlalchemy import Column, Integer, ForeignKey, Float, Enum, Boolean
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class SideEnum(PyEnum):
    LEFT = 'левая'
    RIGHT = 'правая'


class Lens(BaseModel):
    __tablename__ = 'lens'

    tor = Column(Float, nullable=False)
    trial = Column(Float, nullable=False)
    esa = Column(Float, nullable=False)
    fvc = Column(Float, nullable=False)  # ПЦК
    preset_refraction = Column(Float, nullable=False)
    diameter = Column(Float, nullable=False)
    periphery_toricity = Column(Float, nullable=False)  # Торичность перефирии
    side = Column(Enum(SideEnum), nullable=False)
    issued = Column(Boolean, nullable=False, default=False)

    type_id = Column(Integer, ForeignKey('lens_types.id'), nullable=False)

    type = relationship('LensType', back_populates='lenses')

    lens_issues = relationship('LensIssue', back_populates='lens')
