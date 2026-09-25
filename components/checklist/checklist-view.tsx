"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Checklist } from "@/lib/types";
import PhaseProgressBar from "./phase-progress-bar";
import PhaseSection from "./phase-section";

export default function ChecklistView({
  hasTeam,
  hackathonId,
}: {
  hasTeam: boolean;
  hackathonId: string | null;
}) {
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [loading, setLoading] = useState(hasTeam && !!hackathonId);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hasTeam || !hackathonId) {
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/checklist/${encodeURIComponent(hackathonId)}`);
        const data = await res.json();
        if (res.ok) {
          setChecklist(data as Checklist);
        } else {
          setError(data.error ?? "Couldn't load the checklist.");
        }
      } catch {
        setError("Couldn't reach the server. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [hasTeam, hackathonId]);

  async function toggleItem(phaseId: string, itemId: string, checked: boolean) {
    if (!checklist || !hackathonId) {
      return;
    }

    const previous = checklist;
    setChecklist({
      ...checklist,
      phases: checklist.phases.map((p) =>
        p.phase_id !== phaseId
          ? p
          : { ...p, items: p.items.map((i) => (i.item_id === itemId ? { ...i, checked } : i)) }
      ),
    });
    setError("");

    try {
      const res = await fetch("/api/checklist/item", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackathon_id: hackathonId, phase_id: phaseId, item_id: itemId, checked }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Couldn't update the checklist.");
        setChecklist(previous);
        return;
      }
      setChecklist(data as Checklist);
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setChecklist(previous);
    }
  }

  if (!hasTeam) {
    return (
      <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] max-w-xl">
        <h2 className="font-display text-headline-sm text-on-surface mb-space-xs">
          Join or create a team first
        </h2>
        <p className="font-body text-body-md text-on-surface-variant mb-space-md">
          The Pre-Hack Checklist tracks your team&apos;s readiness, so you&apos;ll need an active team before
          using it.
        </p>
        <Link
          href="/teams"
          className="inline-flex px-gutter py-2.5 bg-primary text-on-primary font-display text-label-lg rounded-xl hover:bg-surface-tint transition-all"
        >
          Go to Teams
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="font-body text-body-sm text-on-surface-variant">Loading checklist…</p>;
  }

  if (error && !checklist) {
    return <p className="font-body text-body-sm text-error">{error}</p>;
  }

  if (!checklist) {
    return null;
  }

  return (
    <div>
      <div className="sticky top-0 z-10 mb-gutter rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <PhaseProgressBar label="Overall progress" value={checklist.progress} />
      </div>

      {error && <p className="mb-space-md font-body text-body-sm text-error">{error}</p>}

      {checklist.phases.map((phase) => (
        <PhaseSection
          key={phase.phase_id}
          phase={phase}
          onToggleItem={(itemId, checked) => toggleItem(phase.phase_id, itemId, checked)}
        />
      ))}
    </div>
  );
}
