import type { PropsWithChildren } from "react";

export function FurniCard({
  children,
  className = ""
}: PropsWithChildren<{ className?: string }>) {
  return (
    <article
      className={`rounded-3xl border border-furni-primary/10 bg-white p-5 shadow-soft ${className}`.trim()}
    >
      {children}
    </article>
  );
}
