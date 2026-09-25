"use client";

import { useState } from "react";
import type { CreateFrameworkInput } from "@/lib/types";

const DURATION_OPTIONS = [12, 24, 36, 48, 72];

const inputClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all";
const selectClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all appearance-none";
const label = "font-display text-label-md text-on-surface font-semibold";

export default function SetupForm({
  onSubmit,
  submitting,
  error,
}: {
  onSubmit: (input: CreateFrameworkInput) => void;
  submitting: boolean;
  error: string;
}) {
  const [hackathonName, setHackathonName] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [durationHours, setDurationHours] = useState(DURATION_OPTIONS[1]);

  function handleSubmit() {
    if (!hackathonName.trim() || !startLocal) {
      return;
    }
    onSubmit({
      hackathon_name: hackathonName.trim(),
      start_time: new Date(startLocal).toISOString(),
      duration_hours: durationHours,
    });
  }

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md max-w-2xl">
      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="hackathonName">
          Hackathon Name
        </label>
        <input
          id="hackathonName"
          type="text"
          className={inputClass}
          value={hackathonName}
          onChange={(e) => setHackathonName(e.target.value)}
          placeholder="e.g. Smart India Hackathon 2026"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="startTime">
          Start Date &amp; Time
        </label>
        <input
          id="startTime"
          type="datetime-local"
          className={inputClass}
          value={startLocal}
          onChange={(e) => setStartLocal(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="durationHours">
          Total Duration
        </label>
        <div className="relative">
          <select
            id="durationHours"
            className={selectClass}
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
          >
            {DURATION_OPTIONS.map((h) => (
              <option key={h} value={h}>
                {h} hours
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      {error && <p className="text-error font-body text-body-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.24)] hover:bg-surface-tint transition-all disabled:opacity-60"
      >
        {submitting ? "Starting..." : "Start the Clock"}
      </button>
    </div>
  );
}
