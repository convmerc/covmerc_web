import Link from "next/link";
import type { SupportFaq } from "@/lib/site-content";
import { FurniCard } from "@/components/ui/FurniCard";

export function SupportFaqList({ items }: { items: SupportFaq[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <FurniCard key={item.question} className="overflow-hidden p-0 transition hover:border-furni-primary/20">
          <details className="group">
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-furni-primary marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-3">
                {item.question}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-furni-surface text-furni-muted transition group-open:rotate-45 group-open:bg-furni-accent/25 group-open:text-furni-primary"
                  aria-hidden
                >
                  +
                </span>
              </span>
            </summary>
            <div className="border-t border-furni-primary/10 bg-furni-surface/50 px-5 pb-5 pt-3 text-sm leading-relaxed text-furni-muted">
              <p>{item.answer}</p>
              {item.href && item.hrefLabel ? (
                <Link
                  href={item.href}
                  className="mt-3 inline-block font-medium text-furni-primary hover:underline"
                >
                  {item.hrefLabel} →
                </Link>
              ) : null}
            </div>
          </details>
        </FurniCard>
      ))}
    </div>
  );
}
