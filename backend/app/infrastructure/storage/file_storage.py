from pathlib import Path
from typing import Tuple

from ..config import settings


class FileStorage:
    def __init__(self, base_dir: Path | None = None) -> None:
        self.base_dir = base_dir or settings.data_dir

    def dataset_root(self, dataset_id: str) -> Path:
        return self.base_dir / dataset_id

    def original_dir(self, dataset_id: str) -> Path:
        return self.dataset_root(dataset_id) / "original"

    def fourier_dir(self, dataset_id: str) -> Path:
        return self.dataset_root(dataset_id) / "fourier"

    def save_original(self, dataset_id: str, filename: str, content: bytes) -> Tuple[Path, str]:
        safe_name = Path(filename).name
        target_dir = self.original_dir(dataset_id)
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / safe_name
        target_path.write_bytes(content)
        return target_path, self._to_rel(target_path)

    def reserve_fourier_path(self, dataset_id: str, filename: str) -> Tuple[Path, str]:
        safe_name = Path(filename).stem + "_fft.png"
        target_dir = self.fourier_dir(dataset_id)
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / safe_name
        return target_path, self._to_rel(target_path)

    def _to_rel(self, absolute_path: Path) -> str:
        return absolute_path.relative_to(self.base_dir).as_posix()

