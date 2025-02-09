from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.domain.models.users import User
from app.settings import get_auth_data
from app.application.users_repository import UsersRepository

security = HTTPBearer()


async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(security),
        db: AsyncSession = Depends(get_db)
):
    auth_data = get_auth_data()

    try:
        payload = jwt.decode(credentials.credentials, auth_data["secret_key"], algorithms=[auth_data["algorithm"]])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = await UsersRepository(db).get_by_id_with_role(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


def require_admin(user: User = Depends(get_current_user)):
    if user.role.title != "Администратор":
        raise HTTPException(status_code=403, detail="Access denied")

    return user
