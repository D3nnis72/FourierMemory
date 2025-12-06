from pathlib import Path
from tempfile import TemporaryDirectory

from app.application.use_cases.upload_dataset import UploadDatasetUseCase, UploadedImage
from app.domain.services.fourier_service import FourierService
from app.infrastructure.storage.dataset_repository_fs import DatasetRepositoryFS
from app.infrastructure.storage.file_storage import FileStorage


class StubFourierService(FourierService):
    def compute_fourier(self, input_file: Path, output_file: Path) -> Path:  # type: ignore[override]
        output_file.write_bytes(b"stub")
        return output_file


def test_upload_dataset_creates_meta_and_files():
    with TemporaryDirectory() as tmpdir:
        base = Path(tmpdir)
        repo = DatasetRepositoryFS(base_dir=base)
        storage = FileStorage(base_dir=base)
        use_case = UploadDatasetUseCase(repo, StubFourierService(), storage)

        dto = use_case.execute(
            "My Dataset",
            [UploadedImage(filename="img.png", content=b"rawdata")],
        )

        assert dto.name == "My Dataset"
        meta_files = list(base.glob("*/meta.json"))
        assert meta_files, "meta.json should be written"
        # Ensure Fourier file written
        assert list(base.glob("*/fourier/*")), "Fourier output should be present"

