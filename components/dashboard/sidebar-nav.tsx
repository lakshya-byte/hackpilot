"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Overview", icon: "dashboard" },
  { label: "Idea Engine", href: "/ideas", icon: "lightbulb" },
  { label: "Research Engine", href: "/research", icon: "travel_explore" },
  { label: "Checklist", href: "/checklist", icon: "checklist" },
  { label: "Win Framework", href: "/framework", icon: "flag" },
  { label: "Pitch Builder", href: "/pitch", icon: "co_present" },
  { label: "Jury Defense", icon: "gavel" },
  { label: "Teams", href: "/teams", icon: "groups" },
  { label: "History & Submissions", icon: "history" },
  { label: "Billing", href: "/billing", icon: "credit_card" },
  { label: "Profile", href: "/profile", icon: "person" },
  { label: "Settings", icon: "settings" },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <ul className="space-y-space-xs">
        {navItems.map((item) => {
          const active = item.href && pathname === item.href;
          if (!item.href) {
            return (
              <li key={item.label}>
                <div className="flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl text-on-surface-variant/50 cursor-not-allowed">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  <span className="font-display text-label-lg flex-1">{item.label}</span>
                  <span className="px-space-xs py-0.5 rounded-full bg-surface-container text-outline font-display text-label-caps uppercase">
                    Soon
                  </span>
                </div>
              </li>
            );
          }
          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl font-display text-label-lg transition-colors ${
                  active
                    ? "bg-primary-fixed text-on-primary-fixed-variant"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-colors disabled:opacity-60"
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        <span className="font-display text-label-lg">
          {loggingOut ? "Logging out…" : "Log out"}
        </span>
      </button>
    </div>
  );
}
