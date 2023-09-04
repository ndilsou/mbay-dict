import sys
from typing import Annotated, List, Literal
from pydantic import AfterValidator, BaseModel, Field
from datetime import datetime
from bson import ObjectId as _ObjectId
from bson.json_util import loads, dumps
from rich import print as rprint


from pathlib import Path

import unicodedata
import regex


def main(input_filename: str, output_dirname: str):
    input_filepath = Path(input_filename)
    output_filepath = Path(output_dirname) / "mongo_items.json"
    # Load the data from the input file
    with open(input_filepath, "r") as f:
        data = loads(f.read())

    # Process the data
    entries = {}
    for item in data:
        entry_id = new_object_id()

        # Create the examples
        examples = []
        for sample in item["samples"]:
            if sample["samplesent"] is None or sample["trans_sent"] is None:
                rprint(f"skipping sample with missing idiom or translation: {sample}")
                continue

            try:
                example = Example(
                    parent_id=ParentId(id=entry_id, type="entry"),
                    mbay=sample["samplesent"],
                    english=Translation(
                        translation=sample["trans_sent"],
                        key=create_index_key(sample["trans_sent"]),
                    ),
                    french=Translation(
                        translation=sample["french_trans_sent"],
                        key=create_index_key(sample["french_trans_sent"]),
                    ),
                    sound_filename=sample["soundfile"],
                )
                examples.append(example)
            except Exception:
                rprint(f"error creating sample for entry {item['entry']} -> {sample}")
                raise
        # Create the expressions
        expressions = []
        for expression in item["expressions"]:
            if expression["idiom_exp"] is None or expression["trans_exp"] is None:
                rprint(
                    f"skipping expression with missing idiom or translation: {expression}"
                )
                continue

            try:
                expr_id = new_object_id()
                example: Example | None = None
                if (
                    expression["samplesent"] is not None
                    and expression["trans_sent"] is not None
                ):
                    example = Example(
                        parent_id=ParentId(id=expr_id, type="expression"),
                        mbay=expression["samplesent"],
                        english=Translation(
                            translation=expression["trans_sent"],
                            key=create_index_key(expression["trans_sent"]),
                        ),
                        french=Translation(
                            translation=expression["french_trans_sent"],
                            key=create_index_key(expression["french_trans_sent"]),
                        ),
                        sound_filename=expression["soundfile"],
                    )

                expr = Expression(
                    _id=expr_id,
                    entry_id=entry_id,
                    mbay=expression["idiom_exp"],
                    english=Translation(
                        translation=expression["trans_exp"],
                        key=create_index_key(expression["trans_exp"]),
                    ),
                    french=Translation(
                        translation=expression["french_trans_exp"],
                        key=create_index_key(
                            expression["french_trans_exp"]
                        ),  # Stub function
                    ),
                    sound_filename=expression["soundexpr"],
                    example=example,
                )
                expressions.append(expr)
            except Exception:
                rprint(
                    f"error creating expressions for entry {item['entry']} -> {expression}"
                )
                raise

        # Create the entry
        try:
            entry = Entry(
                _id=entry_id,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                headword=item["entry"],
                part_of_speech=item["category"],
                sound_filename=item["soundfile"],
                english=Translation(
                    translation=item["translate"],
                    key=create_index_key(item["translate"]),
                ),
                french=Translation(
                    translation=item["french_translate"],
                    key=create_index_key(item["french_translate"]),
                ),
                related_word_id=None,
                examples=examples,
                expresssions=expressions,
            )
        except Exception:
            rprint(f"error creating entry for {item}")
            raise

        entries[entry.headword] = dict(entry=entry, relword=item["relword"])

    for entry in entries.values():
        if entry["relword"] in entries:
            entry["entry"].related_word_id = entries[entry["relword"]]["entry"].id

    output = [entry["entry"] for entry in entries.values()]

    # Save the processed data to the output file
    print(f"Saving data to {output_filepath}")
    with open(output_filepath, "w") as f:
        f.write(dumps(output))


def new_object_id() -> str:
    return str(_ObjectId())


def check_object_id(value: str) -> str:
    if not _ObjectId.is_valid(value):
        raise ValueError("Invalid ObjectId")
    return value


ObjectId = Annotated[str, AfterValidator(check_object_id)]


# class ObjectId(_ObjectId):
#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

#     @classmethod
#     def validate(cls, v):
#         if not ObjectId.is_valid(v):
#             raise ValueError("Invalid objectid")
#         return ObjectId(v)

#     @classmethod
#     def __modify_schema__(cls, field_schema):
#         field_schema.update(type="string")


class Translation(BaseModel):
    translation: str
    key: str


class ParentId(BaseModel):
    id: ObjectId
    type: Literal["entry", "expression"]


class Example(BaseModel):
    id: ObjectId = Field(..., default_factory=new_object_id, alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    parent_id: ParentId
    mbay: str
    english: Translation
    french: Translation
    sound_filename: str | None = None


class Expression(BaseModel):
    id: ObjectId = Field(..., default_factory=new_object_id, alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    entry_id: ObjectId
    mbay: str
    english: Translation
    french: Translation
    sound_filename: str | None = None
    example: Example | None = None


class Entry(BaseModel):
    id: ObjectId = Field(..., default_factory=new_object_id, alias="_id")
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)
    headword: str
    part_of_speech: str | None = None
    sound_filename: str | None = None
    french: Translation
    english: Translation
    related_word_id: ObjectId | None = None

    examples: list[Example]
    expresssions: list[Expression]


def create_index_key(text: str):
    lower_case = text.lower()
    clean_text = regex.sub(r"^['\(\{\[-]", "", lower_case)
    first_letter = clean_text[0]
    candidate = unicodedata.normalize("NFD", first_letter)
    candidate = regex.sub(r"\p{M}", "", candidate)
    if ord(candidate) >= 97 and ord(candidate) <= 122:
        index_key = candidate
    else:
        index_key = "MISC"
    return index_key


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
