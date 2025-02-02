from sqlalchemy import Column, Integer, VARCHAR, Date, String
from sqlalchemy.orm import relationship

from app.domain.models import Base


class Patient(Base):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(VARCHAR(200), nullable=False)
    last_name = Column(VARCHAR(200), nullable=False)
    patronymic = Column(VARCHAR(200))
    birthday = Column(Date, nullable=False)
    address = Column(String)
    email = Column(VARCHAR(350))
    phone = Column(VARCHAR(25))
    diagnosis = Column(String)
    correction = Column(String)

    lens_issues = relationship('LensIssue', back_populates='patient')
    appointments = relationship('Appointment', back_populates='patient')
    mailing = relationship('Mailing', back_populates='patient')
