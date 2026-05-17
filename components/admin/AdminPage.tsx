import type { ReactNode } from "react";

export function AdminPage({
  title,
  subtitle,
  actions,
  children
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-furni-primary/10 bg-white px-5 py-5 shadow-soft sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="covmerc-eyebrow">Operations</p>
            <h1 className="mt-2 font-display text-3xl text-furni-primary md:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-furni-muted">
              {subtitle}
            </p>
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
        </div>
      </header>
      <div className="space-y-6">{children}</div>
    </div>
  );
}
