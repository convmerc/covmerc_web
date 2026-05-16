"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { FurniCard } from "@/components/ui/FurniCard";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { formatNgn } from "@/lib/format-currency";

export default function AdminOverviewPage() {
  const { orders } = useFurniStore();

  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = orders.length ? totalSales / orders.length : 0;
  const newCustomers = new Set(orders.map((order) => order.customer)).size;

  const chartValues = [
    { label: "Mon", value: 30 },
    { label: "Tue", value: 45 },
    { label: "Wed", value: 52 },
    { label: "Thu", value: 38 },
    { label: "Fri", value: 66 },
    { label: "Sat", value: 58 },
    { label: "Sun", value: 72 }
  ];

  return (
    <AdminLayout
      title="Overview Analytics"
      subtitle="Track performance and monitor growth across your Covmerc storefront."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Total Sales" value={formatNgn(totalSales)} />
        <MetricCard label="New Customers" value={String(newCustomers)} />
        <MetricCard label="Average Order Value" value={formatNgn(averageOrderValue)} />
      </div>

      <FurniCard>
        <h2 className="text-lg font-semibold text-furni-primary">Weekly Sales Trend</h2>
        <div className="mt-4 flex h-48 items-end justify-between gap-3 rounded-2xl bg-furni-surface p-4">
          {chartValues.map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full max-w-[34px] rounded-t-lg bg-furni-primary"
                style={{ height: `${point.value}%` }}
              />
              <span className="text-xs text-furni-muted">{point.label}</span>
            </div>
          ))}
        </div>
      </FurniCard>
    </AdminLayout>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <FurniCard className="rounded-2xl">
      <p className="text-xs uppercase tracking-wide text-furni-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-furni-primary">{value}</p>
    </FurniCard>
  );
}
