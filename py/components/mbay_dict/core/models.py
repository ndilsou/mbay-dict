import datetime as dt
from typing import Any
import uuid
from pydantic import (
    ConfigDict,
    UUID4,
    BaseModel as PydanticBaseModel,
    Field,
    field_serializer,
)
from pydantic.alias_generators import to_pascal


def utcnow():
    return dt.datetime.now(dt.timezone.utc)


def uuid_field() -> Any:
    return Field(default_factory=uuid.uuid4)


def _serialize_dt(dt: dt.datetime):
    return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


class BaseModel(PydanticBaseModel):
    model_config = ConfigDict(
        populate_by_name=True, extra="allow", alias_generator=to_pascal
    )


class Entity(BaseModel):
    id: int
    created_at: dt.datetime = Field(default_factory=utcnow)
    updated_at: dt.datetime = Field(default_factory=utcnow)

    model_config = ConfigDict(validate_assignment=True, alias_generator=to_pascal)

    @field_serializer("created_at", "updated_at")
    def _serialize_dt(self, dt: dt.datetime, _info: Any):
        return _serialize_dt(dt)

    def refresh_updated_at(self):
        self.updated_at = utcnow()


class ValueObject(BaseModel):
    model_config = ConfigDict(frozen=True, alias_generator=to_pascal)
