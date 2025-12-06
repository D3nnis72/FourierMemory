from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .infrastructure.config import settings
from .infrastructure.logging import setup_logging
from .interfaces.api.routers import datasets_api, health_api

setup_logging()

app = FastAPI(title="Fourier Memory API", version="0.1.0")

# Basic permissive CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets_api.router)
app.include_router(health_api.router)

app.mount(
    settings.static_url_prefix,
    StaticFiles(directory=settings.data_dir),
    name="static",
)


@app.get("/")
def root():
    return {"message": "Fourier Memory API", "endpoints": ["/datasets", "/health"]}

