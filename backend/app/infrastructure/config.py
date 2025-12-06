from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    data_dir: Path = Path(__file__).resolve().parent.parent.parent / "data"
    static_url_prefix: str = "/static"
    debug: bool = True

    class Config:
        env_prefix = "FOURIER_"
        case_sensitive = False


settings = Settings()
settings.data_dir.mkdir(parents=True, exist_ok=True)

