from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.domain.models import Base


class Mailing(Base):
    __tablename__ = 'mailing'

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String, nullable=False)
    title = Column(String, nullable=False)
    datetime = Column(DateTime, nullable=False, default=func.utcnow)

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship('User', back_populates='mailing')

    recipients = relationship('Recipient', back_populates='mailing')
    mailing_options = relationship('MailingOption', back_populates='mailing')
