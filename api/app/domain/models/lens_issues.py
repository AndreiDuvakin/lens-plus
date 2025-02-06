from sqlalchemy import Column, Integer, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.domain.models import Base


class LensIssue(Base):
    __tablename__ = 'lens_issues'

    id = Column(Integer, primary_key=True, autoincrement=True)
    issue_date = Column(Date, nullable=False)

    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    doctor_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    lens_id = Column(Integer, ForeignKey('lens.id'), nullable=False)

    patient = relationship('Patient', back_populates='lens_issues')
    doctor = relationship('User', back_populates='lens_issues')
    lens = relationship('Lens', back_populates='lens_issues')
