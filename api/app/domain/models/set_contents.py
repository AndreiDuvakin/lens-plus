from sqlalchemy import Column, Integer, ForeignKey, Enum, Float
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel
from app.domain.models.lens import SideEnum


class SetContent(BaseModel):
    __tablename__ = 'set_contents'

    tor = Column(Float, nullable=False)
    trial = Column(Float, nullable=False)
    esa = Column(Float, nullable=False)
    fvc = Column(Float, nullable=False)
    preset_refraction = Column(Float, nullable=False)
    diameter = Column(Float, nullable=False)
    periphery_toricity = Column(Float, nullable=False)
    side = Column(Enum(SideEnum), nullable=False)
    count = Column(Integer, nullable=False)

    type_id = Column(Integer, ForeignKey('lens_types.id'), nullable=False)
    set_id = Column(Integer, ForeignKey('sets.id'), nullable=False)

    type = relationship('LensType', back_populates='contents')
    set = relationship('Set', back_populates='contents')
