"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "./docs-nav";

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="space-y-space-lg">
      {docsNav.map((group) => (
        <div key={group.label}>
          <p className="px-space-sm font-display text-label-caps text-outline uppercase mb-space-xs">
            {group.label}
          </p>
          <ul className="space-y-space-xs">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl font-display text-label-lg transition-colors ${
                      active
                        ? "bg-primary-fixed text-on-primary-fixed-variant"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
