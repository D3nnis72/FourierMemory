import { DatasetDetails, DatasetSummary } from "../types/datasets";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

const mapSummary = (data: any): DatasetSummary => ({
  id: data.id,
  name: data.name,
  imageCount: data.image_count,
  createdAt: data.created_at,
});

export async function getDatasets(): Promise<DatasetSummary[]> {
  const data = await request<any[]>("/datasets");
  return data.map(mapSummary);
}

export async function getDatasetDetails(datasetId: string): Promise<DatasetDetails> {
  const data = await request<any>(`/datasets/${datasetId}`);
  return {
    id: data.id,
    name: data.name,
    imageCount: data.image_count,
    createdAt: data.created_at,
    pairs: data.pairs.map((p: any) => ({
      id: p.id,
      originalImageUrl: `${API_BASE}${p.original_image_url}`,
      fourierImageUrl: `${API_BASE}${p.fourier_image_url}`,
      label: p.label,
    })),
  };
}

export async function uploadDataset(formData: FormData): Promise<DatasetSummary> {
  const data = await request<any>("/datasets", {
    method: "POST",
    body: formData,
  });
  return mapSummary(data);
}

