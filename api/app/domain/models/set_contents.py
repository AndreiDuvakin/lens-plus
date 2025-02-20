from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel
from app.domain.models.lens import SideEnum


class SetContent(BaseModel):
    __tablename__ = 'set_contents'

    tor = Column(Integer, nullable=False)
    trial = Column(Integer, nullable=False)
    esa = Column(Integer, nullable=False)
    fvc = Column(Integer, nullable=False)
    preset_refraction = Column(Integer, nullable=False)
    diameter = Column(Integer, nullable=False)
    periphery_toricity = Column(Integer, nullable=False)
    side = Column(Enum(SideEnum), nullable=False)
    count = Column(Integer, nullable=False)

    type_id = Column(Integer, ForeignKey('lens_types.id'), nullable=False)
    set_id = Column(Integer, ForeignKey('sets.id'), nullable=False)

    type = relationship('LensType', back_populates='lenses')
    set = relationship('Set', back_populates='contents')
