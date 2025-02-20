from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.domain.models.base import BaseModel


class Mailing(BaseModel):
    __tablename__ = 'mailing'

    text = Column(String, nullable=False)
    title = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False, default=func.utcnow)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship('User', back_populates='mailing')

    recipients = relationship('Recipient', back_populates='mailing')
    mailing_options = relationship('MailingOption', back_populates='mailing')
