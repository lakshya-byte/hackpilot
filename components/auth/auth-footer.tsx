export default function AuthFooter() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.02)]">
      <div className="w-full max-w-[1440px] mx-auto px-gutter py-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="text-on-surface-variant font-body text-body-sm">
          © 2025 HackPilot Inc. All rights reserved.
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-gutter">
          <a
            className="font-body text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="font-body text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="font-body text-body-sm text-on-surface-variant hover:text-on-surface transition-colors"
            href="#"
          >
            Security
          </a>
        </nav>
      </div>
    </footer>
  );
}
