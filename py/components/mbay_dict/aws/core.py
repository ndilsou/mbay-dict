from abc import ABC, abstractclassmethod
import boto3
from http import HTTPStatus
from json import JSONEncoder
import json
from typing import Any, Mapping, Protocol, TypeVar, Type
import datetime as dt
import uuid
from pydantic import ValidationError

from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEventV2
from aws_lambda_powertools.event_handler.exceptions import ServiceError

from aws_lambda_powertools.event_handler import (
    Response,
    content_types,
    exceptions as http_exceptions,
)
from aws_lambda_powertools.shared.cookies import Cookie

class APIGWJSONEncoder(CustomJSONEncoder):
    by_alias = True


def json_response(
    item: Any,
    status_code: HTTPStatus = HTTPStatus.OK,
    headers: dict[str, str | list[str]] | None = None,
    cookies: list[Cookie] | None = None,
) -> Response:
    return Response(
        status_code=status_code.value,
        content_type=content_types.APPLICATION_JSON,
        body=json.dumps(item, cls=APIGWJSONEncoder),
        headers=headers,
        cookies=cookies,
        compress=True,
    )


T = TypeVar("T", bound=BaseModel)


def parse_event_body(event: APIGatewayProxyEventV2, model: Type[T]) -> T:
    try:
        return model(**event.json_body)
    except ValidationError as e:
        raise ServiceError(HTTPStatus.UNPROCESSABLE_ENTITY, msg=repr(e.errors())) from e

