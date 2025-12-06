import { DatasetSummary } from "../../../lib/types/datasets";
import { DatasetCard } from "./DatasetCard";

type Props = {
  datasets: DatasetSummary[];
};

export function DatasetList({ datasets }: Props) {
  if (!datasets.length) {
    return <p className="text-white/70">No datasets found. Try uploading some!</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {datasets.map((ds) => (
        <DatasetCard key={ds.id} dataset={ds} />
      ))}
    </div>
  );
}

