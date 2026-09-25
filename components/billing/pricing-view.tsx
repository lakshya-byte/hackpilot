"use client";

import { usePlan } from "./plan-provider";
import { useUpgradeFlow } from "./use-upgrade-flow";
import ConfettiBurst from "@/components/shared/confetti-burst";

const PRO_FEATURES = [
  "Unlimited Idea Engine generations",
  "Research Engine — market gap & positioning analysis",
  "Pitch Builder — rubric-aligned pitch decks",
  "Everything in Free: Checklist, Win Framework, Teams",
];

export default function PricingView() {
  const { status: planStatus, isPro } = usePlan();
  const { startUpgrade, status, error } = useUpgradeFlow();

  return (
    <div className="max-w-lg mx-auto py-space-xl">
      {status === "success" && <ConfettiBurst />}

      <div className="text-center mb-space-xl">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight mb-space-sm">
          Upgrade to Pro
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant">
          One plan. Everything HackPilot has to offer.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-space-xl shadow-[0_8px_32px_-4px_rgba(19,27,46,0.1)]">
        <div className="flex items-baseline justify-between mb-space-md">
          <h2 className="font-display text-headline-md text-on-surface">Pro</h2>
          <div className="text-right">
            <span className="font-display text-headline-lg text-on-surface">₹199</span>
            <span className="font-body text-body-sm text-on-surface-variant"> / 30 days</span>
          </div>
        </div>

        <ul className="space-y-space-sm mb-space-xl">
          {PRO_FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-[18px] text-secondary mt-0.5">check_circle</span>
              <span className="font-body text-body-md text-on-surface">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={startUpgrade}
          disabled={status === "loading" || isPro}
          className="w-full py-3.5 px-gutter bg-primary text-on-primary font-display text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(79,70,229,0.22)] hover:bg-surface-tint transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPro ? "You're already Pro" : status === "loading" ? "Opening checkout…" : "Upgrade to Pro"}
        </button>

        {error && (
          <p className="mt-space-sm font-body text-body-sm text-error text-center">{error}</p>
        )}
      </div>

      <div className="mt-space-lg text-center">
        {planStatus && (
          <p className="font-body text-body-sm text-on-surface-variant">
            Current plan:{" "}
            <span className="font-display text-label-md text-on-surface uppercase">{planStatus.plan}</span>
            {isPro && planStatus.days_remaining > 0 && (
              <> — {planStatus.days_remaining} day{planStatus.days_remaining === 1 ? "" : "s"} remaining</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
