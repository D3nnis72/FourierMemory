import { ImagePair } from "../../../lib/types/datasets";

type Props = {
  pairs: ImagePair[];
  selectedId: string;
  onSelect: (pairId: string) => void;
};

export function PairThumbnailStrip({ pairs, selectedId, onSelect }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {pairs.map((p) => (
        <button
          key={p.id}
          onClick={() => onSelect(p.id)}
          className={`flex-shrink-0 rounded-lg overflow-hidden border ${
            selectedId === p.id ? "border-accent-pink" : "border-white/10"
          }`}
        >
          <img src={p.originalImageUrl} alt={p.label} className="w-24 h-16 object-cover" />
        </button>
      ))}
    </div>
  );
}

