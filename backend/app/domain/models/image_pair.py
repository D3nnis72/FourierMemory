from dataclasses import dataclass


@dataclass
class ImagePair:
    id: str
    original_image_path: str
    fourier_image_path: str
    label: str

