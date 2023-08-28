"""
Takes the raw XML from John Keegan's original english dictionary and:
1. fix the encoding errors.
2. converts it to a JSON format that is easier to work with.
"""

from dataclasses import asdict
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
    entries_dict = {entry.entrycode: asdict(entry) for entry in dataset.entry}
    translations = [asdict(translation) for translation in dataset.translations]
    samples = [asdict(sample) for sample in dataset.samples]
    expressions = [asdict(expression) for expression in dataset.expressions]

    records = {}

    # Merge entries and translations
    for translation in translations:
        item = translation.copy()
        if translation["entrycode"] not in entries_dict:
            logger.warning(
                f"Translation {translation['entrycode']} not found in entries",
                translation=translation,
            )
            continue

        entry = entries_dict[translation["entrycode"]]
        item.update(entry)
        item["samples"] = []
        item["expressions"] = []
        records[item["entrytranc"]] = item

    # Link expressions and samples to their corresponding entries
    for expression in expressions:
        record = records.get(expression["entrytranc"])
        if record is None:
            logger.warning(
                f"Expression with parent id {expression['entrytranc']} not found in records",
                expression=expression,
            )
            continue
        record["expressions"].append(expression)

    for sample in samples:
        record = records.get(sample["entrytranc"])
        if record is None:
            logger.warning(
                f"Sample with parent id {sample['entrytranc']} not found in records",
                sample=sample,
            )
            continue
        record["samples"].append(sample)

    with open("output.json", "w", encoding="utf-8") as json_file:
        json.dump(list(records.values()), json_file, ensure_ascii=False, indent=2)


def correct_translation(
    translation: NewDataSet.Translations,
) -> NewDataSet.Translations:
    try:
        translation.trancode = fix_code(translation.trancode)
        translation.entrycode = fix_code(translation.entrycode)
        translation.entrytranc = fix_code(translation.entrytranc)
        translation.relword = correct_mbay_string(translation.relword)
    except:
        rprint(translation)
        raise
    return translation


def correct_sample(sample: NewDataSet.Samples) -> NewDataSet.Samples:
    try:
        sample.entrycode = fix_code(sample.entrycode)
        sample.entrytranc = fix_code(sample.entrytranc)
        sample.trancode = fix_code(sample.trancode)
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

    return code.strip()


if __name__ == "__main__":
    main(sys.argv[1])
