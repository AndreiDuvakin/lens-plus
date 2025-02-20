from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class MailingOption(BaseModel):
    __tablename__ = 'mailing_options'

    option_id = Column(Integer, ForeignKey('mailing_delivery_methods.id'), nullable=False)
    mailing_id = Column(Integer, ForeignKey('mailing.id'), nullable=False)

    method = relationship('MailingDeliveryMethod', back_populates='mailing')
    mailing = relationship('Mailing', back_populates='mailing_options')
