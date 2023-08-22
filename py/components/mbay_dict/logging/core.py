from __future__ import annotations

import logging
import os

# import orjson
import structlog

LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
FORMAT = "%(asctime)-15s %(levelname)s %(message)s"


# def dumps(obj, *args, **kwargs):
#     return orjson.dumps(obj, *args, **kwargs).decode("utf-8")
_NOISY_LOG_SOURCES = [
    "botocore",
    "boto3",
    "urllib3",
    "s3transfer",
    "boto",
    "aiobotocore",
]

def configure() -> None:
    """Configure logging to be structured. Call it once at the beginning of your program."""  # noqa: E501
    level = logging.getLevelName(LOG_LEVEL)
    if logging.getLogger().hasHandlers():
        # The Lambda environment pre-configures a handler logging to stderr. If a handler is already configured,
        # `.basicConfig` does not execute. Thus we set the level directly.
        logging.getLogger().setLevel(level)
    else:
        logging.basicConfig(
            format="%(message)s",
            level=level,
            force=True,
        )
    structlog.configure(
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            # Perform %-style formatting.
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.stdlib.BoundLogger,
        logger_factory=structlog.stdlib.LoggerFactory(),
        cache_logger_on_first_use=True,
    )

    # Disable noisy loggers
    for source in _NOISY_LOG_SOURCES:
        logging.getLogger(source).setLevel(logging.WARNING)


def get_logger(name: str | None) -> structlog.stdlib.BoundLogger:
    """Get a logger with the given name."""
    return structlog.get_logger(name)
