const linkColumns = [
  {
    title: "Product",
    links: [
      "Idea Engine",
      "Novelty Scanner",
      "Pitch Deck Builder",
      "Jury Defense Matrix",
      "API Sandbox Verifier",
    ],
  },
  {
    title: "Frameworks",
    links: [
      "SIH 36-Hr Playbook",
      "Devfolio Web3 Kit",
      "Hardware Pinout Audit",
      "Ministry PPT Templates",
      "Hall of Fame Winning Decks",
    ],
  },
  {
    title: "Company",
    links: [
      "About Founders",
      "Campus Ambassadors",
      "Discord Community",
      "Privacy Policy",
      "Contact Support",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest pt-20 pb-12 border-t border-surface-container">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-gutter mb-16">
          <div className="col-span-2">
            <div className="flex items-center gap-space-xs mb-space-sm">
              <span className="w-7 h-7 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center text-sm">
                H
              </span>
              <span className="font-display text-headline-sm font-bold text-on-surface">
                HackPilot
              </span>
            </div>
            <p className="font-body text-body-md text-on-surface-variant max-w-sm mb-space-md">
              The competitive hackathon intelligence platform engineered for
              ambitious student developers and championship squads across
              India.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
              <span className="font-display text-label-md text-on-surface-variant">
                All Systems Operational • SIH 2025 Track Active
              </span>
            </div>
          </div>

          {linkColumns.map((column) => (
            <div key={column.title}>
              <h4 className="font-display text-label-caps uppercase tracking-wider text-on-surface font-extrabold mb-space-md">
                {column.title}
              </h4>
              <ul className="space-y-space-sm font-body text-body-sm text-on-surface-variant">
                {column.links.map((link) => (
                  <li key={link}>
                    <a className="hover:text-primary transition-colors" href="#">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <p className="font-body text-body-sm text-on-surface-variant">
            © 2025 HackPilot Inc. Crafted with discipline for student
            builders across India. All rights reserved.
          </p>
          <div className="flex items-center gap-space-md text-on-surface-variant font-display text-label-md">
            <a className="hover:text-on-surface" href="#">
              Terms
            </a>
            <span>•</span>
            <a className="hover:text-on-surface" href="#">
              Security
            </a>
            <span>•</span>
            <a className="hover:text-on-surface" href="#">
              SIH Guidelines
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
