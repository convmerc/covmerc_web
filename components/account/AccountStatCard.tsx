import Link from "next/link";

type AccountStatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  href: string;
  icon: string;
};

export function AccountStatCard({ label, value, hint, href, icon }: AccountStatCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-furni-primary/10 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-furni-surface text-lg"
          aria-hidden
        >
          {icon}
        </span>
        <span className="text-xs font-medium text-furni-primary opacity-0 transition group-hover:opacity-100">
          View →
        </span>
      </div>
      <p className="mt-4 font-display text-3xl text-furni-primary">{value}</p>
      <p className="mt-1 text-sm font-semibold text-furni-ink">{label}</p>
      {hint ? <p className="mt-0.5 text-xs text-furni-muted">{hint}</p> : null}
    </Link>
  );
}
