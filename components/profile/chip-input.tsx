"use client";

import { useState, KeyboardEvent } from "react";

export default function ChipInput({
  values,
  onChange,
  placeholder,
  editable,
  emptyLabel,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  editable: boolean;
  emptyLabel: string;
}) {
  const [draft, setDraft] = useState("");

  function addChip() {
    const trimmed = draft.trim();
    if (!trimmed || values.includes(trimmed)) {
      setDraft("");
      return;
    }
    onChange([...values, trimmed]);
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip();
    }
  }

  if (!editable) {
    if (values.length === 0) {
      return <p className="text-on-surface-variant/70 italic">{emptyLabel}</p>;
    }
    return (
      <div className="flex flex-wrap gap-space-xs">
        {values.map((v) => (
          <span
            key={v}
            className="px-space-sm py-space-xs rounded-full bg-surface-container-low text-on-surface font-display text-label-md"
          >
            {v}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-space-xs mb-space-xs">
        {values.map((v) => (
          <span
            key={v}
            className="flex items-center gap-space-xs px-space-sm py-space-xs rounded-full bg-primary-fixed text-on-primary-fixed-variant font-display text-label-md"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              aria-label={`Remove ${v}`}
              className="hover:text-error"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addChip}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-surface-container-low rounded-xl text-on-surface font-body text-body-sm placeholder:text-outline/70 focus:outline-none focus:shadow-[0_0_0_2px] focus:shadow-primary transition-all"
      />
    </div>
  );
}
