from ...domain.repositories.dataset_repository import DatasetRepository
from ...application.dto.dataset_dto import DatasetDetailsDTO
from ...infrastructure.config import settings


class GetDatasetDetailsUseCase:
    def __init__(self, repository: DatasetRepository) -> None:
        self.repository = repository

    def execute(self, dataset_id: str) -> DatasetDetailsDTO:
        dataset = self.repository.find_by_id(dataset_id)
        if not dataset:
            raise ValueError("Dataset not found")
        return DatasetDetailsDTO.from_entity(dataset, settings.static_url_prefix)

