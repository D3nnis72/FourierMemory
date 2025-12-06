type Props = {
  showOverlay: boolean;
  onToggleOverlay: () => void;
};

export function LearnOverlayControls({ showOverlay, onToggleOverlay }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={showOverlay} onChange={onToggleOverlay} />
        Show overlays
      </label>
    </div>
  );
}

