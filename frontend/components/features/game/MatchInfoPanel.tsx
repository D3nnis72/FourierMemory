type Props = {
  text?: string;
};

export function MatchInfoPanel({ text }: Props) {
  if (!text) return null;
  return (
    <div className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white/80">
      {text}
    </div>
  );
}

