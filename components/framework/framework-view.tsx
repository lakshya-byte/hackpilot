"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CreateFrameworkInput, WinFramework } from "@/lib/types";
import SetupForm from "./setup-form";
import CountdownTimer from "./countdown-timer";
import TimelineBar from "./timeline-bar";
import PhaseCard from "./phase-card";
import type { PhaseStatus } from "./status-pill";

export default function FrameworkView({
  hasTeam,
  teamId,
}: {
  hasTeam: boolean;
  teamId: string | null;
}) {
  const [framework, setFramework] = useState<WinFramework | null>(null);
  const [loading, setLoading] = useState(hasTeam && !!teamId);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!hasTeam || !teamId) {
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/framework/${teamId}`);
        if (res.ok) {
          setFramework(await res.json());
        } else if (res.status !== 404) {
          const data = await res.json().catch(() => ({}));
          setFormError(data.error ?? "Couldn't load the win framework.");
        }
      } catch {
        setFormError("Couldn't reach the server. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [hasTeam, teamId]);

  useEffect(() => {
    if (!framework) {
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [framework]);

  async function handleCreate(input: CreateFrameworkInput) {
    setSubmitting(true);
    setFormError("");
    try {
      const res = await fetch("/api/framework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error ?? "Couldn't create the win framework.");
        return;
      }
      setNow(Date.now());
      setFramework(data as WinFramework);
    } catch {
      setFormError("Couldn't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset() {
    if (!framework) {
      return;
    }
    try {
      const res = await fetch(`/api/framework/${framework.id}`, { method: "DELETE" });
      if (res.ok) {
        setFramework(null);
      }
    } catch {
      setFormError("Couldn't reach the server. Please try again.");
    }
  }

  if (!hasTeam) {
    return (
      <div className="rounded-3xl p-gutter bg-surface-container-lowest shadow-[0_4px_20px_rgba(15,23,42,0.03)] max-w-xl">
        <h2 className="font-display text-headline-sm text-on-surface mb-space-xs">
          Join or create a team first
        </h2>
        <p className="font-body text-body-md text-on-surface-variant mb-space-md">
          The Win Framework budgets your team&apos;s hackathon hours, so you&apos;ll need an active team
          before setting one up.
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
    return <p className="font-body text-body-sm text-on-surface-variant">Loading win framework…</p>;
  }

  if (!framework) {
    return <SetupForm onSubmit={handleCreate} submitting={submitting} error={formError} />;
  }

  function phaseStatus(index: number): PhaseStatus {
    const phase = framework!.phases[index];
    const start = new Date(phase.start_time).getTime();
    const end = new Date(phase.end_time).getTime();
    if (now >= end) return "completed";
    if (now >= start) return "active";
    return "upcoming";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-gutter">
        <div>
          <h2 className="font-display text-headline-sm text-on-surface">{framework.hackathon_name}</h2>
          <p className="font-body text-body-sm text-on-surface-variant">
            {framework.duration_hours} hours · starting {new Date(framework.start_time).toLocaleString()}
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-gutter py-2 rounded-xl border border-outline-variant text-on-surface font-display text-label-md hover:bg-surface-container-low transition-colors"
        >
          Reset
        </button>
      </div>

      {formError && <p className="mb-space-md text-error font-body text-body-sm">{formError}</p>}

      <CountdownTimer framework={framework} now={now} />

      <div className="mb-gutter">
        <TimelineBar framework={framework} now={now} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {framework.phases.map((phase, i) => (
          <PhaseCard
            key={phase.phase_id}
            phase={phase}
            status={phaseStatus(i)}
            totalDurationHours={framework.duration_hours}
          />
        ))}
      </div>
    </div>
  );
}
