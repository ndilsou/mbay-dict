from typing import Annotated, Literal, Protocol, cast
from fastapi import Body, Depends, FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from mangum import Mangum
from pydantic import EmailStr
from .auth import AuthAdapter
from mbay_dict import logging
from sqlalchemy.ext.asyncio import async_sessionmaker

from . import schemas


def create_application() -> FastAPI:
    logging.configure()
    app = FastAPI()
    return app


app = create_application()

logger = logging.get_logger(__name__)


@app.get("/")
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "OK"}



@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f"{exc}".replace("\n", " ").replace("   ", " ")
    logger.error(exc_str, url=str(request.url))
    content = {"statusCode": 422, "message": exc_str, "data": None}
    return JSONResponse(
        content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY
    )


