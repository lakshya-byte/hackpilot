"use client";

import { useState } from "react";
import type { GenerateIdeasInput } from "@/lib/types";
import { HACKATHON_TYPES, TARGET_AUDIENCES } from "@/lib/hackathon-options";

const DURATIONS = ["12 hours", "24 hours", "36 hours", "48 hours", "1 week", "1 month"];

const selectClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all appearance-none";
const label = "font-display text-label-md text-on-surface font-semibold";

export default function IdeaForm({
  onSubmit,
  submitting,
  error,
}: {
  onSubmit: (input: GenerateIdeasInput) => void;
  submitting: boolean;
  error: string;
}) {
  const [hackathonType, setHackathonType] = useState(HACKATHON_TYPES[0]);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [targetAudience, setTargetAudience] = useState(TARGET_AUDIENCES[0]);
  const [problemStatement, setProblemStatement] = useState("");

  function handleSubmit() {
    onSubmit({
      hackathon_type: hackathonType,
      duration,
      target_audience: targetAudience,
      problem_statement: problemStatement.trim() || undefined,
    });
  }

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md max-w-2xl">
      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="hackathonType">
          Hackathon Type
        </label>
        <div className="relative">
          <select
            id="hackathonType"
            className={selectClass}
            value={hackathonType}
            onChange={(e) => setHackathonType(e.target.value)}
          >
            {HACKATHON_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="duration">
          Duration
        </label>
        <div className="relative">
          <select
            id="duration"
            className={selectClass}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="targetAudience">
          Target Audience
        </label>
        <div className="relative">
          <select
            id="targetAudience"
            className={selectClass}
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          >
            {TARGET_AUDIENCES.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">
            expand_more
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="problemStatement">
          Problem Statement <span className="font-normal text-on-surface-variant">(optional)</span>
        </label>
        <textarea
          id="problemStatement"
          className="w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all min-h-[96px] resize-none"
          value={problemStatement}
          onChange={(e) => setProblemStatement(e.target.value)}
          placeholder="Optional — describe a specific problem you want to solve"
        />
      </div>

      {error && <p className="text-error font-body text-body-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.24)] hover:bg-surface-tint transition-all disabled:opacity-60"
      >
        {submitting ? "Generating..." : "Generate Ideas"}
      </button>
    </div>
  );
}
