import type { ReactNode } from "react";

export function AdminPage({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <>
      <header>
        <p className="covmerc-eyebrow">Operations</p>
        <h1 className="mt-2 font-display text-3xl text-furni-primary">{title}</h1>
        <p className="mt-1 text-sm text-furni-muted">{subtitle}</p>
      </header>
      {children}
    </>
  );
}
