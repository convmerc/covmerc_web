"use client";

import { useMemo, useState } from "react";
import type { SupportFaq } from "@/lib/site-content";
import { SupportFaqList } from "@/components/content/SupportFaqList";
import { FurniInput } from "@/components/ui/FurniInput";

export function SupportFaqExplorer({ items }: { items: SupportFaq[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div>
      <div className="mt-6 max-w-md">
        <label htmlFor="faq-search" className="sr-only">
          Search FAQs
        </label>
        <FurniInput
          id="faq-search"
          type="search"
          placeholder="Search questions…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-describedby="faq-search-hint"
        />
        <p id="faq-search-hint" className="mt-2 text-xs text-furni-muted">
          {filtered.length} of {items.length} questions
          {query ? ` matching “${query.trim()}”` : ""}
        </p>
      </div>
      <div className="mt-6">
        {filtered.length > 0 ? (
          <SupportFaqList items={filtered} />
        ) : (
          <p className="rounded-2xl border border-dashed border-furni-primary/20 bg-furni-surface px-5 py-8 text-center text-sm text-furni-muted">
            No FAQs match your search. Try different keywords or{" "}
            <a href="/contact" className="font-medium text-furni-primary hover:underline">
              contact us
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
