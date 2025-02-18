from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models import Base


class LensType(Base):
    __tablename__ = 'lens_types'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(150), nullable=False, unique=True)

    lenses = relationship('Lens', back_populates='type')
