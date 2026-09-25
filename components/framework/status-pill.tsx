"use client";

export type PhaseStatus = "upcoming" | "active" | "completed";

export default function StatusPill({ status }: { status: PhaseStatus }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container/40 text-secondary font-display text-label-caps font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
        Active
      </span>
    );
  }

  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-display text-label-caps uppercase">
        <span className="material-symbols-outlined text-[14px]">check_circle</span>
        Completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-display text-label-caps uppercase">
      Upcoming
    </span>
  );
}
