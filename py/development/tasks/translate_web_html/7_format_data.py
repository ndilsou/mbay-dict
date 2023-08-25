from collections import defaultdict

from typing import Generator, List, Literal
from itertools import islice
import sys
import time
from typing import Any, Iterable, TypeVar
from mbay_dict.core.serializers import CustomJSONEncoder
from pydantic import BaseModel, Field
from pathlib import Path
from rich import print as rprint
import json
import datetime as dt
from mbay_dict.core.domain import Entry, Example
import os

from rich.progress import track
from dotenv import load_dotenv


load_dotenv()

Record = dict[str, Any]


def main(filename: str):
    filepath = Path(filename)
    with filepath.open("r", encoding="utf-8") as f:
        data = json.load(f)
    words = (Word(**d) for d in data)

    entries = []
    entry_id = 1
    examples = []
    example_id = 1

    for word in words:
        entry = Entry(
            id=entry_id,
            headword=word.headword,
            english_translation=word.english_translation,
            french_translation=word.french_translation,
            part_of_speech=word.part_of_speech,
            sound_filename=os.path.basename(word.sound_file_link)
            if word.sound_file_link
            else None,
            example_ids=[],
        )
        entry_id += 1
        entries.append(entry)
        for example in word.examples:
            ex = Example(
                id=example_id,  # type: ignore
                entry_id=entry.id,
                mbay=example.mbay,
                english_translation=example.english,
                french_translation=example.french,
                sound_filename=os.path.basename(example.sound_file_link)
                if example.sound_file_link
                else None,
            )
            example_id += 1
            examples.append(ex)
            entry.example_ids.append(ex.id)

    with open(filepath.parent / "entities/entries.json", "w", encoding="utf-8") as f:
        json.dump(entries, f, indent=2, ensure_ascii=False, cls=CustomJSONEncoder)

    with open(filepath.parent / "entities/examples.json", "w", encoding="utf-8") as f:
        json.dump(examples, f, indent=2, ensure_ascii=False, cls=CustomJSONEncoder)


class SourceExample(BaseModel):
    mbay: str
    english: str
    french: str | None = None
    sound_file_link: str | None = None


class Word(BaseModel):
    id: int
    headword: str
    english_translation: str
    french_translation: str | None = None
    part_of_speech: str | None = None
    sound_file_link: str | None = None
    page_number: int
    raw_html: str
    examples: List[SourceExample]


class Translation(BaseModel):
    language: Literal["fr"] = Field("fr", description="The language of the translation")
    text: str = Field(..., description="the result of the translation")


class Result(BaseModel):
    status: Literal["success", "error"]
    result: Word | None = None
    error: dict[str, Any] | None = None


def save_results(results: Iterable[Result], dir: Path, filename: str, suffix: str = ""):
    groups = defaultdict(list)
    for r in results:
        if r.status == "success":
            groups["success"].append(r.result.dict())
        else:
            groups["error"].append(r.error)

    groups["success"].sort(key=lambda x: x["id"])
    outfilepath = dir / f"{filename}{suffix}.json"
    with outfilepath.open("w", encoding="utf-8") as f:
        json.dump(
            groups["success"],
            f,
            indent=2,
            ensure_ascii=False,
        )

    groups["error"].sort(key=lambda x: x["id"])
    error_filepath = dir / f"{filename}_errors{suffix}.json"
    with error_filepath.open("w", encoding="utf-8") as f:
        json.dump(groups["error"], f, indent=2, ensure_ascii=False)


T = TypeVar("T")


def batched(iterable: Iterable[T], n: int):
    "Batch data into tuples of length n. The last batch may be shorter."
    # batched('ABCDEFG', 3) --> ABC DEF G
    if n < 1:
        raise ValueError("n must be at least one")
    it = iter(iterable)
    while batch := tuple(islice(it, n)):
        yield batch


def create_id_generator():
    """Create a generator that yields the next int in the sequence each time it is called."""

    def _id_generator():
        i = 1
        while True:
            yield i
            i += 1

    return _id_generator


if __name__ == "__main__":
    main(sys.argv[1])
