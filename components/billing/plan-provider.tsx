"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { BillingStatus } from "@/lib/types";

interface PlanContextValue {
  status: BillingStatus | null;
  isPro: boolean;
  loading: boolean;
  refresh: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

// Mounted once around the whole dashboard shell so every gated page and the
// idea-usage counter share a single /api/billing/status fetch instead of
// each re-fetching independently.
export default function PlanProvider({ children }: { children: React.ReactNode }) {
  // loading starts true (we're about to fetch on mount below) so the
  // initial-load effect doesn't need to synchronously set it itself.
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(() => {
    return fetch("/api/billing/status", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<BillingStatus>) : null))
      .then((data) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchStatus();
  }, [fetchStatus]);

  return (
    <PlanContext.Provider value={{ status, isPro: status?.plan === "pro", loading, refresh }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) {
    throw new Error("usePlan must be used within a PlanProvider");
  }
  return ctx;
}
