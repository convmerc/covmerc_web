"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminQuickLinkCard } from "@/components/admin/AdminQuickLinkCard";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { FurniCard } from "@/components/ui/FurniCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { countOrdersByStatus, weeklyOrderBars } from "@/lib/admin-analytics";
import { fetchAdminMetrics, type MetricResult } from "@/lib/admin-firestore";
import { formatNgn } from "@/lib/format-currency";

const CHART_HEIGHT_PX = 160;

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
  const uniqueCustomers = new Set(orders.map((order) => order.customer)).size;
  const pendingProducts = products.filter(
    (product) => (product.status ?? "approved").toLowerCase() === "pending"
  ).length;
  const chartValues = useMemo(() => weeklyOrderBars(orders), [orders]);
  const statusCounts = useMemo(() => countOrdersByStatus(orders), [orders]);
  const maxChartOrders = Math.max(1, ...chartValues.map((point) => point.value));
  const pendingOrders = statusCounts.Pending ?? 0;

  return (
    <AdminPage
      title="Overview"
      subtitle="Monitor storefront performance, catalog health, and operational queues at a glance."
    >
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total sales"
          value={formatNgn(totalSales)}
          hint="Lifetime from loaded orders"
          icon="₦"
          tone="accent"
        />
        <AdminStatCard
          label="Orders"
          value={String(orders.length)}
          hint="In fulfillment queue"
          href="/admin/orders"
          icon="📦"
        />
        <AdminStatCard
          label="Avg. order value"
          value={formatNgn(averageOrderValue)}
          hint={`${uniqueCustomers} unique customers`}
          icon="◎"
        />
        <AdminStatCard
          label="Pending listings"
          value={String(pendingProducts)}
          hint="Awaiting approval"
          href="/admin/products"
          icon="🛋️"
          tone={pendingProducts > 0 ? "warning" : "default"}
        />
      </section>

      {(pendingOrders > 0 || pendingProducts > 0) && (
        <FurniCard interactive={false} className="border-furni-warning/30 bg-furni-warning/5">
          <p className="text-sm font-semibold text-furni-primary">Needs attention</p>
          <ul className="mt-2 space-y-1 text-sm text-furni-muted">
            {pendingOrders > 0 ? (
              <li>
                {pendingOrders} order{pendingOrders === 1 ? "" : "s"} pending confirmation.
              </li>
            ) : null}
            {pendingProducts > 0 ? (
              <li>
                {pendingProducts} product listing{pendingProducts === 1 ? "" : "s"} awaiting review.
              </li>
            ) : null}
          </ul>
        </FurniCard>
      )}

      <FurniCard interactive={false}>
        <AdminSectionHeader
          title="Orders (last 7 days)"
          description="Daily order volume from your live Firestore queue."
          action={{ label: "Manage orders →", href: "/admin/orders" }}
        />
        {storeLoading ? (
          <div className="mt-4">
            <LoadingState variant="inline" message="Loading orders…" />
          </div>
        ) : (
          <div
            className="mt-6 flex items-end justify-between gap-2 rounded-2xl bg-furni-surface px-3 pb-3 pt-4 sm:gap-3 sm:px-4"
            style={{ minHeight: CHART_HEIGHT_PX + 48 }}
            role="img"
            aria-label="Bar chart of orders over the last seven days"
          >
            {chartValues.map((point) => {
              const barHeight = Math.max(
                8,
                Math.round((point.value / maxChartOrders) * CHART_HEIGHT_PX)
              );

              return (
                <div
                  key={point.label}
                  className="flex flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-[10px] font-semibold tabular-nums text-furni-muted">
                    {point.value > 0 ? point.value : ""}
                  </span>
                  <div
                    className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-furni-primary to-furni-primary/55 transition-all"
                    style={{ height: barHeight }}
                    title={`${point.value} orders · ${formatNgn(point.amount)}`}
                  />
                  <span className="text-xs font-medium text-furni-muted">{point.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </FurniCard>

      <FurniCard interactive={false}>
        <AdminSectionHeader
          title="Firestore collections"
          description="Document counts from managed admin collections."
          action={{ label: "Data manager →", href: "/admin/data" }}
        />
        {metricsLoading ? (
          <div className="mt-4">
            <LoadingState variant="inline" message="Loading metrics…" />
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="rounded-2xl border border-furni-primary/10 bg-furni-surface/80 px-4 py-3"
              >
                <p className="text-xs uppercase tracking-wide text-furni-muted">
                  {metric.label}
                </p>
                <p className="mt-1 font-display text-2xl text-furni-primary">
                  {metric.status === "ok" && metric.value != null ? metric.value : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </FurniCard>

      <section aria-label="Shortcuts" className="grid gap-4 md:grid-cols-2">
        <AdminQuickLinkCard
          title="Inventory"
          description="Approve vendor listings, edit products, and manage stock."
          href="/admin/products"
          icon="🛋️"
        />
        <AdminQuickLinkCard
          title="Journal content"
          description="Publish blog posts shared with web and mobile."
          href="/admin/content"
          icon="✎"
        />
        <AdminQuickLinkCard
          title="Support tickets"
          description="Review customer issues and update ticket status."
          href="/admin/support"
          icon="💬"
        />
        <AdminQuickLinkCard
          title="Announcements"
          description="Broadcast studio updates to app clients."
          href="/admin/announcements"
          icon="📣"
        />
      </section>
    </AdminPage>
  );
}
