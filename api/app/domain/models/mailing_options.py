from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.domain.models import Base


class MailingOption(Base):
    __tablename__ = 'mailing_options'

    id = Column(Integer, primary_key=True, autoincrement=True)

    option_id = Column(Integer, ForeignKey('mailing_delivery_methods.id'), nullable=False)
    mailing_id = Column(Integer, ForeignKey('mailing.id'), nullable=False)

    method = relationship('MailingDeliveryMethod', back_populates='mailing')
    mailing = relationship('Mailing', back_populates='mailing_options')
