from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models import Base


class Set(Base):
    __tablename__ = 'sets'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(150), nullable=False, unique=True)
    count = Column(Integer, nullable=False)

    contents = relationship('SetContent', back_populates='set')
    lens = relationship('SetLens', back_populates='set')
