"use client";

export default function ViabilityScoreBadge({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, (score / 10) * 100));

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col items-center justify-center gap-space-sm">
      <span className="font-display text-label-caps uppercase text-on-surface-variant">Viability</span>
      <div
        className="relative w-24 h-24 rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(var(--color-primary) ${pct}%, var(--color-surface-container-high) 0)`,
        }}
      >
        <div className="absolute inset-2 rounded-full bg-surface-container-lowest flex items-center justify-center">
          <span className="font-display text-headline-md text-on-surface">{score.toFixed(1)}</span>
        </div>
      </div>
      <span className="font-body text-body-sm text-on-surface-variant">out of 10</span>
    </div>
  );
}
