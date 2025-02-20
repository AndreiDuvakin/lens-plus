from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models.base import BaseModel


class MailingDeliveryMethod(BaseModel):
    __tablename__ = 'mailing_delivery_methods'

    title = Column(VARCHAR(200), nullable=False)

    mailing = relationship('MailingOption', back_populates='method')
