import sys
from typing import Any
from pathlib import Path
import json
from rich.progress import track
from more_itertools import flatten
from dotenv import load_dotenv

load_dotenv()

Record = dict[str, Any]

FILENAME = "error_fixes"

def main(filenames: list[str]):
    contents:list[list[Record]] = []
    for filename in filenames:
        filepath = Path(filename)
        with filepath.open("r") as f:
            content = json.load(f)
            contents.append(content)

    records = []
    seen_ids: set[int] = set()
    for record in track(flatten(contents)):
        if record["id"] in seen_ids:
            continue
        seen_ids.add(record["id"])
        records.append(record)

    records.sort(key=lambda r: r["id"])
    with open("data/mbay.json", "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)



if __name__ == "__main__":
    main(sys.argv[1:])
