from pathlib import Path
from typing import Protocol


class FourierService(Protocol):
    def compute_fourier(self, input_file: Path, output_file: Path) -> Path:
        """
        Compute Fourier spectrum for input_file and write to output_file.
        Returns the output file path.
        """
        ...

