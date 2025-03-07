from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.controllers.auth_router import router as auth_router
from app.controllers.lens_issues_router import router as lens_issues_router
from app.controllers.lens_types_router import router as lens_types_router
from app.controllers.lenses_router import router as lenses_router
from app.controllers.patients_router import router as patients_router
from app.controllers.register_routes import router as register_router
from app.controllers.set_content_router import router as set_content_router
from app.controllers.sets_router import router as sets_router
from app.settings import settings


def start_app():
    api_app = FastAPI()

    api_app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
        allow_headers=['*'],
    )

    api_app.include_router(auth_router, prefix=settings.APP_PREFIX, tags=['auth'])
    api_app.include_router(register_router, prefix=settings.APP_PREFIX, tags=['register'])
    api_app.include_router(patients_router, prefix=settings.APP_PREFIX, tags=['patients'])
    api_app.include_router(lenses_router, prefix=settings.APP_PREFIX, tags=['lenses'])
    api_app.include_router(lens_types_router, prefix=settings.APP_PREFIX, tags=['lens_types'])
    api_app.include_router(sets_router, prefix=settings.APP_PREFIX, tags=['sets'])
    api_app.include_router(set_content_router, prefix=settings.APP_PREFIX, tags=['set_content'])
    api_app.include_router(lens_issues_router, prefix=settings.APP_PREFIX, tags=['lens_issue'])

    return api_app


app = start_app()


@app.get("/", tags=['root'])
async def root():
    return {"message": "OK"}
