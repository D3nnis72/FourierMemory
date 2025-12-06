import Link from "next/link";
import { DatasetSummary } from "../../../lib/types/datasets";
import { Button } from "../../ui/Button";

type Props = {
  dataset?: DatasetSummary;
};

export function UploadResultActions({ dataset }: Props) {
  if (!dataset) return null;
  return (
    <div className="flex gap-3">
      <Link href={`/game/${dataset.id}`}>
        <Button>Play this dataset</Button>
      </Link>
      <Link href={`/learn/${dataset.id}`}>
        <Button variant="ghost">Open in Learn mode</Button>
      </Link>
    </div>
  );
}

