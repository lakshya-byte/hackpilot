"use client";

import { useState } from "react";
import type { GeneratePitchInput, RubricCriterion } from "@/lib/types";
import { HACKATHON_TYPES, TARGET_AUDIENCES } from "@/lib/hackathon-options";
import { DEFAULT_RUBRIC_CRITERIA } from "@/lib/rubric-options";
import RubricUpload from "./rubric-upload";
import RubricCriteriaEditor from "./rubric-criteria-editor";

const inputClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all";
const selectClass =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all appearance-none";
const label = "font-display text-label-md text-on-surface font-semibold";

export default function PitchForm({
  initialIdeaTitle,
  initialIdeaDescription,
  researchNote,
  onSubmit,
  submitting,
  error,
}: {
  initialIdeaTitle: string;
  initialIdeaDescription: string;
  researchNote: string;
  onSubmit: (input: GeneratePitchInput) => void;
  submitting: boolean;
  error: string;
}) {
  const [ideaTitle, setIdeaTitle] = useState(initialIdeaTitle);
  const [ideaDescription, setIdeaDescription] = useState(initialIdeaDescription);
  const [hackathonType, setHackathonType] = useState(HACKATHON_TYPES[0]);
  const [targetAudience, setTargetAudience] = useState(TARGET_AUDIENCES[0]);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>(DEFAULT_RUBRIC_CRITERIA);

  function handleSubmit() {
    onSubmit({
      idea_title: ideaTitle,
      idea_description: ideaDescription,
      hackathon_type: hackathonType,
      target_audience: targetAudience,
      rubric_criteria: rubricCriteria,
    });
  }

  return (
    <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col gap-space-md max-w-3xl">
      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="ideaTitle">
          Idea Title
        </label>
        <input
          id="ideaTitle"
          type="text"
          className={inputClass}
          value={ideaTitle}
          onChange={(e) => setIdeaTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={label} htmlFor="ideaDescription">
          Idea Description
        </label>
        <textarea
          id="ideaDescription"
          className={`${inputClass} min-h-[80px] resize-none`}
          value={ideaDescription}
          onChange={(e) => setIdeaDescription(e.target.value)}
        />
      </div>

      {researchNote && (
        <p className="font-body text-body-sm text-on-surface-variant italic">{researchNote}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
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
      </div>

      <div className="flex flex-col gap-space-sm">
        <label className={label}>Judging Rubric</label>
        <RubricUpload onParsed={setRubricCriteria} />
        <RubricCriteriaEditor criteria={rubricCriteria} onChange={setRubricCriteria} />
      </div>

      {error && <p className="text-error font-body text-body-sm">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.24)] hover:bg-surface-tint transition-all disabled:opacity-60"
      >
        {submitting ? "Generating..." : "Generate Pitch"}
      </button>
    </div>
  );
}
