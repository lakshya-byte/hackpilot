"use client";

import type { WinFramework } from "@/lib/types";

const PHASE_COLORS = ["bg-secondary", "bg-primary", "bg-tertiary"];

export default function TimelineBar({ framework, now }: { framework: WinFramework; now: number }) {
  const startMs = new Date(framework.start_time).getTime();
  const endMs = new Date(framework.end_time).getTime();
  const totalMs = endMs - startMs;
  const progressPct = Math.max(0, Math.min(100, ((now - startMs) / totalMs) * 100));

  return (
    <div className="relative h-3 rounded-full overflow-hidden flex bg-surface-container-high">
      {framework.phases.map((phase, i) => (
        <div
          key={phase.phase_id}
          className={PHASE_COLORS[i % PHASE_COLORS.length]}
          style={{ flexBasis: `${phase.percentage}%` }}
        />
      ))}
      <div
        className="absolute top-0 h-full w-0.5 bg-on-surface"
        style={{ left: `${progressPct}%` }}
      />
    </div>
  );
}
