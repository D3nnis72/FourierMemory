import UploadClient from "./UploadClient";
import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default function UploadPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Dataset Studio</p>
          <h1 className="text-3xl font-bold">Upload images and generate Fourier pairs</h1>
        </div>
        <Link href="/datasets">
          <Button variant="ghost" size="sm">
            ← Back to datasets
          </Button>
        </Link>
      </div>
      <UploadClient />
    </div>
  );
}

