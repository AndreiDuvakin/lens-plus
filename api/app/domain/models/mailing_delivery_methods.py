from sqlalchemy import Column, Integer, VARCHAR
from sqlalchemy.orm import relationship

from app.domain.models import Base


class MailingDeliveryMethod(Base):
    __tablename__ = 'mailing_delivery_methods'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(VARCHAR(200), nullable=False)

    mailing = relationship('MailingOption', back_populates='method')
