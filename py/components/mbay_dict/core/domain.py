from .models import Entity


class Example(Entity):
    entry_id: int
    mbay: str
    english_translation: str
    french_translation: str
    sound_filename: str | None = None


class Entry(Entity):
    id: int
    headword: str
    english_translation: str
    french_translation: str
    part_of_speech: str | None = None
    sound_filename: str | None = None
    example_ids: list[int]
