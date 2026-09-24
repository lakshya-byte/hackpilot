"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SidebarNav from "./sidebar-nav";

export default function DashboardShell({ children }: { children: ReactNode }) {
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
          </div>

          <div className="flex items-center gap-space-sm text-on-surface-variant">
            <button
              type="button"
              aria-label="Search (coming soon)"
              disabled
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container-low disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <button
              type="button"
              aria-label="Notifications (coming soon)"
              disabled
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container-low disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-margin flex gap-gutter">
        <aside
          className={`${
            mobileOpen ? "block" : "hidden"
          } lg:block w-full lg:w-64 shrink-0 border-r border-outline-variant lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] py-gutter`}
        >
          <SidebarNav />
        </aside>

        <main className="min-w-0 flex-1 py-gutter pb-space-xl">{children}</main>
      </div>
    </div>
  );
}
