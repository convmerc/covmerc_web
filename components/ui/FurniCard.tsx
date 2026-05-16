import type { PropsWithChildren } from "react";

type FurniCardProps = PropsWithChildren<{
  className?: string;
  /** Disable hover lift — use for nested or static cards */
  interactive?: boolean;
}>;

export function FurniCard({
  children,
  className = "",
  interactive = true
}: FurniCardProps) {
  const hoverStyles = interactive
    ? "transition duration-300 hover:-translate-y-1 hover:shadow-lift"
    : "";

  return (
    <article
      className={`rounded-3xl border border-furni-primary/10 bg-white p-5 shadow-soft ${hoverStyles} ${className}`.trim()}
    >
      {children}
    </article>
  );
}
