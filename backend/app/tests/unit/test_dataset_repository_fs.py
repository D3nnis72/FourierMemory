from datetime import datetime
from pathlib import Path
from tempfile import TemporaryDirectory

from app.domain.models.dataset import Dataset
from app.domain.models.image_pair import ImagePair
from app.infrastructure.storage.dataset_repository_fs import DatasetRepositoryFS


def test_save_and_list_datasets():
    with TemporaryDirectory() as tmpdir:
        base = Path(tmpdir)
        repo = DatasetRepositoryFS(base_dir=base)

        dataset = Dataset(
            id="ds1",
            name="Test",
            created_at=datetime.utcnow(),
            image_pairs=[
                ImagePair(
                    id="p1",
                    original_image_path="ds1/original/a.png",
                    fourier_image_path="ds1/fourier/a_fft.png",
                    label="a.png",
                )
            ],
        )

        repo.save(dataset)

        listed = repo.list_all()
        assert len(listed) == 1
        assert listed[0].id == "ds1"

        fetched = repo.find_by_id("ds1")
        assert fetched is not None
        assert fetched.name == "Test"

