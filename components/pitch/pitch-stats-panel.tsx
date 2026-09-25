"use client";

import type { PitchResultSet } from "@/lib/types";

export default function PitchStatsPanel({ pitch }: { pitch: PitchResultSet }) {
  const minutes = Math.floor(pitch.total_duration_seconds / 60);
  const seconds = pitch.total_duration_seconds % 60;

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md">
      <h2 className="font-display text-label-caps uppercase text-on-surface-variant">Pitch Stats</h2>

      <div className="grid grid-cols-2 gap-space-sm">
        <div className="flex flex-col gap-1 px-gutter py-space-sm rounded-2xl bg-surface-container-low">
          <span className="font-display text-label-caps uppercase text-on-surface-variant">Duration</span>
          <span className="font-display text-headline-sm text-on-surface">
            {minutes}m {seconds}s
          </span>
        </div>
        <div className="flex flex-col gap-1 px-gutter py-space-sm rounded-2xl bg-surface-container-low">
          <span className="font-display text-label-caps uppercase text-on-surface-variant">Slides</span>
          <span className="font-display text-headline-sm text-on-surface">{pitch.pitch_outline.length}</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest/90 rounded-2xl p-gutter shadow-lg border-t-4 border-primary">
        <p className="font-display text-headline-sm font-extrabold leading-snug text-on-surface">
          &ldquo;{pitch.opening_hook}&rdquo;
        </p>
      </div>

      <div className="bg-surface-container-lowest/90 rounded-2xl p-gutter shadow-lg border-t-4 border-secondary">
        <p className="font-display text-headline-sm font-extrabold leading-snug text-on-surface">
          &ldquo;{pitch.closing_line}&rdquo;
        </p>
      </div>

      {pitch.demo_flow.length > 0 && (
        <div>
          <h3 className="font-display text-label-caps uppercase text-on-surface-variant mb-space-xs">
            Demo Flow
          </h3>
          <ol className="list-decimal list-inside flex flex-col gap-1 font-body text-body-sm text-on-surface">
            {pitch.demo_flow.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
