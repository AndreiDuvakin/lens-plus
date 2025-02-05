from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.domain.models.users import User


class UsersRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    def get_all(self):
        return self.db.query(User).all()

    def get_by_id(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_login(self, user_login: str):
        return (
            self.db
            .query(User)
            .filter(User.login == user_login)
            .options(
                joinedload(User.role)
            )
            .first()
        )

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user
