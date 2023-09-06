import json
import os
import sys
from bson.json_util import loads, dumps
import httpx

from mbay_dict.core.domain import Entry
from pymongo import IndexModel, MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from rich import print as rprint

load_dotenv()

from pathlib import Path


def main(input_filename: str, outputdir: str):
    input_filepath = Path(input_filename)
    # Load the data from the input file
    with open(input_filepath, "r") as f:
        data = loads(f.read())
    entries = [Entry.model_validate(d) for d in data]
    rprint("head -n 10 =>", entries[:10])

    output_path = Path(outputdir)
    entry: Entry
    for entry in entries:
        # Check and download sound file for entry
        download_sound(entry.sound_filename, output_path)
        # Check and download sound files for examples
        for example in entry.examples:
            download_sound(example.sound_filename, output_path)
        # Check and download sound files for expressions
        for expression in entry.expressions:
            download_sound(expression.sound_filename, output_path)
            # Check and download sound files for examples in expressions
            if example := expression.example:
                download_sound(example.sound_filename, output_path)


def get_url(filename: str) -> str:
    return f"https://morkegbooks.com/Services/World/Languages/SaraBagirmi/SoundDictionary/Mbay/{filename}"


def download_sound(sound_filename: str | None, output_path: Path):
    if sound_filename:
        filename = output_path / sound_filename
        if not filename.exists():
            download_file(get_url(sound_filename), filename)


def download_file(url: str, filename: Path):
    with httpx.stream("GET", url) as r:
        with filename.open("wb") as f:
            for chunk in r.iter_bytes():
                f.write(chunk)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
