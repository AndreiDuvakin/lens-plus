from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class Appointment(BaseModel):
    __tablename__ = 'appointments'

    results = Column(String)
    days_until_the_next_appointment = Column(Integer)

    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    doctor_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    type_id = Column(Integer, ForeignKey('appointment_types.id'), nullable=False)

    patient = relationship('Patient', back_populates='appointments')
    doctor = relationship('User', back_populates='appointments')
    type = relationship('AppointmentType', back_populates='appointments')

    files = relationship('AppointmentFile', back_populates='appointment')
