from functools import lru_cache

from ...application.use_cases.get_dataset_details import GetDatasetDetailsUseCase
from ...application.use_cases.list_datasets import ListDatasetsUseCase
from ...application.use_cases.upload_dataset import UploadDatasetUseCase
from ...domain.repositories.dataset_repository import DatasetRepository
from ...domain.services.fourier_service import FourierService
from ...infrastructure.processing.numpy_fourier_service import NumpyFourierService
from ...infrastructure.storage.dataset_repository_fs import DatasetRepositoryFS
from ...infrastructure.storage.file_storage import FileStorage


@lru_cache
def get_file_storage() -> FileStorage:
    return FileStorage()


@lru_cache
def get_dataset_repository() -> DatasetRepository:
    return DatasetRepositoryFS()


@lru_cache
def get_fourier_service() -> FourierService:
    return NumpyFourierService()


def get_upload_use_case() -> UploadDatasetUseCase:
    return UploadDatasetUseCase(
        repository=get_dataset_repository(),
        fourier_service=get_fourier_service(),
        file_storage=get_file_storage(),
    )


def get_list_use_case() -> ListDatasetsUseCase:
    return ListDatasetsUseCase(repository=get_dataset_repository())


def get_details_use_case() -> GetDatasetDetailsUseCase:
    return GetDatasetDetailsUseCase(repository=get_dataset_repository())

