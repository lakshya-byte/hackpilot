"use client";

export default function PhaseProgressBar({ label, value }: { label: string; value: number }) {
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-label-caps uppercase text-on-surface-variant">{label}</span>
        <span className="font-display text-label-md text-on-surface">{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
