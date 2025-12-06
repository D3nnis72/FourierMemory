import json
from datetime import datetime
from pathlib import Path
from typing import List, Optional

from ...domain.models.dataset import Dataset
from ...domain.models.image_pair import ImagePair
from ...domain.repositories.dataset_repository import DatasetRepository
from ..config import settings


class DatasetRepositoryFS(DatasetRepository):
    def __init__(self, base_dir: Path | None = None) -> None:
        self.base_dir = base_dir or settings.data_dir
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def _meta_path(self, dataset_id: str) -> Path:
        return self.base_dir / dataset_id / "meta.json"

    def save(self, dataset: Dataset) -> None:
        dataset_dir = self.base_dir / dataset.id
        dataset_dir.mkdir(parents=True, exist_ok=True)
        payload = {
            "id": dataset.id,
            "name": dataset.name,
            "created_at": dataset.created_at.isoformat(),
            "pairs": [
                {
                    "id": pair.id,
                    "original_image_path": pair.original_image_path,
                    "fourier_image_path": pair.fourier_image_path,
                    "label": pair.label,
                }
                for pair in dataset.image_pairs
            ],
        }
        self._meta_path(dataset.id).write_text(json.dumps(payload, indent=2))

    def find_by_id(self, dataset_id: str) -> Optional[Dataset]:
        meta_path = self._meta_path(dataset_id)
        if not meta_path.exists():
            return None
        data = json.loads(meta_path.read_text())
        pairs = [
            ImagePair(
                id=p["id"],
                original_image_path=p["original_image_path"],
                fourier_image_path=p["fourier_image_path"],
                label=p.get("label", ""),
            )
            for p in data.get("pairs", [])
        ]
        return Dataset(
            id=data["id"],
            name=data["name"],
            created_at=datetime.fromisoformat(data["created_at"]),
            image_pairs=pairs,
        )

    def list_all(self) -> List[Dataset]:
        datasets: List[Dataset] = []
        for meta_file in self.base_dir.glob("*/meta.json"):
            dataset = self.find_by_id(meta_file.parent.name)
            if dataset:
                datasets.append(dataset)
        datasets.sort(key=lambda d: d.created_at, reverse=True)
        return datasets

