import { ImagePair } from "../../../lib/types/datasets";

type Props = {
  pair: ImagePair;
  showOverlay: boolean;
};

export function SideBySideViewer({ pair, showOverlay }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4 items-center">
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        <img src={pair.originalImageUrl} alt={pair.label} className="w-full h-full object-cover" />
        {showOverlay && <OverlayLabel text="Spatial domain" />}
      </div>
      <div className="relative rounded-xl overflow-hidden border border-white/10">
        <img src={pair.fourierImageUrl} alt={`${pair.label} spectrum`} className="w-full h-full object-cover" />
        {showOverlay && <OverlayLabel text="Frequency domain" />}
      </div>
    </div>
  );
}

function OverlayLabel({ text }: { text: string }) {
  return (
    <div className="absolute bottom-3 left-3 bg-black/60 text-xs px-3 py-1 rounded-full border border-white/10">
      {text}
    </div>
  );
}

