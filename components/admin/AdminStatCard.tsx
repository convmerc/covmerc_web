import Link from "next/link";
type AdminStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  icon?: string;
  tone?: "default" | "accent" | "warning";
};

const toneStyles = {
  default: {
    card: "border-furni-primary/10 bg-white",
    icon: "bg-furni-surface text-furni-primary",
    value: "text-furni-primary"
  },
  accent: {
    card: "border-furni-accent/40 bg-gradient-to-br from-white to-furni-accent/10",
    icon: "bg-furni-accent/30 text-furni-primary",
    value: "text-furni-primary"
  },
  warning: {
    card: "border-furni-warning/35 bg-gradient-to-br from-white to-furni-warning/10",
    icon: "bg-furni-warning/25 text-furni-warning",
    value: "text-furni-primary"
  }
} as const;

function CardInner({
  label,
  value,
  hint,
  icon,
  tone
}: Omit<AdminStatCardProps, "href">) {
  const styles = toneStyles[tone ?? "default"];

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        {icon ? (
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-xl text-lg ${styles.icon}`}
            aria-hidden
          >
            {icon}
          </span>
        ) : (
          <span className="h-10 w-10" aria-hidden />
        )}
        {hint ? (
          <span className="max-w-[8rem] text-right text-xs leading-snug text-furni-muted">
            {hint}
          </span>
        ) : null}
      </div>
      <p className={`mt-4 font-display text-3xl tracking-tight ${styles.value}`}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-furni-ink">{label}</p>
    </>
  );
}

export function AdminStatCard({
  label,
  value,
  hint,
  href,
  icon,
  tone = "default"
}: AdminStatCardProps) {
  const styles = toneStyles[tone];
  const className = `group flex h-full flex-col rounded-2xl border p-4 shadow-soft transition ${styles.card} ${
    href ? "hover:-translate-y-0.5 hover:shadow-md" : ""
  }`;

  if (href) {
    return (
      <Link href={href} className={className}>
        <CardInner label={label} value={value} hint={hint} icon={icon} tone={tone} />
        <span className="mt-3 text-xs font-semibold text-furni-primary opacity-0 transition group-hover:opacity-100">
          View details →
        </span>
      </Link>
    );
  }

  return (
    <article className={className}>
      <CardInner label={label} value={value} hint={hint} icon={icon} tone={tone} />
    </article>
  );
}
