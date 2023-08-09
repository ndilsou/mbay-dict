import sys
from typing import Any, Callable
from concurrent.futures import ThreadPoolExecutor
from langchain import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
from langchain.chat_models import ChatOpenAI
from pathlib import Path
from rich import print as rprint
from rich.pretty import pprint
import json
from langchain.output_parsers import OutputFixingParser
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain.prompts.chat import (
    HumanMessagePromptTemplate,
)
from rich.progress import Progress
from functools import partial

chat = ChatOpenAI()

Record = dict[str, Any]


def main(filename: str):
    filepath = Path(filename)
    with filepath.open("r") as f:
        raw_mbay_content = json.load(f)

    # raw_entry = raw_mbay_content[0]

    # entry = extract_entry(raw_entry)
    # rprint(entry)
    with ThreadPoolExecutor(max_workers=10) as executor:
        with Progress() as progress:
            task_id = progress.add_task("cleaning entries", total=len(raw_mbay_content))

            fn = partial(extract_entry, progress=lambda: progress.advance(task_id))
            results = executor.map(fn, raw_mbay_content)
            results = list(results)
    
    success = [r["result"] for r in results if r["status"] == "success"]
    
    outfilepath = filepath.parent / "mbay_dict_english_clean.json"
    with outfilepath.open("w") as f:
        json.dump(success, f, indent=2)

    errors = [r["error"] for r in results if r["status"] == "error"]

    error_filepath = filepath.parent / "mbay_dict_english_clean_errors.json"
    with error_filepath.open("w") as f:
        json.dump(errors, f, indent=2)


def extract_entry(entry: Record, verbose=False, progress: Callable[[], None] | None = None) -> Record:
    _input = prompt.format(
        format_instructions=parser.get_format_instructions(),
        mbay_term=entry["mbay_entry"],
        english_translation=entry["english_entry"],
        raw_html=entry["raw_string"],
    )
    try:
        output = chat([_input])
        extraction = parser.parse(output.content)
    except Exception as e:
        if progress:
            progress()
        return {
            "status": "error",
            "error": {
                "message": str(e),
                "type": e.__class__.__name__,
                "input": _input,
            }
        }


    if verbose:
        rprint(extraction)
    result = {
        "id": entry["id"],
        "headword": entry["mbay_entry"],
        "english_translation": extraction.fixed_translation,
        "part_of_speech": extraction.type,
        "sound_file_link": entry["sound_file_link"],
        "page_number": entry["page_number"],
        "examples": [
            {
                "mbay": example.mbay,
                "english": example.english,
                "sound_file_link": example.sound_file,
            }
            for example in extraction.examples
        ],
        "raw_html": entry["raw_string"],
    }
    if progress:
        progress()
    return {
        "status": "success",
        "result": result,
    }

class Example(BaseModel):
    mbay: str = Field(..., description="The mbay text")
    english: str = Field(..., description="The english translation")
    sound_file: str | None = Field(
        None, description="The optional sound file associated with the example"
    )


class Extraction(BaseModel):
    examples: list[Example] = Field(
        ..., description="A list of examples associated with the dictionary entry."
    )
    fixed_translation: str = Field(
        ..., description="The fixed translation with any mangled suffix corrected."
    )
    type: str | None = Field(
        None, description="The type of the dictionary entry, if recorded."
    )


# parser =
parser = OutputFixingParser.from_llm(
    parser=PydanticOutputParser(pydantic_object=Extraction), llm=ChatOpenAI()
)

EXTRACTION_TMPL = """\
You are given a sample from a Mbay to English dictionary. The main term of the entry has been extracted. additional examples are present in the raw string given to you. Extract all the Mbay to English example pairs.

{{format_instructions}}

Mbay Term: "ngōn-kó̰o̰"
English Translation: "sibling, brother or sister."
Raw HTML:
"<div class=\"def\">\n<span class=\"word\">\n<span class=\"w sara-bagirmi-lang\">\n<a class=\"play-sound\" onclick=\"playSound('Sound/NgonKooNW.mp3')\"> ngōn-kó̰o̰</a>\n</span>\n[ŋgō̰nkó̰o̰]\n</span>\n<span class=\"type\">NT  </span>\nsibling, brother or sister.\n<span class=\"sara-bagirmi-lang\">\n<a class=\"play-sound\" onclick=\"playSound('Sound/NgonKooNSS1.mp3')\"> Ngōn-kó̰o̰-í à dān-ī súl tɨ́ nà ngōn-bɔ̀ɔ̄-í à là gìdɨ̀ bɔ̀r.</a> </span>\n{Proverb}  Your brother will accompany you to prison, but your half-brother will amble about the walls.\n</div>"
Result:
{
"examples": [
{"mbay": "Ngōn-kó̰o̰-í à dān-ī súl tɨ́ nà ngōn-bɔ̀ɔ̄-í à là gìdɨ̀ bɔ̀r.", "english": "{Proverb}  Your brother will accompany you to prison, but your half-brother will amble about the walls.", "sound_file": "Sound/NgonKooNSS1.mp3"}
],
"fixed_translation": "sibling, brother or sister.",
"type": "NT"
}

Mbay Term: "ngōn-kɨ̀lē"
English Translation: "key (see also"
Raw HTML:
"<div class=\"def\">\n<span class=\"word\">\n<span class=\"w sara-bagirmi-lang\">\n ngōn-kɨ̀lē\n</span>\n[ŋgō̰nkɨ̀lē]\n(Syn: =kɨ̀léè, làkér)\n</span>\n<span class=\"type\">NI  </span>\nkey (see also\n<span class=\"sara-bagirmi-lang\">kó̰o̰-kɨ̀lē</span> 'lock').\n<span class=\"sara-bagirmi-lang\">\n ādɨ̄-m̄ ngōn-kɨ̀lē ādɨ̄ m̄-tèē-ň tà-ɗóbɨ́. </span>\nGive me the key so I can open the door.\n</div>"
Result:
{
"examples": [
{"mbay": "ādɨ̄-m̄ ngōn-kɨ̀lē ādɨ̄ m̄-tèē-ň tà-ɗóbɨ́.", "english": "Give me the key so I can open the door.", "sound_file": null}
],
"fixed_translation": "key (see also kó̰o̰-kɨ̀lē 'lock').",
"type": "NI"
}

Mbay Term: {{mbay_term}}
English Translation: {{english_translation}}
Raw HTML:
{{raw_html}}

Result:"""


prompt = HumanMessagePromptTemplate.from_template(
    template=EXTRACTION_TMPL,
    input_variables=["mbay_term", "english_translation", "raw_html"],
    template_format="jinja2",
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

if __name__ == "__main__":
    main(sys.argv[1])
