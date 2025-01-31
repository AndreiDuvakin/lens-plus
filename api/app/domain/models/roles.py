from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models import Base


class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(150), nullable=False, unique=True)

    users = relationship('User', back_populates='role')
