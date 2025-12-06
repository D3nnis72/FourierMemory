from pathlib import Path

import numpy as np
from PIL import Image

from ...domain.services.fourier_service import FourierService


class NumpyFourierService(FourierService):
    def compute_fourier(self, input_file: Path, output_file: Path) -> Path:
        img = Image.open(input_file).convert("L")
        arr = np.asarray(img, dtype=np.float32)

        spectrum = np.fft.fft2(arr)
        spectrum_shifted = np.fft.fftshift(spectrum)
        magnitude = np.abs(spectrum_shifted)
        magnitude = np.log1p(magnitude)

        # np.ptp (peak-to-peak) in NumPy 2.x
        mag_range = np.ptp(magnitude)
        magnitude_norm = 255 * (magnitude - magnitude.min()) / (mag_range + 1e-8)
        magnitude_uint8 = magnitude_norm.astype(np.uint8)

        output_file.parent.mkdir(parents=True, exist_ok=True)
        Image.fromarray(magnitude_uint8).save(output_file, format="PNG")
        return output_file

