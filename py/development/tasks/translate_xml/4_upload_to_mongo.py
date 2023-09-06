import json
import os
import sys
from bson.json_util import loads, dumps

from mbay_dict.core.domain import Entry
from pymongo import IndexModel, MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from rich import print as rprint

load_dotenv()

from pathlib import Path


def main(input_filename: str, collection_name: str):
    input_filepath = Path(input_filename)
    # Load the data from the input file
    with open(input_filepath, "r") as f:
        data = loads(f.read())
    entries = [d for d in data]
    rprint("head -n 10 =>", entries[:10])

    db = get_db()
    entriesCollection = db[collection_name]
    entriesCollection.insert_many(entries)
    index_models = [
        IndexModel([("headword", 1)], name="headwordIndex"),
        IndexModel([("partOfSpeech", 1)], name="partOfSpeechIndex"),
        IndexModel([("french.translation", 1)], name="frenchTranslationIndex"),
        IndexModel([("french.key", 1)], name="frenchKeyIndex"),
        IndexModel([("english.translation", 1)], name="englishTranslationIndex"),
        IndexModel([("english.key", 1)], name="englishKeyIndex"),
    ]

    entriesCollection.create_indexes(index_models)
    print("Finished uploading entries to MongoDB")


def get_db():
    uri = os.environ["MONGODB_URI"]

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi("1"))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(e)

    return client.get_database("dictionary")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
