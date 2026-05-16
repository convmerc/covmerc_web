import Link from "next/link";
import { FurniCard } from "@/components/ui/FurniCard";

type RelatedLink = {
  href: string;
  label: string;
  description: string;
};

type RelatedPagesProps = {
  title?: string;
  links: readonly RelatedLink[];
};

export function RelatedPages({
  title = "Related pages",
  links
}: RelatedPagesProps) {
  return (
    <section className="mt-10 animate-fade-up">
      <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-furni-primary">
        {title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <FurniCard className="h-full transition hover:border-furni-primary/25 hover:shadow-[0_12px_28px_rgba(59,93,80,0.12)]">
              <p className="font-semibold text-furni-primary">{link.label}</p>
              <p className="mt-1 text-sm text-furni-muted">{link.description}</p>
              <span className="mt-3 inline-block text-xs font-medium text-furni-primary">
                Visit →
              </span>
            </FurniCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
