from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models import Base


class SetContent(Base):
    __tablename__ = 'set_contents'

    id = Column(Integer, primary_key=True, autoincrement=True)
    tor = Column(Integer, nullable=False)
    trial = Column(Integer, nullable=False)
    esa = Column(Integer, nullable=False)
    fvc = Column(Integer, nullable=False)
    preset_refraction = Column(Integer, nullable=False)
    diameter = Column(Integer, nullable=False)
    periphery_toricity = Column(Integer, nullable=False)
    side = Column(Integer, nullable=False)
    count = Column(Integer, nullable=False)

    set_id = Column(Integer, ForeignKey('sets.id'), nullable=False)

    set = relationship('Set', back_populates='contents')
