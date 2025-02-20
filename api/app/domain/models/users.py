from sqlalchemy import Column, Integer, VARCHAR, ForeignKey, String
from sqlalchemy.orm import relationship
from werkzeug.security import check_password_hash, generate_password_hash

from app.domain.models.base import BaseModel


class User(BaseModel):
    __tablename__ = 'users'

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

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def set_password(self, password):
        self.password = generate_password_hash(password)
