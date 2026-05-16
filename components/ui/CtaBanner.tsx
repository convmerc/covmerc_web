import Link from "next/link";
import type { ReactNode } from "react";
import { FurniButton } from "@/components/ui/FurniButton";

type CtaBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  variant?: "primary" | "light";
  className?: string;
  children?: ReactNode;
};

export function CtaBanner({
  eyebrow,
  title,
  description,
  primary,
  secondary,
  variant = "primary",
  className = "",
  children
}: CtaBannerProps) {
  const isPrimary = variant === "primary";

  return (
    <div
      className={`flex flex-col items-start justify-between gap-5 rounded-3xl p-8 md:flex-row md:items-center ${
        isPrimary
          ? "bg-furni-primary text-white shadow-soft"
          : "border border-furni-primary/10 bg-white shadow-soft"
      } ${className}`.trim()}
    >
      <div>
        <p className={isPrimary ? "covmerc-eyebrow-light" : "covmerc-eyebrow"}>{eyebrow}</p>
        <h2
          className={`mt-2 font-display text-2xl md:text-3xl ${isPrimary ? "text-white" : "text-furni-primary"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-2 max-w-md text-sm leading-relaxed ${isPrimary ? "text-white/80" : "text-furni-muted"}`}
        >
          {description}
        </p>
        {children}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={primary.href}>
          <FurniButton variant={isPrimary ? "accent" : "primary"}>{primary.label}</FurniButton>
        </Link>
        {secondary ? (
          <Link href={secondary.href}>
            <FurniButton
              variant="outline"
              className={isPrimary ? "border-white/40 text-white hover:bg-white/10" : ""}
            >
              {secondary.label}
            </FurniButton>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
