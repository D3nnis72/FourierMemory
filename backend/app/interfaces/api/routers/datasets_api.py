from dataclasses import asdict
from typing import List

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel, ConfigDict

from ....application.use_cases.get_dataset_details import GetDatasetDetailsUseCase
from ....application.use_cases.list_datasets import ListDatasetsUseCase
from ....application.use_cases.upload_dataset import UploadDatasetUseCase, UploadedImage
from ..dependencies import (
    get_details_use_case,
    get_list_use_case,
    get_upload_use_case,
)

router = APIRouter(prefix="/datasets", tags=["datasets"])


class DatasetSummaryResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    image_count: int
    created_at: str


class ImagePairResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    original_image_url: str
    fourier_image_url: str
    label: str


class DatasetDetailsResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str
    name: str
    image_count: int
    created_at: str
    pairs: List[ImagePairResponse]


@router.post("", response_model=DatasetSummaryResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset(
    name: str = Form(...),
    files: List[UploadFile] = File(...),
    use_case: UploadDatasetUseCase = Depends(get_upload_use_case),
):
    try:
        uploads = [UploadedImage(filename=f.filename, content=await f.read()) for f in files]
        dto = use_case.execute(name, uploads)
        return asdict(dto)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("", response_model=List[DatasetSummaryResponse])
def list_datasets(use_case: ListDatasetsUseCase = Depends(get_list_use_case)):
    return [asdict(dto) for dto in use_case.execute()]


@router.get("/{dataset_id}", response_model=DatasetDetailsResponse)
def get_dataset(dataset_id: str, use_case: GetDatasetDetailsUseCase = Depends(get_details_use_case)):
    try:
        dto = use_case.execute(dataset_id)
        return asdict(dto)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

