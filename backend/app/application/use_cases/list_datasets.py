from typing import List

from ...domain.repositories.dataset_repository import DatasetRepository
from ...application.dto.dataset_dto import DatasetSummaryDTO


class ListDatasetsUseCase:
    def __init__(self, repository: DatasetRepository) -> None:
        self.repository = repository

    def execute(self) -> List[DatasetSummaryDTO]:
        datasets = self.repository.list_all()
        return [DatasetSummaryDTO.from_entity(ds) for ds in datasets]

