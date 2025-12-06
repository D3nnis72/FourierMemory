import { ImagePair } from "../../../lib/types/datasets";

type Props = {
  pair: ImagePair;
};

export function ExplanationPanel({ pair }: Props) {
  return (
    <div className="rounded-xl bg-white/5 p-4 text-sm text-white/80 space-y-2">
      <h3 className="text-white font-semibold text-base">What you see</h3>
      <p>Original image label: {pair.label}</p>
      <p>
        Bright points in the spectrum indicate strong frequency components. Edges and repetitions in
        the image often translate to lines or discrete peaks here.
      </p>
    </div>
  );
}

