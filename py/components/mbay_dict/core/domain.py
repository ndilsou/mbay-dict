from typing import Literal
from .models import Entity, ObjectId, ValueObject



class Translation(ValueObject):
    translation: str
    key: str


class ParentId(ValueObject):
    id: ObjectId
    type: Literal["entry", "expression"]


class Example(Entity):
    parent_id: ParentId
    mbay: str
    english: Translation
    french: Translation
    sound_filename: str | None = None


class Expression(Entity):
    entry_id: ObjectId
    mbay: str
    english: Translation
    french: Translation
    sound_filename: str | None = None
    example: Example | None = None


class Entry(Entity):
    headword: str
    part_of_speech: str | None = None
    sound_filename: str | None = None
    french: Translation
    english: Translation
    related_word_id: ObjectId | None = None

    examples: list[Example]
    expressions: list[Expression]
