from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class LensType(BaseModel):
    __tablename__ = 'lens_types'

    title = Column(VARCHAR(150), nullable=False, unique=True)

    lenses = relationship('Lens', back_populates='type')
