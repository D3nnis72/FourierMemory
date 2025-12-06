import { getDatasets } from "../../lib/api/datasets";
import { DatasetList } from "../../components/features/datasets/DatasetList";
import Link from "next/link";
import { Button } from "../../components/ui/Button";

export default async function DatasetsPage() {
  const datasets = await getDatasets();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Gallery</p>
          <h1 className="text-3xl font-bold">Datasets</h1>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm">
            ← Back home
          </Button>
        </Link>
      </div>
      <DatasetList datasets={datasets} />
    </div>
  );
}

