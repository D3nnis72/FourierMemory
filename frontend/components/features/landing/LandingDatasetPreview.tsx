import Link from "next/link";
import { DatasetSummary } from "../../../lib/types/datasets";
import { Card } from "../../ui/Card";

type Props = {
  datasets: DatasetSummary[];
};

export function LandingDatasetPreview({ datasets }: Props) {
  if (!datasets.length) {
    return (
      <Card className="p-4 text-white/70">
        No datasets yet. Upload your own to get started.
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {datasets.slice(0, 3).map((ds) => (
        <Card key={ds.id} className="p-4 space-y-2">
          <p className="text-sm text-white/60">{new Date(ds.createdAt).toLocaleString()}</p>
          <h3 className="text-xl font-semibold">{ds.name}</h3>
          <p className="text-white/70">{ds.imageCount} pairs</p>
          <Link href={`/learn/${ds.id}`} className="text-accent-blue font-medium text-sm">
            Open in Learn Mode →
          </Link>
        </Card>
      ))}
    </div>
  );
}

