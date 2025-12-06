import logging
from logging import Logger


def setup_logging(level: int = logging.INFO) -> Logger:
    """
    Configure a simple application-wide logger.
    """
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    return logging.getLogger("fourier-memory")

