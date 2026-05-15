"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAdminMetrics, type MetricResult } from "@/lib/admin-firestore";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMetrics() {
      setIsLoading(true);
      const nextMetrics = await fetchAdminMetrics();
      if (mounted) {
        setMetrics(nextMetrics);
        setIsLoading(false);
      }
    }

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs uppercase tracking-wide text-covmerc-textLight dark:text-slate-400">
          Admin overview
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Platform control center
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-covmerc-textLight dark:text-slate-300">
          Metrics and collection management run against your existing Firebase
          project. Shared mobile collections are read-only by default to reduce
          schema drift risk.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {(isLoading ? [0, 1, 2] : metrics).map((entry, index) => (
          <SummaryCard
            key={typeof entry === "number" ? index : entry.id}
            label={
              typeof entry === "number" ? "Loading metric..." : entry.label
            }
            value={
              typeof entry === "number"
                ? "..."
                : entry.status === "ok"
                  ? String(entry.value)
                  : "N/A"
            }
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.5fr,1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold">Safety defaults for shared data</h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 text-sm text-covmerc-textLight dark:text-slate-300">
            <li>
              Collections used by Flutter clients are marked read-only until you
              explicitly permit writes.
            </li>
            <li>
              Writable collections only accept allowlisted scalar fields to avoid
              accidental nested schema changes.
            </li>
            <li>
              “Delete” behavior archives a document instead of hard-deleting.
            </li>
          </ul>
          <Link
            href="/dashboard/admin/data"
            className="mt-4 inline-flex rounded-full bg-covmerc-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-covmerc-primary/90"
          >
            Open data manager
          </Link>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-base font-semibold">Role check options</h2>
          <p className="mt-3 text-sm text-covmerc-textLight dark:text-slate-300">
            Access is granted if any one check passes:
          </p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm text-covmerc-textLight dark:text-slate-300">
            <li>Custom claim: `admin: true` or `roles` includes `admin`</li>
            <li>Document exists at `admins/{'{uid}'}`</li>
            <li>Document at `users/{'{uid}'}` with `role: "admin"` or roles array</li>
          </ol>
        </article>
      </section>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs text-covmerc-textLight dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </article>
  );
}

