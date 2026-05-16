import type { ReactNode } from "react";

type PageSectionVariant = "default" | "compact" | "white" | "muted" | "primary";

const variantClasses: Record<PageSectionVariant, string> = {
  default: "py-14 md:py-16",
  compact: "py-10 md:py-12",
  white: "bg-white py-14 md:py-16",
  muted: "border-y border-furni-primary/10 bg-furni-primary/[0.04] py-14 md:py-16",
  primary: "bg-furni-primary py-14 text-white md:py-16"
};

type PageSectionProps = {
  children: ReactNode;
  variant?: PageSectionVariant;
  className?: string;
  containerClassName?: string;
  /** Full-bleed section without max-width container */
  bleed?: boolean;
};

export function PageSection({
  children,
  variant = "default",
  className = "",
  containerClassName = "",
  bleed = false
}: PageSectionProps) {
  const inner = bleed ? (
    children
  ) : (
    <div className={`covmerc-container ${containerClassName}`.trim()}>{children}</div>
  );

  return (
    <section className={`${variantClasses[variant]} ${className}`.trim()}>{inner}</section>
  );
}
