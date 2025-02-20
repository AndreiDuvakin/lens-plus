from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class SetLens(BaseModel):
    __tablename__ = 'set_lens'

    set_id = Column(Integer, ForeignKey('sets.id'), nullable=False)
    lens_id = Column(Integer, ForeignKey('lens.id'), nullable=False, unique=True)

    set = relationship('Set', back_populates='lens')
    lens = relationship('Lens', back_populates='set')
