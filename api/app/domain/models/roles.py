from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class Role(BaseModel):
    __tablename__ = 'roles'

    title = Column(VARCHAR(150), nullable=False, unique=True)

    users = relationship('User', back_populates='role')
