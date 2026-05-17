import Link from "next/link";
import type { Route } from "next";
import { MANAGED_COLLECTIONS } from "@/lib/admin-collections";

export default function AdminDataManagerPage() {
  return (
    <main className="space-y-5">
      <header className="rounded-3xl border border-furni-primary/10 bg-white p-5 shadow-soft">
        <p className="covmerc-eyebrow">Admin data manager</p>
        <h1 className="mt-2 font-display text-2xl text-furni-primary">Collection browser</h1>
        <p className="mt-2 text-sm text-furni-muted">
          Pick a collection to inspect documents, apply safe updates, and archive records when
          needed.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MANAGED_COLLECTIONS.map((collection) => (
          <article
            key={collection.id}
            className="rounded-3xl border border-furni-primary/10 bg-white p-4 shadow-soft"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-furni-primary">{collection.label}</h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  collection.readOnly
                    ? "bg-furni-primary/10 text-furni-primary"
                    : "bg-furni-accent/25 text-furni-primary"
                }`}
              >
                {collection.readOnly ? "Read-only" : "Writable"}
              </span>
            </div>
            <p className="min-h-20 text-sm text-furni-muted">{collection.description}</p>
            <p className="mt-2 text-xs text-furni-muted">
              Path: <span className="font-medium text-furni-ink">{collection.collectionPath}</span>
            </p>
            <Link
              href={`/admin/data/${collection.id}` as Route}
              className="mt-4 inline-flex rounded-full border border-furni-primary/25 px-3 py-1.5 text-xs font-semibold text-furni-primary transition hover:bg-furni-primary/5"
            >
              Open collection
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
