from dataclasses import dataclass
from datetime import datetime
from typing import List
from uuid import uuid4

from ...domain.models.dataset import Dataset
from ...domain.models.image_pair import ImagePair
from ...domain.repositories.dataset_repository import DatasetRepository
from ...domain.services.fourier_service import FourierService
from ...application.dto.dataset_dto import DatasetSummaryDTO
from ...infrastructure.storage.file_storage import FileStorage


@dataclass
class UploadedImage:
    filename: str
    content: bytes


class UploadDatasetUseCase:
    def __init__(
        self,
        repository: DatasetRepository,
        fourier_service: FourierService,
        file_storage: FileStorage,
    ) -> None:
        self.repository = repository
        self.fourier_service = fourier_service
        self.file_storage = file_storage

    def execute(self, dataset_name: str, uploads: List[UploadedImage]) -> DatasetSummaryDTO:
        if not dataset_name:
            raise ValueError("Dataset name is required")
        if not uploads:
            raise ValueError("At least one file must be uploaded")

        dataset_id = str(uuid4())
        created_at = datetime.utcnow()
        image_pairs: List[ImagePair] = []

        for upload in uploads:
            original_abs, original_rel = self.file_storage.save_original(
                dataset_id, upload.filename, upload.content
            )
            fourier_abs, fourier_rel = self.file_storage.reserve_fourier_path(dataset_id, upload.filename)
            self.fourier_service.compute_fourier(original_abs, fourier_abs)

            pair = ImagePair(
                id=str(uuid4()),
                original_image_path=original_rel,
                fourier_image_path=fourier_rel,
                label=upload.filename,
            )
            image_pairs.append(pair)

        dataset = Dataset(
            id=dataset_id,
            name=dataset_name,
            created_at=created_at,
            image_pairs=image_pairs,
        )
        self.repository.save(dataset)
        return DatasetSummaryDTO.from_entity(dataset)

