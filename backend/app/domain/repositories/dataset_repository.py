from typing import List, Protocol, Optional

from ..models.dataset import Dataset


class DatasetRepository(Protocol):
    def save(self, dataset: Dataset) -> None:
        ...

    def find_by_id(self, dataset_id: str) -> Optional[Dataset]:
        ...

    def list_all(self) -> List[Dataset]:
        ...

