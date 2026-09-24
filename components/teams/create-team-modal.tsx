"use client";

import { useState } from "react";
import type { Team } from "@/lib/types";

export default function CreateTeamModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (team: Team) => void;
}) {
  const [name, setName] = useState("");
  const [hackathon, setHackathon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim() || !hackathon.trim()) {
      setError("Team name and hackathon are both required.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), hackathon: hackathon.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Couldn't create the team.");
        setSubmitting(false);
        return;
      }

      onCreated(data);
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  const input =
    "w-full bg-surface-container-low text-on-surface font-body text-body-md rounded-xl px-space-md py-2.5 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)] focus:bg-surface-container-lowest focus:outline-none focus:shadow-[0_0_0_2px_var(--color-primary)] transition-all";
  const label = "font-display text-label-md text-on-surface font-semibold";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-space-md">
      <div className="relative w-full max-w-[520px] bg-surface-container-lowest rounded-2xl shadow-[0_24px_48px_-12px_rgba(15,23,42,0.18)] overflow-hidden flex flex-col">
        <div className="px-gutter pt-gutter pb-space-md flex items-start justify-between">
          <div className="flex items-start gap-space-sm">
            <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-[22px]">rocket_launch</span>
            </div>
            <div>
              <h2 className="font-display text-headline-sm text-on-surface">Create a Team</h2>
              <p className="font-body text-body-sm text-on-surface-variant mt-0.5">
                Set up your squad and lock in your hackathon.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-gutter py-space-sm flex flex-col gap-space-md">
          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="teamNameInput">
              Team Name
            </label>
            <input
              id="teamNameInput"
              className={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              placeholder="e.g. ByteForce Sentinel"
              type="text"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={label} htmlFor="hackathonInput">
              Hackathon
            </label>
            <input
              id="hackathonInput"
              className={input}
              value={hackathon}
              onChange={(e) => setHackathon(e.target.value)}
              maxLength={120}
              placeholder="e.g. Smart India Hackathon 2025"
              type="text"
            />
          </div>

          {error && <p className="text-error font-body text-body-sm">{error}</p>}
        </div>

        <div className="px-gutter py-space-md bg-surface-container-low/60 flex items-center justify-end gap-space-sm mt-space-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-gutter py-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-display text-label-md transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.24)] hover:bg-surface-tint transition-all flex items-center gap-2 disabled:opacity-60"
          >
            <span>{submitting ? "Creating…" : "Create Team"}</span>
            {!submitting && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
