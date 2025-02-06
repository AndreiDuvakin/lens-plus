from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models import Base


class Recipient(Base):
    __tablename__ = 'recipients'

    id = Column(Integer, primary_key=True, autoincrement=True)

    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    mailing_id = Column(Integer, ForeignKey('mailing.id'), nullable=False)

    patient = relationship('Patient', back_populates='mailing')
    mailing = relationship('Mailing', back_populates='recipients')
