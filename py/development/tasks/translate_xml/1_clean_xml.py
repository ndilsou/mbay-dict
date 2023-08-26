"""
Takes the raw XML from John Keegan's original english dictionary and:
1. fix the encoding errors.
2. converts it to a JSON format that is easier to work with.
"""

import json
from pathlib import Path
import sys
from mbay_dict.logging.core import get_logger
from mbay_dict.schemas.correction import correct_mbay_string
from rich.progress import track
from dotenv import load_dotenv
from rich import print as rprint

from mbay_dict.schemas.generated.mbay import NewDataSet
from xsdata.formats.dataclass.parsers import XmlParser

load_dotenv()

logger = get_logger(__name__)

parser = XmlParser()


def main(filename: str):
    filepath = Path(filename)
    xml = filepath.read_text(encoding="utf-8")
    dataset = parser.from_string(xml, NewDataSet)
    for entry in track(dataset.entry, description="Processing entries..."):
        correct_entry(entry)

    for translation in track(
        dataset.translations, description="Processing translations..."
    ):
        correct_translation(translation)

    for sample in track(dataset.samples, description="Processing samples..."):
        correct_sample(sample)

    for expression in track(
        dataset.expressions, description="Processing expressions..."
    ):
        correct_expression(expression)

    # Create dictionaries for easy lookup
    entries_dict = {entry.entrycode: entry for entry in dataset.entry}
    translations_dict = {
        translation.entrycode: translation for translation in dataset.translations
    }
    samples_dict = {sample.entrycode: sample for sample in dataset.samples}
    expressions_dict = {
        expression.entrycode: expression for expression in dataset.expressions
    }

    # Merge entries and translations
    for entry_code, entry in entries_dict.items():
        translation = translations_dict.get(entry_code)
        if translation:
            entry.update(translation)

    # Link expressions and samples to their corresponding entries
    for expression_code, expression in expressions_dict.items():
        entry = entries_dict.get(expression_code)
        if entry:
            expression.entry = entry

    for sample_code, sample in samples_dict.items():
        entry = entries_dict.get(sample_code)
        if entry:
            sample.entry = entry

    # Dictify and push to a file as json
    data_dict = {
        "entries": entries_dict,
        "translations": translations_dict,
        "samples": samples_dict,
        "expressions": expressions_dict,
    }
    with open("output.json", "w") as json_file:
        json.dump(data_dict, json_file)


def correct_translation(
    translation: NewDataSet.Translations,
) -> NewDataSet.Translations:
    try:
        translation.entrycode = fix_code(translation.entrycode)
    except:
        rprint(translation)
        raise
    return translation


def correct_sample(sample: NewDataSet.Samples) -> NewDataSet.Samples:
    try:
        sample.entrycode = fix_code(sample.entrycode)
        sample.samplesent = correct_mbay_string(sample.samplesent)
    except:
        rprint(sample)
        raise

    return sample


def correct_expression(expression: NewDataSet.Expressions) -> NewDataSet.Expressions:
    try:
        expression.entrycode = fix_code(expression.entrycode)
        expression.entrytranc = fix_code(expression.entrytranc)
        expression.samplesent = correct_mbay_string(expression.samplesent)
        expression.idiom_exp = correct_mbay_string(expression.idiom_exp)
    except:
        rprint(expression)
        raise
    return expression


def correct_entry(entry: NewDataSet.Entry) -> NewDataSet.Entry:
    try:
        entry.entrycode = fix_code(entry.entrycode)
        entry.entry = correct_mbay_string(entry.entry)
    except:
        rprint(entry)
        raise
    return entry


def fix_code(code: str | None) -> str:
    if code is None:
        return None

    return int(code.strip())


if __name__ == "__main__":
    main(sys.argv[1])
