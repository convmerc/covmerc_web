import Link from "next/link";

type AdminQuickLinkCardProps = {
  title: string;
  description: string;
  href: string;
  icon?: string;
};

export function AdminQuickLinkCard({
  title,
  description,
  href,
  icon
}: AdminQuickLinkCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <article className="flex h-full flex-col rounded-2xl border border-furni-primary/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start gap-3">
          {icon ? (
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-furni-surface text-lg"
              aria-hidden
            >
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="font-semibold text-furni-primary">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-furni-muted">{description}</p>
          </div>
        </div>
        <span className="mt-4 text-sm font-semibold text-furni-primary opacity-80 transition group-hover:opacity-100">
          Open →
        </span>
      </article>
    </Link>
  );
}
