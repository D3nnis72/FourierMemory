"use client";

import { useMemo, useState } from "react";
import { DatasetDetails } from "../../../lib/types/datasets";
import { CardView } from "../../../components/features/game/GameCard";
import { GameBoard } from "../../../components/features/game/GameBoard";
import { ScorePanel } from "../../../components/features/game/ScorePanel";
import { MatchInfoPanel } from "../../../components/features/game/MatchInfoPanel";
import { Button } from "../../../components/ui/Button";

type Props = {
  dataset: DatasetDetails;
};

function shuffle<T>(items: T[]): T[] {
  return items
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

export default function GameClient({ dataset }: Props) {
  const [cards, setCards] = useState<CardView[]>(() => {
    const prepared = dataset.pairs.flatMap((pair) => [
      {
        id: `${pair.id}-orig`,
        pairId: pair.id,
        type: "original" as const,
        imageUrl: pair.originalImageUrl,
        label: pair.label,
        faceUp: false,
        matched: false,
      },
      {
        id: `${pair.id}-fft`,
        pairId: pair.id,
        type: "spectrum" as const,
        imageUrl: pair.fourierImageUrl,
        label: pair.label,
        faceUp: false,
        matched: false,
      },
    ]);
    return shuffle(prepared);
  });

  const [activePlayer, setActivePlayer] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [openCardIds, setOpenCardIds] = useState<string[]>([]);
  const [locked, setLocked] = useState(false);
  const [matchInfo, setMatchInfo] = useState<string>();

  const gameOver = useMemo(() => cards.every((c) => c.matched), [cards]);

  const reset = () => {
    setCards((prev) => shuffle(prev.map((c) => ({ ...c, matched: false, faceUp: false }))));
    setScores([0, 0]);
    setActivePlayer(0);
    setOpenCardIds([]);
    setLocked(false);
    setMatchInfo(undefined);
  };

  const handleSelect = (cardId: string) => {
    if (locked) return;
    const card = cards.find((c) => c.id === cardId);
    if (!card || card.faceUp || card.matched) return;

    const newOpen = [...openCardIds, cardId];
    setOpenCardIds(newOpen);
    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, faceUp: true } : c)));

    if (newOpen.length === 2) {
      setLocked(true);
      const [firstId, secondId] = newOpen;
      const first = cards.find((c) => c.id === firstId)!;
      const second = card;
      const isMatch = first.pairId === second.pairId && first.type !== second.type;

      if (isMatch) {
        setCards((prev) =>
          prev.map((c) =>
            c.pairId === first.pairId ? { ...c, matched: true, faceUp: true } : c,
          ),
        );
        setScores((prev) => {
          const next = [...prev];
          next[activePlayer] += 1;
          return next;
        });
        setMatchInfo(`Nice! ${first.label} pair matched.`);
        setOpenCardIds([]);
        setLocked(false);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, faceUp: false } : c)),
          );
          setOpenCardIds([]);
          setActivePlayer((prev) => (prev === 0 ? 1 : 0));
          setMatchInfo(undefined);
          setLocked(false);
        }, 900);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60">Dataset</p>
          <h2 className="text-2xl font-bold">{dataset.name}</h2>
        </div>
        <ScorePanel activePlayer={activePlayer} scores={scores} />
        <Button variant="ghost" onClick={reset}>
          Restart
        </Button>
      </div>
      <MatchInfoPanel text={matchInfo} />
      <GameBoard cards={cards} onSelect={handleSelect} disabled={locked || gameOver} />
      {gameOver && (
        <div className="rounded-xl bg-white/10 p-4">
          <h3 className="text-xl font-semibold">Game over</h3>
          <p className="text-white/70">
            {scores[0] === scores[1]
              ? "It's a tie!"
              : scores[0] > scores[1]
                ? "Player A wins"
                : "Player B wins"}
          </p>
        </div>
      )}
    </div>
  );
}

