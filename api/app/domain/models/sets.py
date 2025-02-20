from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class Set(BaseModel):
    __tablename__ = 'sets'

    title = Column(VARCHAR(150), nullable=False, unique=True)
    count = Column(Integer, nullable=False)

    contents = relationship('SetContent', back_populates='set')
    lens = relationship('SetLens', back_populates='set')
