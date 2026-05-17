import Link from "next/link";
import type { Route } from "next";
import { AdminPage } from "@/components/admin/AdminPage";
import { MANAGED_COLLECTIONS } from "@/lib/admin-collections";

export default function AdminDataManagerPage() {
  return (
    <AdminPage
      title="Data manager"
      subtitle="Inspect Firestore collections, apply safe updates, and archive records when needed."
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MANAGED_COLLECTIONS.map((collection) => (
          <article
            key={collection.id}
            className="flex h-full flex-col rounded-2xl border border-furni-primary/10 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h2 className="font-semibold text-furni-primary">{collection.label}</h2>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  collection.readOnly
                    ? "bg-furni-primary/10 text-furni-primary"
                    : "bg-furni-accent/25 text-furni-primary"
                }`}
              >
                {collection.readOnly ? "Read-only" : "Writable"}
              </span>
            </div>
            <p className="flex-1 text-sm leading-relaxed text-furni-muted">
              {collection.description}
            </p>
            <p className="mt-3 text-xs text-furni-muted">
              Path:{" "}
              <code className="rounded bg-furni-surface px-1.5 py-0.5 font-mono text-[11px] text-furni-ink">
                {collection.collectionPath}
              </code>
            </p>
            <Link
              href={`/admin/data/${collection.id}` as Route}
              className="mt-4 inline-flex w-fit rounded-full border border-furni-primary/25 px-3 py-1.5 text-xs font-semibold text-furni-primary transition hover:bg-furni-primary/5"
            >
              Open collection →
            </Link>
          </article>
        ))}
      </section>
    </AdminPage>
  );
}
