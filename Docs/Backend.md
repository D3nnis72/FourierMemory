## 1. Goals and constraints

**Goals**

- Simple to understand
- Easy to extend later (auth, stats, more processing)
- Testable without HTTP or file system hacks
- Clear separation of:

  - domain logic
  - orchestration / use cases
  - infrastructure details

**Non-goals**

- No real-time multiplayer logic
- No complex database needed initially, filesystem + small JSON is enough

---

## 2. High level architecture

Use a **ports and adapters** / **clean architecture** style:

- **Domain layer**
  Pure business logic and data structures, no framework imports.

- **Application layer**
  Use cases, coordinate domain services and infrastructure, no HTTP here.

- **Infrastructure layer**
  Concrete adapters for file storage, Fourier computation, persistence.

- **Interface layer**
  HTTP API (e.g. FastAPI), maps requests to use cases and responses to JSON.

Think of it like:

> Browser → HTTP API → Use Case → Repositories + FourierService → filesystem
>
> and back again.

---

## 3. Backend folder structure

Suggestion:

```text
backend/
  app/
    domain/
      models/
        dataset.py
        image_pair.py
      services/
        fourier_service.py
    application/
      use_cases/
        upload_dataset.py
        list_datasets.py
        get_dataset_details.py
      dto/
        dataset_dto.py
    infrastructure/
      storage/
        dataset_repository_fs.py
        file_storage.py
      processing/
        numpy_fourier_service.py
      config.py
      logging.py
    interfaces/
      api/
        routers/
          datasets_api.py
          health_api.py
        dependencies.py
    tests/
      unit/
      integration/
  main.py
```

You can adapt naming, but the **separation by intent** is the important part.

---

## 4. Domain layer

### 4.1 Domain models

These are framework-independent Python classes or dataclasses.

**Entities:**

- `Dataset`

  - id
  - name
  - image_pairs: list of `ImagePair`
  - created_at

- `ImagePair`

  - id
  - original_image_path (internal path)
  - fourier_image_path (internal path)
  - label or original_filename

These classes know nothing about JSON, HTTP, file formats, etc.

---

### 4.2 Domain services

Here lives the **abstract idea** of “compute Fourier image”, without saying how.

- `FourierService` interface

  - `compute_fourier(input_file: Path) -> Path`
    Takes an input image, returns the path of the generated spectrum image.

Domain also defines **ports** for persistence:

- `DatasetRepository` interface

  - `save(dataset: Dataset) -> None`
  - `find_by_id(dataset_id: str) -> Dataset | None`
  - `list_all() -> list[Dataset]`

No filesystem code here, only method definitions.

---

## 5. Application layer

This layer implements **use cases** that the UI needs.

Each use case:

- takes simple parameters (strings, lists, files)
- talks to repositories and services through interfaces
- returns DTOs that are easy to serialize

### 5.1 Use cases

**1. UploadDatasetUseCase**

Responsibility:

- Take a dataset name and uploaded files
- Generate a dataset ID
- Store originals
- Call FourierService for each file
- Build Dataset entity
- Save via DatasetRepository
- Return a Dataset DTO

**2. ListDatasetsUseCase**

Responsibility:

- Fetch all datasets via repository
- Map to a simple list DTO (id, name, image_count, created_at)

**3. GetDatasetDetailsUseCase**

Responsibility:

- Fetch one dataset by ID
- Map to DTO including list of image pairs with URL paths the frontend can use

---

### 5.2 DTOs (Data Transfer Objects)

Separate from domain models, they are shaped for the **outside world**.

Examples:

- `DatasetSummaryDTO`

  - id
  - name
  - image_count
  - created_at

- `DatasetDetailsDTO`

  - id
  - name
  - image_count
  - pairs: list of `ImagePairDTO`

- `ImagePairDTO`

  - id
  - original_image_url
  - fourier_image_url
  - label

DTOs are returned from use cases to the API layer.

---

## 6. Infrastructure layer

Here you put the **concrete implementations** of the interfaces from domain and application.

### 6.1 Storage

**FileStorage**

- Responsible for low level:

  - create directories
  - write files to disk
  - maybe generate absolute and relative paths

Methods like:

- save_uploaded_file(uploaded_file, target_path)
- ensure_directory(path)

**DatasetRepositoryFS**

Implements `DatasetRepository` using filesystem + JSON:

- Stores each dataset in a folder:

  - `/data/{dataset_id}/meta.json`
  - `/data/{dataset_id}/original/`
  - `/data/{dataset_id}/fourier/`

- `save(dataset)`

  - writes `meta.json`

- `find_by_id(dataset_id)`

  - reads `meta.json`, creates `Dataset` entity

- `list_all()`

  - scans `/data` for dataset folders, reads metadatas

No Fourier logic here, just reading and writing.

---

### 6.2 Fourier processing

**NumpyFourierService**

Implements `FourierService` with NumPy / OpenCV / Pillow.

Responsibilities:

- Load an image as grayscale array
- Compute 2D FFT
- Shift and take magnitude
- Apply log scaling
- Normalize and save as PNG

Returns the path to the created spectrum file.

Infra is where all the heavy libraries live.

---

### 6.3 Config and logging

`config.py`:

- base data directory
- static root path
- max upload size
- debug flag

`logging.py`:

- central setup for loggers used across layers
- ensures use cases can log without caring about configuration

---

## 7. Interface layer (HTTP API)

Here you connect the outside world to your use cases.

Framework example: FastAPI, but conceptually the same for any framework.

### 7.1 Dependency wiring

In `interfaces/api/dependencies.py`:

- Create singletons or factories for:

  - DatasetRepositoryFS
  - NumpyFourierService
  - Use cases

The idea:

- HTTP handlers call use cases, nothing else.
- No direct filesystem or FFT in routes.

---

### 7.2 Datasets API

Router `datasets_api.py` provides endpoints:

1. `POST /datasets`

   - Input: dataset name, list of files
   - Handler:

     - parse form data
     - call `UploadDatasetUseCase`
     - return DatasetSummaryDTO as JSON

2. `GET /datasets`

   - Input: none
   - Handler:

     - call `ListDatasetsUseCase`
     - return list of DatasetSummaryDTO

3. `GET /datasets/{dataset_id}`

   - Input: dataset id
   - Handler:

     - call `GetDatasetDetailsUseCase`
     - return DatasetDetailsDTO

4. `GET /health`

   - Simple health check for the frontend / deployment

Static files (originals and Fourier images) are served by the web server or FastAPI’s StaticFiles mount from the same directory the repository writes to.

---

## 8. Example flow: upload dataset

To see how clean the flow is, walk through one request:

1. Frontend POSTs to `/datasets` with name and files.

2. HTTP handler receives request, collects form fields, files.

3. HTTP handler creates `UploadDatasetRequest` object and calls
   `UploadDatasetUseCase.execute(request)`

4. Use case logic:

   - generate dataset_id
   - for each uploaded file:

     - use FileStorage to write original into `/data/{id}/original/`
     - call FourierService with original file path, get Fourier path
     - create ImagePair entity

   - create Dataset entity with all pairs
   - call DatasetRepository.save(dataset)
   - build `DatasetSummaryDTO` from entity

5. DTO is returned to HTTP handler.

6. HTTP handler serializes DTO to JSON and responds.

Important:
No FFT in the controller, no file writes in the use case, no HTTP in the repository.

## 10. Summary

Your clean-code backend architecture is:

- **Domain**
  Pure models and interfaces, explaining “what is a dataset” and “what is a Fourier service”.

- **Application**
  Use cases like upload, list, get, only coordinating work.

- **Infrastructure**
  Real implementations for filesystem storage and Fourier, plus config and logging.

- **Interfaces**
  HTTP API that does nothing but translate requests into use case calls and DTOs back into responses.

This will feel extremely clean once you start implementing, and your frontend can rely on a very stable and simple contract.

If you want, next step we can write an `BackendArchitecture.md` text for your repo in a polished, documentation style.
