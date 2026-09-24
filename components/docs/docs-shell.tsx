"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import DocsSidebar from "./docs-sidebar";

export default function DocsShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <header className="sticky top-0 z-50 h-16 border-b border-outline-variant bg-surface-container-lowest">
        <div className="h-full max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle navigation"
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-on-surface">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
            <Link href="/" className="flex items-center gap-space-sm">
              <Image
                src="/logo.png"
                alt="HackPilot"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-display text-headline-sm text-on-surface tracking-tight">
                HackPilot
              </span>
            </Link>
            <span className="hidden sm:inline-flex px-space-sm py-space-xs rounded-full bg-surface-variant text-on-primary-fixed-variant font-display text-label-caps">
              Docs
            </span>
          </div>

          <Link
            href="/"
            className="font-display text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-margin flex gap-gutter">
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 shrink-0 border-r border-outline-variant lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto py-gutter`}
        >
          <DocsSidebar />
        </aside>

        <main className="min-w-0 flex-1 py-gutter pb-space-xl">
          <div className="max-w-3xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
