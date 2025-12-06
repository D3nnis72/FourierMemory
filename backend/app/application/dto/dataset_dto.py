from dataclasses import dataclass
from typing import List

from ...domain.models.dataset import Dataset
from ...domain.models.image_pair import ImagePair


@dataclass
class DatasetSummaryDTO:
    id: str
    name: str
    image_count: int
    created_at: str

    @staticmethod
    def from_entity(dataset: Dataset) -> "DatasetSummaryDTO":
        return DatasetSummaryDTO(
            id=dataset.id,
            name=dataset.name,
            image_count=len(dataset.image_pairs),
            created_at=dataset.created_at.isoformat(),
        )


@dataclass
class ImagePairDTO:
    id: str
    original_image_url: str
    fourier_image_url: str
    label: str

    @staticmethod
    def from_entity(pair: ImagePair, static_prefix: str) -> "ImagePairDTO":
        return ImagePairDTO(
            id=pair.id,
            original_image_url=f"{static_prefix}/{pair.original_image_path}",
            fourier_image_url=f"{static_prefix}/{pair.fourier_image_path}",
            label=pair.label,
        )


@dataclass
class DatasetDetailsDTO:
    id: str
    name: str
    image_count: int
    created_at: str
    pairs: List[ImagePairDTO]

    @staticmethod
    def from_entity(dataset: Dataset, static_prefix: str) -> "DatasetDetailsDTO":
        pairs = [ImagePairDTO.from_entity(pair, static_prefix) for pair in dataset.image_pairs]
        return DatasetDetailsDTO(
            id=dataset.id,
            name=dataset.name,
            image_count=len(dataset.image_pairs),
            created_at=dataset.created_at.isoformat(),
            pairs=pairs,
        )

