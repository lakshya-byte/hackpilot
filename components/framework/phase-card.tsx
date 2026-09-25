"use client";

import type { FrameworkPhase } from "@/lib/types";
import StatusPill, { type PhaseStatus } from "./status-pill";

export default function PhaseCard({
  phase,
  status,
  totalDurationHours,
}: {
  phase: FrameworkPhase;
  status: PhaseStatus;
  totalDurationHours: number;
}) {
  const durationHours = ((phase.percentage / 100) * totalDurationHours).toFixed(1);

  return (
    <div
      className={`rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all ${
        status === "active" ? "border-2 border-primary" : "border-2 border-transparent"
      } ${status === "completed" ? "opacity-60" : ""}`}
      style={
        status === "active"
          ? { boxShadow: "0 0 32px color-mix(in srgb, var(--color-primary) 40%, transparent)" }
          : undefined
      }
    >
      <div className="flex items-center justify-between mb-space-xs">
        <h3 className="font-display text-headline-sm text-on-surface">{phase.name}</h3>
        <StatusPill status={status} />
      </div>

      <p className="font-display text-label-md text-on-surface-variant mb-space-sm">
        {phase.percentage}% of total time · {durationHours}h
      </p>

      <p className="font-body text-body-sm text-on-surface-variant mb-space-md">
        {new Date(phase.start_time).toLocaleString()} — {new Date(phase.end_time).toLocaleString()}
      </p>

      <ul className="flex flex-col gap-1.5">
        {phase.tasks.map((task, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-body-sm text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant mt-0.5">
              radio_button_unchecked
            </span>
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}
