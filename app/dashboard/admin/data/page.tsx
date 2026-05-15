import Link from "next/link";
import type { Route } from "next";
import { MANAGED_COLLECTIONS } from "@/lib/admin-collections";

export default function AdminDataManagerPage() {
  return (
    <main className="space-y-5">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs uppercase tracking-wide text-covmerc-textLight dark:text-slate-400">
          Admin data manager
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Collection browser</h1>
        <p className="mt-2 text-sm text-covmerc-textLight dark:text-slate-300">
          Pick a collection to inspect documents, apply safe updates, and archive
          records when needed.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MANAGED_COLLECTIONS.map((collection) => (
          <article
            key={collection.id}
            className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold">{collection.label}</h2>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                  collection.readOnly
                    ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-200"
                }`}
              >
                {collection.readOnly ? "Read-only" : "Writable"}
              </span>
            </div>
            <p className="min-h-20 text-sm text-covmerc-textLight dark:text-slate-300">
              {collection.description}
            </p>
            <p className="mt-2 text-xs text-covmerc-textLight dark:text-slate-400">
              Path: <span className="font-medium">{collection.collectionPath}</span>
            </p>
            <Link
              href={`/dashboard/admin/data/${collection.id}` as Route}
              className="mt-4 inline-flex rounded-full border border-covmerc-primary/30 px-3 py-1.5 text-xs font-semibold text-covmerc-primary transition hover:bg-covmerc-primary/5 dark:border-covmerc-secondary dark:text-covmerc-secondary dark:hover:bg-covmerc-secondary/10"
            >
              Open collection
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
