"use client";

type ColorVar =
  | "--color-primary"
  | "--color-secondary"
  | "--color-tertiary"
  | "--color-primary-fixed-dim";

export default function ScoreBar({
  label,
  value,
  colorVar,
}: {
  label: string;
  value: number;
  colorVar: ColorVar;
}) {
  const pct = Math.max(0, Math.min(100, (value / 10) * 100));

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-label-caps uppercase text-on-surface-variant">{label}</span>
        <span className="font-display text-label-md text-on-surface">{value.toFixed(1)}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: `var(${colorVar})` }}
        />
      </div>
    </div>
  );
}
