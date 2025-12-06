"use client";

import { useState } from "react";
import { DatasetDetails } from "../../../lib/types/datasets";
import { SideBySideViewer } from "../../../components/features/learn/SideBySideViewer";
import { LearnOverlayControls } from "../../../components/features/learn/LearnOverlayControls";
import { PairThumbnailStrip } from "../../../components/features/learn/PairThumbnailStrip";
import { ExplanationPanel } from "../../../components/features/learn/ExplanationPanel";

type Props = {
  dataset: DatasetDetails;
};

export default function LearnClient({ dataset }: Props) {
  const [selectedPairId, setSelectedPairId] = useState(dataset.pairs[0]?.id);
  const [showOverlay, setShowOverlay] = useState(true);

  const selectedPair = dataset.pairs.find((p) => p.id === selectedPairId) ?? dataset.pairs[0];

  if (!selectedPair) {
    return <p className="text-white/70">No pairs in this dataset.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Learn mode</p>
          <h2 className="text-2xl font-bold">{dataset.name}</h2>
        </div>
        <LearnOverlayControls showOverlay={showOverlay} onToggleOverlay={() => setShowOverlay((v) => !v)} />
      </div>

      <SideBySideViewer pair={selectedPair} showOverlay={showOverlay} />
      <PairThumbnailStrip pairs={dataset.pairs} selectedId={selectedPair.id} onSelect={setSelectedPairId} />
      <ExplanationPanel pair={selectedPair} />
    </div>
  );
}

