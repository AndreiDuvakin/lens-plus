from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models import Base


class AppointmentType(Base):
    __tablename__ = 'appointment_types'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(150), nullable=False, unique=True)

    appointments = relationship('Appointment', back_populates='type')
