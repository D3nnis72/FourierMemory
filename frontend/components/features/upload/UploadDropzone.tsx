"use client";

import { ChangeEvent, useCallback } from "react";

type Props = {
  onFilesSelected: (files: FileList) => void;
};

export function UploadDropzone({ onFilesSelected }: Props) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        onFilesSelected(event.target.files);
      }
    },
    [onFilesSelected],
  );

  return (
    <label className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center block cursor-pointer hover:border-accent-pink/60 transition">
      <input type="file" multiple accept="image/*" className="hidden" onChange={handleChange} />
      <p className="text-lg font-semibold">Drop images here or click to browse</p>
      <p className="text-white/60 text-sm mt-2">PNG or JPG files are supported</p>
    </label>
  );
}

