import { FurniCard } from "@/components/ui/FurniCard";
import type { PolicyHighlight } from "@/lib/site-content";

export function PolicyHighlights({ items }: { items: readonly PolicyHighlight[] }) {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <FurniCard key={item.label} interactive={false} className="p-5">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-furni-primary/8 text-xl"
            aria-hidden
          >
            {item.icon}
          </span>
          <p className="mt-4 text-2xl font-semibold text-furni-primary">{item.value}</p>
          <p className="mt-1 text-sm font-semibold text-furni-ink">{item.label}</p>
          {item.description ? (
            <p className="mt-1 text-xs leading-relaxed text-furni-muted">{item.description}</p>
          ) : null}
        </FurniCard>
      ))}
    </div>
  );
}
