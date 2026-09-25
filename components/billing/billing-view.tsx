"use client";

import { useEffect, useState } from "react";
import { usePlan } from "./plan-provider";
import { useUpgradeFlow } from "./use-upgrade-flow";
import ConfettiBurst from "@/components/shared/confetti-burst";
import type { PaymentRecord } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function formatAmount(paise: number, currency: string) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(paise / 100);
}

const STATUS_STYLES: Record<string, string> = {
  captured: "bg-secondary-container text-on-secondary-container",
  created: "bg-surface-container-high text-on-surface-variant",
  failed: "bg-error-container text-on-error-container",
};

export default function BillingView() {
  const { status: plan, isPro, loading: planLoading } = usePlan();
  const { startUpgrade, status: upgradeStatus, error } = useUpgradeFlow();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/history", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { payments: [] }))
      .then((data) => setPayments(data.payments ?? []))
      .catch(() => setPayments([]))
      .finally(() => setHistoryLoading(false));
  }, []);

  return (
    <div>
      {upgradeStatus === "success" && <ConfettiBurst />}

      <div className="mb-gutter">
        <h1 className="font-display text-headline-lg text-on-surface tracking-tight">Billing</h1>
        <p className="font-body text-body-md text-on-surface-variant">
          Manage your HackPilot plan and view past payments.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-[0_4px_20px_rgba(15,23,42,0.03)] mb-gutter">
        {planLoading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading plan…</p>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-space-sm mb-space-xs">
                <span className="font-display text-headline-sm text-on-surface uppercase">
                  {plan?.plan ?? "free"}
                </span>
                <span
                  className={`px-space-sm py-0.5 rounded-full font-display text-label-caps uppercase ${
                    isPro ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {isPro ? "Active" : "Free"}
                </span>
              </div>
              {isPro && plan?.expires_at ? (
                <p className="font-body text-body-sm text-on-surface-variant">
                  {plan.days_remaining} day{plan.days_remaining === 1 ? "" : "s"} remaining — expires{" "}
                  {formatDate(plan.expires_at)}
                </p>
              ) : (
                <p className="font-body text-body-sm text-on-surface-variant">
                  {plan?.idea_generations_used_this_month ?? 0} of {plan?.idea_generations_limit ?? 3} free idea
                  generations used this month
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={startUpgrade}
              disabled={upgradeStatus === "loading"}
              className="py-2.5 px-gutter bg-primary text-on-primary font-display text-label-lg rounded-xl shadow-[0_4px_16px_rgba(79,70,229,0.22)] hover:bg-surface-tint transition-all disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {upgradeStatus === "loading" ? "Opening checkout…" : isPro ? "Renew Pro" : "Upgrade to Pro"}
            </button>
          </div>
        )}
        {error && <p className="mt-space-sm font-body text-body-sm text-error">{error}</p>}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
        <h2 className="font-display text-headline-sm text-on-surface mb-space-md">Payment history</h2>

        {historyLoading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
        ) : payments.length === 0 ? (
          <p className="font-body text-body-sm text-on-surface-variant py-space-lg text-center">
            No payments yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="py-space-sm pr-space-md font-display text-label-md text-on-surface-variant">Date</th>
                  <th className="py-space-sm pr-space-md font-display text-label-md text-on-surface-variant">Amount</th>
                  <th className="py-space-sm pr-space-md font-display text-label-md text-on-surface-variant">Duration</th>
                  <th className="py-space-sm pr-space-md font-display text-label-md text-on-surface-variant">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-outline-variant/50 last:border-0">
                    <td className="py-space-sm pr-space-md font-body text-body-sm text-on-surface">
                      {formatDate(p.created_at)}
                    </td>
                    <td className="py-space-sm pr-space-md font-body text-body-sm text-on-surface">
                      {formatAmount(p.amount, p.currency)}
                    </td>
                    <td className="py-space-sm pr-space-md font-body text-body-sm text-on-surface">
                      {p.duration_days} days
                    </td>
                    <td className="py-space-sm pr-space-md">
                      <span
                        className={`px-space-sm py-0.5 rounded-full font-display text-label-caps uppercase ${
                          STATUS_STYLES[p.status] ?? "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
