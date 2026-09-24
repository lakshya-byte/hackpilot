import Image from "next/image";

const navLinks = [
  { label: "Framework", href: "#framework", active: true },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Hall of Fame", href: "#hall-of-fame" },
  { label: "Pricing", href: "#pricing" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-sm">
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
          <span className="px-space-sm py-space-xs rounded-full bg-surface-variant text-on-primary-fixed-variant font-display text-label-caps">
            For Hackers
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-space-lg">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={
                link.active
                  ? "px-space-sm py-space-xs transition-colors bg-surface-container text-on-surface font-display text-label-lg rounded-xl"
                  : "px-space-sm py-space-xs font-display text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-space-md">
          <a
            href="/sign-in"
            className="hidden sm:inline-flex font-display text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Log in
          </a>
          <a
            href="#early-access"
            className="px-gutter py-space-sm rounded-xl bg-primary-container text-on-primary font-display text-label-lg hover:bg-primary transition-colors shadow-[0_2px_6px_rgba(79,70,229,0.2)]"
          >
            Get Early Access
          </a>
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
