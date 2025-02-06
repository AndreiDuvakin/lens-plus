from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    LOG_LEVEL: str = 'info'
    LOG_FILE: str = 'logs/app.log'
    SECRET_KEY: str
    ALGORITHM: str
    APP_PREFIX: str = '/api/v1'

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'


settings = Settings()


def get_auth_data():
    return {'secret_key': settings.SECRET_KEY, 'algorithm': settings.ALGORITHM}
