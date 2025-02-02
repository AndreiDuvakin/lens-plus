from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models import Base


class AppointmentFile(Base):
    __tablename__ = 'appointment_files'

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_path = Column(String, nullable=False)
    file_title = Column(String, nullable=False)

    appointment_id = Column(Integer, ForeignKey('appointments.id'), nullable=False)

    appointment = relationship('Appointment', back_populates='files')