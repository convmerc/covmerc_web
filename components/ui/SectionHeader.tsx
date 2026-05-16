import Link from "next/link";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
  children?: ReactNode;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  children
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-8 flex flex-col gap-3 ${isCenter ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={isCenter ? "max-w-2xl" : "max-w-xl"}>
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">{eyebrow}</p>
        ) : null}
        <h2
          className={`font-display text-3xl text-furni-primary md:text-4xl ${eyebrow ? "mt-2" : ""}`}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-furni-muted md:text-base">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="shrink-0 text-sm font-semibold text-furni-primary transition hover:text-furni-ink"
        >
          {action.label} →
        </Link>
      ) : null}
    </div>
  );
}
