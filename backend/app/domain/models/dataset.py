from dataclasses import dataclass, field
from datetime import datetime
from typing import List

from .image_pair import ImagePair


@dataclass
class Dataset:
    id: str
    name: str
    created_at: datetime
    image_pairs: List[ImagePair] = field(default_factory=list)

