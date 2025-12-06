type Props = {
  activePlayer: number;
  scores: number[];
};

export function ScorePanel({ activePlayer, scores }: Props) {
  const players = ["Player A", "Player B"];
  return (
    <div className="flex gap-4 items-center">
      {players.map((name, idx) => (
        <div
          key={name}
          className={`rounded-lg px-3 py-2 ${activePlayer === idx ? "bg-accent-pink/30" : "bg-white/10"}`}
        >
          <div className="text-sm text-white/60">{name}</div>
          <div className="text-xl font-bold">{scores[idx]}</div>
        </div>
      ))}
    </div>
  );
}

