"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { FurniCard } from "@/components/ui/FurniCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { countOrdersByStatus, weeklyOrderBars } from "@/lib/admin-analytics";
import { fetchAdminMetrics, type MetricResult } from "@/lib/admin-firestore";
import { formatNgn } from "@/lib/format-currency";

export default function AdminOverviewPage() {
  const { orders, products, storeLoading } = useFurniStore();
  const [metrics, setMetrics] = useState<MetricResult[]>([]);
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setMetricsLoading(true);
    void fetchAdminMetrics()
      .then((result) => {
        if (!cancelled) setMetrics(result);
      })
      .finally(() => {
        if (!cancelled) setMetricsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length ? totalSales / orders.length : 0;
  const newCustomers = new Set(orders.map((order) => order.customer)).size;
  const pendingProducts = products.filter(
    (product) => (product.status ?? "approved").toLowerCase() === "pending"
  ).length;
  const chartValues = useMemo(() => weeklyOrderBars(orders), [orders]);
  const statusCounts = useMemo(() => countOrdersByStatus(orders), [orders]);

  return (
    <AdminPage
      title="Overview"
      subtitle="Monitor storefront performance, catalog health, and operational queues."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total sales" value={formatNgn(totalSales)} />
        <MetricCard label="Orders" value={String(orders.length)} />
        <MetricCard label="Avg. order value" value={formatNgn(averageOrderValue)} />
        <MetricCard
          label="Pending listings"
          value={String(pendingProducts)}
          href="/admin/products"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Unique customers" value={String(newCustomers)} />
        <MetricCard
          label="Pending orders"
          value={String(statusCounts.Pending ?? 0)}
          href="/admin/orders"
        />
        <MetricCard label="Published products" value={String(products.length)} />
      </div>

      <FurniCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-furni-primary">Orders (last 7 days)</h2>
            <p className="mt-1 text-sm text-furni-muted">
              Order count by day from your live Firestore queue.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-furni-primary hover:underline"
          >
            Manage orders →
          </Link>
        </div>
        {storeLoading ? (
          <div className="mt-4">
            <LoadingState variant="inline" message="Loading orders…" />
          </div>
        ) : (
          <div className="mt-4 flex h-48 items-end justify-between gap-2 rounded-2xl bg-furni-surface p-4 sm:gap-3">
            {chartValues.map((point) => (
              <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[10px] font-medium text-furni-muted">
                  {point.value > 0 ? point.value : ""}
                </span>
                <div
                  className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-furni-primary to-furni-primary/70 transition-all"
                  style={{ height: `${Math.max(point.heightPercent, 4)}%` }}
                  title={`${point.value} orders · ${formatNgn(point.amount)}`}
                />
                <span className="text-xs text-furni-muted">{point.label}</span>
              </div>
            ))}
          </div>
        )}
      </FurniCard>

      <FurniCard>
        <h2 className="text-lg font-semibold text-furni-primary">Firestore collections</h2>
        <p className="mt-1 text-sm text-furni-muted">
          Document counts from managed admin collections.
        </p>
        {metricsLoading ? (
          <div className="mt-4">
            <LoadingState variant="inline" message="Loading metrics…" />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl border border-furni-primary/10 bg-furni-surface/80 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-furni-muted">
                  {metric.label}
                </p>
                <p className="mt-1 text-2xl font-semibold text-furni-primary">
                  {metric.status === "ok" && metric.value != null ? metric.value : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
        <Link
          href="/admin/data"
          className="mt-4 inline-block text-sm font-semibold text-furni-primary hover:underline"
        >
          Open data manager →
        </Link>
      </FurniCard>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickLinkCard
          title="Inventory"
          description="Approve vendor listings, edit products, and manage stock."
          href="/admin/products"
        />
        <QuickLinkCard
          title="Journal content"
          description="Publish blog posts shared with web and mobile."
          href="/admin/content"
        />
        <QuickLinkCard
          title="Support tickets"
          description="Review customer issues and update ticket status."
          href="/admin/support"
        />
        <QuickLinkCard
          title="Announcements"
          description="Broadcast studio updates to app clients."
          href="/admin/announcements"
        />
      </div>
    </AdminPage>
  );
}

function MetricCard({
  label,
  value,
  href
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-xs uppercase tracking-wide text-furni-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-furni-primary">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href}>
        <FurniCard className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
          {body}
        </FurniCard>
      </Link>
    );
  }

  return <FurniCard className="h-full">{body}</FurniCard>;
}

function QuickLinkCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <FurniCard className="h-full transition hover:-translate-y-0.5 hover:shadow-md">
        <h3 className="font-semibold text-furni-primary">{title}</h3>
        <p className="mt-2 text-sm text-furni-muted">{description}</p>
        <span className="mt-4 inline-block text-sm font-medium text-furni-primary">
          Open →
        </span>
      </FurniCard>
    </Link>
  );
}
