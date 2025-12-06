import { notFound } from "next/navigation";
import GameClient from "./GameClient";
import { getDatasetDetails } from "../../../lib/api/datasets";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

type Props = {
  params: { datasetId: string };
};

export default async function GamePage({ params }: Props) {
  try {
    const dataset = await getDatasetDetails(params.datasetId);
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link href="/datasets">
            <Button variant="ghost" size="sm">
              ← Back to datasets
            </Button>
          </Link>
        </div>
        <GameClient dataset={dataset} />
      </div>
    );
  } catch (err) {
    console.error(err);
    notFound();
  }
}

