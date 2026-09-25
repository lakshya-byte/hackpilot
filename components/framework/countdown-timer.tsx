"use client";

import type { WinFramework } from "@/lib/types";

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function CountdownTimer({ framework, now }: { framework: WinFramework; now: number }) {
  const phases = framework.phases;
  const firstStart = new Date(phases[0].start_time).getTime();
  const lastEnd = new Date(phases[phases.length - 1].end_time).getTime();

  if (now >= lastEnd) {
    return (
      <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center mb-gutter">
        <p className="font-display text-headline-sm text-on-surface">Hackathon complete</p>
        <p className="font-body text-body-sm text-on-surface-variant">All three phases have wrapped up.</p>
      </div>
    );
  }

  if (now < firstStart) {
    return (
      <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center mb-gutter">
        <p className="font-display text-label-caps uppercase text-on-surface-variant mb-space-xs">
          Starts in
        </p>
        <p className="font-display text-headline-lg text-on-surface tabular-nums">
          {formatDuration(firstStart - now)}
        </p>
      </div>
    );
  }

  const activePhase = phases.find(
    (p) => now >= new Date(p.start_time).getTime() && now < new Date(p.end_time).getTime()
  );
  if (!activePhase) {
    return null;
  }

  const remaining = new Date(activePhase.end_time).getTime() - now;

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] text-center mb-gutter">
      <p className="font-display text-label-caps uppercase text-on-surface-variant mb-space-xs">
        Time left in {activePhase.name}
      </p>
      <p className="font-display text-headline-lg text-on-surface tabular-nums">
        {formatDuration(remaining)}
      </p>
    </div>
  );
}
