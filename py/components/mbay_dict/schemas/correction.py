"""
The original XML database has incorrect characters in it. This file contains a corrector for these characters.
"""
from typing import overload


MAPPING = {
    # a
    "à": ["à"],
    "á": ["á"],
    "â": ["Γ"],
    "ā": ["ä"],
    "a̰": ["½"],
    "à̰": ["¼"],
    "á̰": ["ª"],
    "ā̰": ["º"],
    # e
    "è": ["è"],
    "é": ["é"],
    "ē": ["ë"],
    "ḛ": ["õ"],
    "ḛ̄": ["þ"],
    "ḛ̀": ["Ÿ"],
    "ḛ́": ["Ï"],
    # i
    "ì": ["ì"],
    "í": ["í"],
    "ī": ["ï"],
    "ḭ̄": ["¬"],
    # o
    "ò": ["ò"],
    "ó": ["ó"],
    "ō": ["ö"],
    "o̰": ["¢"],
    "ò̰": ["Å"],
    "ó̰": ["Ç"],
    "ō̰": ["ç"],
    # u
    "ù": ["ù"],
    "ú": ["ú"],
    "ū": ["ü"],
    "ṵ": ["¾"],
    "ṵ̀": ["“"],
    "ṵ́": ["ø"],
    "ṵ̄": ["¦"],
    # l
    "ĺ": ["•"],
    "l̀": ["¥"],
    "l̄": ["£"],
    # n
    "ǹ": ["µ"],
    "ń": ["Ñ"],
    "n̄": ["ñ"],
    "ň": ["²"],
    # r
    "r̀": ["±"],
    "ŕ": ["©"],
    "r̄": ["®"],
    # b
    "ɓ": ["ß"],
    # c
    "ɔ": ["ɔ"],
    "ɔ́": ["ô"],
    "ɔ̀": ["î"],
    "ɔ̄": ["û"],
    # d
    "ɗ": ["÷"],
    # i
    "ḭ": ["¿"],
    "ḭ̀": ["¡"],
    "ḭ́": ["ƒ"],
    # m
    "ḿ": ["»"],
    "m̄": ["«"],
    # w
    "ẁ": ["Þ"],
    "w̄": ["Û"],
    # y
    # y
    "ý": ["ý"],
    "ỳ": ["Ø"],
    "ӯ": ["ÿ"],
    # i special
    # "ɨ": ["Æ"],
    "ɨ̀": ["Æ"],
    "ɨ́": ["É"],
    "ɨ̄": ["æ"],
}


def create_reverse_mapping() -> dict[str, list[str]]:
    reverse_mapping = {}
    for key, value in MAPPING.items():
        for v in value:
            if v in reverse_mapping:
                print(f"Duplicate values {v}: {key} and {reverse_mapping[v]}")
            reverse_mapping[v] = key
    return reverse_mapping


REVERSE_MAPPING = create_reverse_mapping()


@overload
def correct_mbay_string(s: str) -> str:
    ...


@overload
def correct_mbay_string(s: None) -> None:
    ...


def correct_mbay_string(s: str | None) -> str | None:
    if s is None:
        return None
    for key, value in REVERSE_MAPPING.items():
        s = s.replace(key, value)
    return s
