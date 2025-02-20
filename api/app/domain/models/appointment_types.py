from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class AppointmentType(BaseModel):
    __tablename__ = 'appointment_types'

    title = Column(VARCHAR(150), nullable=False, unique=True)

    appointments = relationship('Appointment', back_populates='type')
