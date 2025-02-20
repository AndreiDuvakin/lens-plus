from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class AppointmentFile(BaseModel):
    __tablename__ = 'appointment_files'

    file_path = Column(String, nullable=False)
    file_title = Column(String, nullable=False)

    appointment_id = Column(Integer, ForeignKey('appointments.id'), nullable=False)

    appointment = relationship('Appointment', back_populates='files')