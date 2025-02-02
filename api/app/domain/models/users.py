from sqlalchemy import Column, Integer, VARCHAR, ForeignKey, String
from sqlalchemy.orm import relationship

from app.domain.models import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(VARCHAR(200), nullable=False)
    last_name = Column(VARCHAR(200), nullable=False)
    patronymic = Column(VARCHAR(200))
    login = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)

    role_id = Column(Integer, ForeignKey('roles.id'), nullable=False)

    role = relationship('Role', back_populates='users')

    lens_issues = relationship('LensIssue', back_populates='doctor')
    appointments = relationship('Appointment', back_populates='doctor')
    mailing = relationship('Mailing', back_populates='user')
