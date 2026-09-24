import { ReactNode } from "react";

export function DocHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-space-xl pb-gutter border-b border-outline-variant">
      <span className="font-display text-label-caps text-primary uppercase">
        {eyebrow}
      </span>
      <h1 className="mt-space-sm font-display text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
        {title}
      </h1>
      <p className="mt-space-sm font-body text-body-lg text-on-surface-variant max-w-2xl">
        {description}
      </p>
    </div>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-space-xl scroll-mt-24">
      <h2 className="font-display text-headline-md text-on-surface tracking-tight">
        {title}
      </h2>
      <div className="mt-space-md font-body text-body-lg text-on-surface-variant space-y-space-md [&>p]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}

export function SubSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-space-lg">
      <h3 className="font-display text-headline-sm text-on-surface">
        {title}
      </h3>
      <div className="mt-space-sm font-body text-body-lg text-on-surface-variant space-y-space-md">
        {children}
      </div>
    </div>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="leading-relaxed">{children}</p>;
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: "info" | "warn" | "success";
  title: string;
  children: ReactNode;
}) {
  const styles = {
    info: {
      wrap: "bg-primary-fixed/40 border-primary-fixed-dim",
      icon: "text-primary",
      iconName: "info",
    },
    warn: {
      wrap: "bg-error-container/50 border-error/30",
      icon: "text-error",
      iconName: "warning",
    },
    success: {
      wrap: "bg-secondary-fixed/30 border-secondary-fixed-dim",
      icon: "text-secondary",
      iconName: "check_circle",
    },
  }[type];

  return (
    <div
      className={`flex gap-space-sm rounded-2xl border ${styles.wrap} px-gutter py-space-md`}
    >
      <span
        className={`material-symbols-outlined ${styles.icon} text-[20px] mt-0.5 shrink-0`}
      >
        {styles.iconName}
      </span>
      <div className="font-body text-body-md text-on-surface">
        <p className="font-display text-label-lg text-on-surface mb-space-xs">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}

export function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-outline-variant bg-inverse-surface">
      {filename && (
        <div className="flex items-center justify-between px-gutter py-space-sm border-b border-white/10">
          <span className="font-mono text-body-sm text-inverse-on-surface/70">
            {filename}
          </span>
          {language && (
            <span className="font-display text-label-caps text-inverse-on-surface/50 uppercase">
              {language}
            </span>
          )}
        </div>
      )}
      <pre className="px-gutter py-space-md overflow-x-auto">
        <code className="font-mono text-body-sm text-inverse-on-surface leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-surface-container-high font-mono text-body-sm text-on-surface">
      {children}
    </code>
  );
}

export function Table({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="rounded-2xl border border-outline-variant overflow-hidden overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-surface-container-low">
            {head.map((h) => (
              <th
                key={h}
                className="px-gutter py-space-sm font-display text-label-md text-on-surface-variant uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-outline-variant even:bg-surface-container-lowest odd:bg-surface"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-gutter py-space-sm font-body text-body-md text-on-surface align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MethodBadge({
  method,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}) {
  const colors: Record<string, string> = {
    GET: "bg-secondary-fixed text-on-secondary-fixed",
    POST: "bg-primary-fixed text-on-primary-fixed",
    PUT: "bg-tertiary-fixed text-on-tertiary-fixed",
    PATCH: "bg-tertiary-fixed text-on-tertiary-fixed",
    DELETE: "bg-error-container text-on-error-container",
  };
  return (
    <span
      className={`inline-flex px-space-sm py-space-xs rounded-md font-display text-label-caps ${colors[method]}`}
    >
      {method}
    </span>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid sm:grid-cols-2 gap-gutter">{children}</div>
  );
}

export function Card({
  icon,
  title,
  children,
}: {
  icon?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-gutter">
      {icon && (
        <span className="material-symbols-outlined text-primary text-[22px]">
          {icon}
        </span>
      )}
      <p className="mt-space-sm font-display text-label-lg text-on-surface">
        {title}
      </p>
      <div className="mt-space-xs font-body text-body-md text-on-surface-variant leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function FlowBox({
  title,
  subtitle,
  tone = "default",
}: {
  title: string;
  subtitle?: string;
  tone?: "default" | "primary" | "outline";
}) {
  const tones = {
    default: "bg-surface-container-lowest border-outline-variant",
    primary: "bg-primary-fixed border-primary-fixed-dim",
    outline: "bg-surface border-outline-variant border-dashed",
  }[tone];
  return (
    <div
      className={`rounded-2xl border px-gutter py-space-md text-center shrink-0 ${tones}`}
    >
      <p className="font-display text-label-lg text-on-surface whitespace-nowrap">
        {title}
      </p>
      {subtitle && (
        <p className="mt-space-xs font-body text-body-sm text-on-surface-variant whitespace-nowrap">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Arrow({
  label,
  vertical = false,
}: {
  label?: string;
  vertical?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center text-on-surface-variant shrink-0 ${
        vertical ? "flex-col py-space-xs" : "px-space-xs"
      }`}
    >
      {label && (
        <span className="font-mono text-body-sm px-space-xs whitespace-nowrap">
          {label}
        </span>
      )}
      <span className="material-symbols-outlined text-[20px]">
        {vertical ? "arrow_downward" : "arrow_forward"}
      </span>
    </div>
  );
}

export function DocFooterNav({
  prev,
  next,
}: {
  prev?: { title: string; href: string };
  next?: { title: string; href: string };
}) {
  return (
    <div className="mt-space-xl pt-gutter border-t border-outline-variant flex items-center justify-between gap-space-md">
      {prev ? (
        <a
          href={prev.href}
          className="group flex items-center gap-space-xs px-gutter py-space-sm rounded-xl border border-outline-variant hover:border-primary transition-colors"
        >
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary">
            arrow_back
          </span>
          <span className="font-display text-label-lg text-on-surface">
            {prev.title}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a
          href={next.href}
          className="group flex items-center gap-space-xs px-gutter py-space-sm rounded-xl border border-outline-variant hover:border-primary transition-colors ml-auto"
        >
          <span className="font-display text-label-lg text-on-surface">
            {next.title}
          </span>
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] group-hover:text-primary">
            arrow_forward
          </span>
        </a>
      ) : (
        <span />
      )}
    </div>
  );
}
