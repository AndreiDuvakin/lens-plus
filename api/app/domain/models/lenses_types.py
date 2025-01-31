from sqlalchemy import Column, Integer, VARCHAR, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models import Base


class LensesType(Base):
    __tablename__ = 'lenses_types'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(150), nullable=False, unique=True)
