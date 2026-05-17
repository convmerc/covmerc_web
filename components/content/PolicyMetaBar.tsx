import Link from "next/link";

type PolicyLink = { href: string; label: string };

export function PolicyMetaBar({
  lastUpdated,
  links
}: {
  lastUpdated: string;
  links: readonly PolicyLink[];
}) {
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-furni-primary/10 bg-furni-surface/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-furni-muted">
        Last updated: <span className="font-medium text-furni-primary">{lastUpdated}</span>
      </p>
      <nav aria-label="Related policies" className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-furni-primary/15 bg-white px-3 py-1.5 text-xs font-medium text-furni-primary transition hover:border-furni-primary/30 hover:bg-furni-primary/5"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
