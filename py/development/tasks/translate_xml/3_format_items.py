import json
import os
import sys

# from typing import Annotated, List, Literal
# from pydantic import AfterValidator, BaseModel, Field
from datetime import datetime

# from bson import ObjectId as _ObjectId
from bson.json_util import loads, dumps
from mbay_dict.core.domain import Entry, Example, Expression, ParentId, Translation
from mbay_dict.core.models import new_object_id
from mbay_dict.core.serializers import CustomJSONEncoder
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
                    sound_filename=change_file_extension(sample["soundfile"], "mp3"),
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
                        sound_filename=change_file_extension(
                            expression["soundfile"], "mp3"
                        ),
                    )

                expr = Expression(
                    id=expr_id,
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
                    sound_filename=change_file_extension(
                        expression["soundexpr"], "mp3"
                    ),
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
                id=entry_id,
                headword=item["entry"],
                part_of_speech=item["category"],
                sound_filename=change_file_extension(item["soundfile"], "mp3"),
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
                expressions=expressions,
            )
        except Exception:
            rprint(f"error creating entry for {item}")
            raise

        entries[entry.headword] = dict(entry=entry, relword=item["relword"])

    for entry in entries.values():
        if entry["relword"] in entries:
            entry["entry"].related_word_id = entries[entry["relword"]]["entry"].id

    output = [entry["entry"].model_dump(by_alias=True) for entry in entries.values()]

    # Save the processed data to the output file
    print(f"Saving data to {output_filepath}")
    with open(output_filepath, "w") as f:
        f.write(dumps(output, cls=CustomJSONEncoder, ensure_ascii=False))


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


def change_file_extension(filename: str | None, new_ext: str) -> str | None:
    if filename is None:
        return None

    base_name = os.path.splitext(filename)[0]
    return f"{base_name}.{new_ext}"


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
