"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Sign In", href: "/sign-in" },
  { label: "Register", href: "/sign-up" },
  { label: "Reset Password", href: "/forgot-password" },
];

export default function AuthHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full max-w-[1440px] mx-auto px-gutter flex items-center justify-between">
        <Link href="/" className="flex items-center gap-space-sm">
          <Image
            src="/logo.png"
            alt="HackPilot Brand Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
            priority
          />
          <span className="font-display text-headline-sm text-on-surface tracking-tight">
            HackPilot
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-gutter">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={
                pathname === link.href
                  ? "transition-colors text-primary font-display text-label-lg"
                  : "font-display text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-gutter">
          <Link
            href="/"
            className="hidden sm:inline-flex items-center font-display text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Back to website
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
