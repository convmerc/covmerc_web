import type { PropsWithChildren } from "react";

export function FurniCard({
  children,
  className = ""
}: PropsWithChildren<{ className?: string }>) {
  return (
    <article
      className={`rounded-3xl border border-furni-primary/10 bg-white p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(47,47,47,0.12)] ${className}`.trim()}
    >
      {children}
    </article>
  );
}
