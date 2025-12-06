import clsx from "clsx";

export type CardType = "original" | "spectrum";

export type CardView = {
  id: string;
  pairId: string;
  type: CardType;
  imageUrl: string;
  label: string;
  faceUp: boolean;
  matched: boolean;
};

type Props = {
  card: CardView;
  onSelect: (cardId: string) => void;
  disabled?: boolean;
};

export function GameCard({ card, onSelect, disabled }: Props) {
  const baseColors =
    card.type === "original"
      ? "border-accent-blue/60 shadow-[0_10px_30px_rgba(6,182,212,0.25)]"
      : "border-accent-pink/60 shadow-[0_10px_30px_rgba(236,72,153,0.25)]";
  const faceLabel =
    card.type === "original"
      ? "bg-accent-blue/20 text-accent-blue border border-accent-blue/40"
      : "bg-accent-pink/20 text-accent-pink border border-accent-pink/40";

  return (
    <button
      className={clsx(
        "relative aspect-square rounded-xl overflow-hidden transition transform",
        baseColors,
        card.matched ? "opacity-60" : "hover:-translate-y-1",
      )}
      onClick={() => onSelect(card.id)}
      disabled={disabled || card.faceUp || card.matched}
    >
      <div
        className={clsx(
          "absolute inset-0 backface-hidden transition",
          card.faceUp ? "opacity-100" : "opacity-0",
        )}
      >
        <img src={card.imageUrl} alt={card.label} className="w-full h-full object-cover" />
      </div>
      <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center text-white/80",
          card.faceUp ? "opacity-0" : "opacity-100",
          card.type === "original" ? "bg-accent-blue/10" : "bg-accent-pink/10",
        )}
      >
        <span className={clsx("px-3 py-1 rounded-full text-sm font-semibold", faceLabel)}>
          {card.type === "original" ? "Image" : "Spectrum"}
        </span>
      </div>
      {card.matched && (
        <div
          className={clsx(
            "absolute inset-0 ring-4 pointer-events-none",
            card.type === "original" ? "ring-accent-blue/60" : "ring-accent-pink/60",
          )}
        ></div>
      )}
    </button>
  );
}

