import { CardView, GameCard } from "./GameCard";

type Props = {
  cards: CardView[];
  onSelect: (cardId: string) => void;
  disabled?: boolean;
};

export function GameBoard({ cards, onSelect, disabled }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {cards.map((card) => (
        <GameCard key={card.id} card={card} onSelect={onSelect} disabled={disabled} />
      ))}
    </div>
  );
}

