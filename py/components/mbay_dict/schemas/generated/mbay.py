from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class NewDataSet:
    entry: List["NewDataSet.Entry"] = field(
        default_factory=list,
        metadata={
            "name": "Entry",
            "type": "Element",
            "namespace": "",
        }
    )
    translations: List["NewDataSet.Translations"] = field(
        default_factory=list,
        metadata={
            "name": "Translations",
            "type": "Element",
            "namespace": "",
        }
    )
    samples: List["NewDataSet.Samples"] = field(
        default_factory=list,
        metadata={
            "name": "Samples",
            "type": "Element",
            "namespace": "",
        }
    )
    expressions: List["NewDataSet.Expressions"] = field(
        default_factory=list,
        metadata={
            "name": "Expressions",
            "type": "Element",
            "namespace": "",
        }
    )

    @dataclass
    class Entry:
        entry: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRY",
                "type": "Element",
                "namespace": "",
            }
        )
        entrycode: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYCODE",
                "type": "Element",
                "namespace": "",
            }
        )
        soundfile: Optional[str] = field(
            default=None,
            metadata={
                "name": "SOUNDFILE",
                "type": "Element",
                "namespace": "",
            }
        )

    @dataclass
    class Translations:
        translate: Optional[str] = field(
            default=None,
            metadata={
                "name": "TRANSLATE",
                "type": "Element",
                "namespace": "",
            }
        )
        category: Optional[str] = field(
            default=None,
            metadata={
                "name": "CATEGORY",
                "type": "Element",
                "namespace": "",
            }
        )
        entrycode: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYCODE",
                "type": "Element",
                "namespace": "",
            }
        )
        trancode: Optional[str] = field(
            default=None,
            metadata={
                "name": "TRANCODE",
                "type": "Element",
                "namespace": "",
            }
        )
        entrytranc: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYTRANC",
                "type": "Element",
                "namespace": "",
            }
        )
        relword: Optional[str] = field(
            default=None,
            metadata={
                "name": "RELWORD",
                "type": "Element",
                "namespace": "",
            }
        )
        gramnote: Optional[str] = field(
            default=None,
            metadata={
                "name": "GRAMNOTE",
                "type": "Element",
                "namespace": "",
            }
        )
        sortfield: Optional[str] = field(
            default=None,
            metadata={
                "name": "SORTFIELD",
                "type": "Element",
                "namespace": "",
            }
        )

    @dataclass
    class Samples:
        samplesent: Optional[str] = field(
            default=None,
            metadata={
                "name": "SAMPLESENT",
                "type": "Element",
                "namespace": "",
            }
        )
        trans_sent: Optional[str] = field(
            default=None,
            metadata={
                "name": "TRANS_SENT",
                "type": "Element",
                "namespace": "",
            }
        )
        soundfile: Optional[str] = field(
            default=None,
            metadata={
                "name": "SOUNDFILE",
                "type": "Element",
                "namespace": "",
            }
        )
        entrycode: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYCODE",
                "type": "Element",
                "namespace": "",
            }
        )
        trancode: Optional[str] = field(
            default=None,
            metadata={
                "name": "TRANCODE",
                "type": "Element",
                "namespace": "",
            }
        )
        entrytranc: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYTRANC",
                "type": "Element",
                "namespace": "",
            }
        )

    @dataclass
    class Expressions:
        idiom_exp: Optional[str] = field(
            default=None,
            metadata={
                "name": "IDIOM_EXP",
                "type": "Element",
                "namespace": "",
            }
        )
        trans_exp: Optional[str] = field(
            default=None,
            metadata={
                "name": "TRANS_EXP",
                "type": "Element",
                "namespace": "",
            }
        )
        samplesent: Optional[str] = field(
            default=None,
            metadata={
                "name": "SAMPLESENT",
                "type": "Element",
                "namespace": "",
            }
        )
        trans_sent: Optional[str] = field(
            default=None,
            metadata={
                "name": "TRANS_SENT",
                "type": "Element",
                "namespace": "",
            }
        )
        entrycode: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYCODE",
                "type": "Element",
                "namespace": "",
            }
        )
        entrytranc: Optional[str] = field(
            default=None,
            metadata={
                "name": "ENTRYTRANC",
                "type": "Element",
                "namespace": "",
            }
        )
        soundfile: Optional[str] = field(
            default=None,
            metadata={
                "name": "SOUNDFILE",
                "type": "Element",
                "namespace": "",
            }
        )
        soundexpr: Optional[str] = field(
            default=None,
            metadata={
                "name": "SOUNDEXPR",
                "type": "Element",
                "namespace": "",
            }
        )
