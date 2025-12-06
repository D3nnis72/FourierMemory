"use client";

import { FormEvent, useState } from "react";
import { uploadDataset } from "../../lib/api/datasets";
import { DatasetSummary } from "../../lib/types/datasets";
import { UploadDropzone } from "../../components/features/upload/UploadDropzone";
import { UploadStatusPanel } from "../../components/features/upload/UploadStatusPanel";
import { UploadResultActions } from "../../components/features/upload/UploadResultActions";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function UploadClient() {
  const [datasetName, setDatasetName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<DatasetSummary>();

  const onFilesSelected = (fileList: FileList) => {
    setFiles(Array.from(fileList));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!datasetName || !files.length) {
      setError("Please provide a name and at least one file.");
      setStatus("error");
      return;
    }
    setStatus("uploading");
    setError(undefined);
    try {
      const formData = new FormData();
      formData.append("name", datasetName);
      files.forEach((file) => formData.append("files", file));
      const ds = await uploadDataset(formData);
      setResult(ds);
      setStatus("success");
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-sm text-white/70 mb-1">Dataset name</label>
          <input
            className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2"
            value={datasetName}
            onChange={(e) => setDatasetName(e.target.value)}
            placeholder="My Fourier set"
          />
        </div>
        <UploadDropzone onFilesSelected={onFilesSelected} />
        {files.length > 0 && (
          <div className="text-sm text-white/70">
            {files.length} file(s) selected: {files.map((f) => f.name).join(", ")}
          </div>
        )}
        <Button type="submit" disabled={status === "uploading"}>
          Generate Fourier Dataset
        </Button>
        <UploadStatusPanel status={status} message={error} />
        <UploadResultActions dataset={result} />
      </Card>
    </form>
  );
}

