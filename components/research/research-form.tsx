"use client";

import { useState } from "react";
import type { ResearchIdeaInput } from "@/lib/types";
import { HACKATHON_TYPES, TARGET_AUDIENCES } from "@/lib/hackathon-options";

const selectClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all appearance-none";
const label = "font-display text-label-md text-on-surface font-semibold";

export default function ResearchForm({
  onSubmit,
  submitting,
  error,
}: {
  onSubmit: (input: ResearchIdeaInput) => void;
  submitting: boolean;
  error: string;
}) {
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaDescription, setIdeaDescription] = useState("");
  const [hackathonType, setHackathonType] = useState(HACKATHON_TYPES[0]);
  const [targetAudience, setTargetAudience] = useState(TARGET_AUDIENCES[0]);
  const [validationError, setValidationError] = useState("");

  function handleSubmit() {
    if (!ideaTitle.trim() || !ideaDescription.trim()) {
      setValidationError("Idea title and description are both required.");
      return;
    }
    setValidationError("");
    onSubmit({
      idea_title: ideaTitle.trim(),
      idea_description: ideaDescription.trim(),
      hackathon_type: hackathonType,
      target_audience: targetAudience,
    });
  }

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md max-w-2xl">
      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="ideaTitle">
          Idea Title
        </label>
        <input
          id="ideaTitle"
          type="text"
          className="w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all"
          value={ideaTitle}
          onChange={(e) => setIdeaTitle(e.target.value)}
          maxLength={120}
          placeholder="e.g. CampusPlate — dorm food-waste marketplace"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="ideaDescription">
          Idea Description
        </label>
        <textarea
          id="ideaDescription"
          className="w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all min-h-[96px] resize-none"
          value={ideaDescription}
          onChange={(e) => setIdeaDescription(e.target.value)}
          placeholder="Describe what the idea does and who it's for"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="researchHackathonType">
          Hackathon Type
        </label>
        <div className="relative">
          <select
            id="researchHackathonType"
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
        <label className={label} htmlFor="researchTargetAudience">
          Target Audience
        </label>
        <div className="relative">
          <select
            id="researchTargetAudience"
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

      {(validationError || error) && (
        <p className="text-error font-body text-body-sm">{validationError || error}</p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.24)] hover:bg-surface-tint transition-all disabled:opacity-60"
      >
        {submitting ? "Researching..." : "Research This Idea"}
      </button>
    </div>
  );
}
