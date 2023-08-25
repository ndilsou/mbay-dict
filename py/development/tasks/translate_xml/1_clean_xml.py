"""
Takes the raw XML from John Keegan's original english dictionary and:
1. fix the encoding errors.
2. converts it to a JSON format that is easier to work with.
"""

import json
from pathlib import Path
import sys
from mbay_dict.schemas.correction import correct_mbay_string
from rich.progress import track
from dotenv import load_dotenv
from rich import print as rprint


from pathlib import Path
from mbay_dict.schemas.generated.mbay import NewDataSet
from xsdata.formats.dataclass.parsers import XmlParser

load_dotenv()

# xml_string = Path("./../../data/SaraBagirmiXmlXsd/Mbay.xml").read_text(encoding="utf-8")
parser = XmlParser()


def main(filename: str):
    filepath = Path(filename)
    xml = filepath.read_text(encoding="utf-8")
    dataset = parser.from_string(xml, NewDataSet)
    # entries = [dataset.entry]
    entry = correct_entry(dataset.entry[0])
    rprint(entry)

    traduc


def correct_entry(entry: NewDataSet.Entry) -> NewDataSet.Entry:
    entry.entrycode = fix_code(entry.entrycode)
    entry.entry = correct_mbay_string(entry.entry)
    return entry


def fix_code(code: str | None) -> str:
    if code is None:
        return None

    return int(code.strip())


if __name__ == "__main__":
    main(sys.argv[1])
