"use client";

import Link from "next/link";
import { usePlan } from "./plan-provider";

// Wraps a Pro-only feature. While plan status is loading we render the
// feature as-is rather than flashing a locked state first — the backend
// enforces the real gate on every request regardless, this is UX only.
export default function ProGate({ children }: { children: React.ReactNode }) {
  const { isPro, loading } = usePlan();

  if (isPro || loading) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-40" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-space-lg">
        <div className="flex flex-col items-center text-center max-w-sm bg-surface-container-lowest rounded-3xl p-space-xl shadow-[0_8px_32px_-4px_rgba(19,27,46,0.18)]">
          <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary-container mb-space-md shadow-sm">
            <span className="material-symbols-outlined text-[28px]">lock</span>
          </div>
          <h2 className="font-display text-headline-sm text-on-surface mb-space-xs">Pro feature</h2>
          <p className="font-body text-body-md text-on-surface-variant mb-space-lg leading-relaxed">
            Upgrade to Pro to unlock this tool for your team.
          </p>
          <Link
            href="/pricing"
            className="w-full py-3 px-gutter bg-primary text-on-primary font-display text-label-lg rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(79,70,229,0.22)] hover:bg-surface-tint transition-all"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
}
