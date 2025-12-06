import Link from "next/link";
import { DatasetSummary } from "../../../lib/types/datasets";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

type Props = {
  dataset: DatasetSummary;
};

export function DatasetCard({ dataset }: Props) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{dataset.name}</h3>
        <span className="text-sm text-white/60">{dataset.imageCount} pairs</span>
      </div>
      <p className="text-xs text-white/50">{new Date(dataset.createdAt).toLocaleString()}</p>
      <div className="flex gap-2">
        <Link href={`/game/${dataset.id}`}>
          <Button size="sm">Play</Button>
        </Link>
        <Link href={`/learn/${dataset.id}`}>
          <Button size="sm" variant="ghost">
            Learn
          </Button>
        </Link>
      </div>
    </Card>
  );
}

