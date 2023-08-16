from collections import defaultdict

from typing import List, Literal
from itertools import islice
import sys
import time
import asyncio
from typing import Any, Iterable, TypeVar
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from pathlib import Path
from rich import print as rprint
import json
import datetime as dt
import langchain
from itertools import chain as iter_chain
from langchain.output_parsers import OutputFixingParser

from langchain.chains.openai_functions import (
    create_structured_output_chain,
)
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.schema import SystemMessage
from rich.progress import track
from dotenv import load_dotenv
from langchain.cache import SQLiteCache

langchain.llm_cache = SQLiteCache(database_path=".langchain.db")

load_dotenv()
chat = ChatOpenAI()

Record = dict[str, Any]

sem = asyncio.Semaphore(20)


async def main(base_filename: str, error_filename: str):
    filepath = Path(base_filename)
    with filepath.open("r", encoding="utf-8") as f:
        data = json.load(f)
    words = (Word(**d) for d in data)

    filepath = Path(error_filename)
    with filepath.open("r", encoding="utf-8") as f:
        data = json.load(f)
    words = iter_chain(words, (Word(**d["word"]) for d in data))

    start = time.perf_counter()
    tasks = [fix_record_translation(word) for word in words]
    results = []
    batch_id = 0

    for i, task in enumerate(track(asyncio.as_completed(tasks), total=len(tasks))):
        result = await task
        results.append(result)
        if i % 500 == 0:
            rprint(f"{dt.datetime.now()} - Creating checkpoint...", end="")
            save_results(
                results,
                filepath.parent / "checkpoints",
                "mbay_dict_french_final",
                f"_batch_{batch_id}",
            )
            batch_id += 1
            rprint("done")
    end = time.perf_counter()
    duration = dt.timedelta(seconds=end - start)
    rprint(f"{dt.datetime.now()} - Finished in {duration}")

    save_results(results, filepath.parent, "mbay_dict_french_final")


FAILED_TRANSLATION_PHRASES = {"Translated text", None}
FAILED_TRANSLATION_PREFIX_MATCHES = {"mbay texte (pour le contexte)"}


def match_failed_translation_prefix(text: str) -> bool:
    for prefix in FAILED_TRANSLATION_PREFIX_MATCHES:
        if text.startswith(prefix):
            return True
    return False


def is_failed_translation(text: str) -> bool:
    return text in FAILED_TRANSLATION_PHRASES or match_failed_translation_prefix(text)


class Example(BaseModel):
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
    examples: List[Example]


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


async def translate(
    mbay: str, english: str, part_of_speech: str | None = None
) -> Translation:
    async with sem:
        translation: Translation = await chain.arun(
            mbay_text=mbay,
            english_text=english,
            part_of_speech=part_of_speech,
        )
    return translation.text


async def fix_record_translation(word: Word, verbose=False) -> Result:
    try:
        if is_failed_translation(word.french_translation):
            word.french_translation = await translate(
                word.headword, word.english_translation, word.part_of_speech
            )
        tasks = []
        for example in word.examples:
            if is_failed_translation(example.french):
                tasks.append(fix_example_translation(example))

        await asyncio.gather(*tasks)

    except Exception as e:
        return Result(
            status="error",
            error={
                "id": word.id,
                "word": word.dict(),
                "error": str(e),
                "type": e.__class__.__name__,
            },
        )

    return Result(status="success", result=word)


async def fix_example_translation(example: Example) -> None:
    example.french = await translate(example.mbay, example.english)


parser = OutputFixingParser.from_llm(
    parser=PydanticOutputParser(pydantic_object=Translation), llm=ChatOpenAI()
)

TRANSLATION_TMPL = """\
Your task is to translate the english text from a Mbay to English dictionary from English to French:
mbay text (for context): `{{mbay_text}}`
{% if part_of_speech %}
part of speech: `{{part_of_speech}}`
{% endif %}
english text to translate: `{{english_text}}`
"""


prompt = HumanMessagePromptTemplate.from_template(
    template=TRANSLATION_TMPL,
    input_variables=["mbay_text", "english_text", "part_of_speech"],
    template_format="jinja2",
    partial_variables={"format_instructions": parser.get_format_instructions()},
)
llm = ChatOpenAI(model="gpt-4", temperature=0)

prompt_msgs = [
    HumanMessagePromptTemplate.from_template(
        template=TRANSLATION_TMPL,
        input_variables=["mbay_text", "english_text", "part_of_speech"],
        template_format="jinja2",
    ),
    SystemMessage(
        content="Remember to format your output properly. Remember to only translate the English text."
    ),
]
prompt = ChatPromptTemplate(messages=prompt_msgs)

chain = create_structured_output_chain(Translation, llm, prompt, verbose=True)
# chain.run("Sally is 13")

T = TypeVar("T")


def batched(iterable: Iterable[T], n: int):
    "Batch data into tuples of length n. The last batch may be shorter."
    # batched('ABCDEFG', 3) --> ABC DEF G
    if n < 1:
        raise ValueError("n must be at least one")
    it = iter(iterable)
    while batch := tuple(islice(it, n)):
        yield batch


if __name__ == "__main__":
    asyncio.run(main(*sys.argv[1:]))
