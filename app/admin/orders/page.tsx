"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { FurniCard } from "@/components/ui/FurniCard";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { formatNgn } from "@/lib/format-currency";
import type { FurniOrderStatus } from "@/lib/furni-types";

const statuses: FurniOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned"
];

const statusStyles: Record<FurniOrderStatus, string> = {
  Pending: "bg-furni-warning/20 text-furni-warning ring-furni-warning/30",
  Confirmed: "bg-furni-primary/10 text-furni-primary ring-furni-primary/20",
  Processing: "bg-furni-primary/15 text-furni-primary ring-furni-primary/25",
  Shipped: "bg-furni-accent/30 text-furni-primary ring-furni-accent/40",
  Delivered: "bg-furni-success/20 text-furni-success ring-furni-success/30",
  Cancelled: "bg-red-100 text-red-700 ring-red-200",
  Returned: "bg-slate-200 text-slate-700 ring-slate-300"
};

export default function AdminOrdersPage() {
  const { currentUser } = useAuthSession();
  const { orders, updateOrderStatus, storeLoading, refreshOrders } = useFurniStore();

  useEffect(() => {
    if (currentUser) {
      void refreshOrders();
    }
  }, [currentUser, refreshOrders]);

  return (
    <AdminLayout
      title="Orders"
      subtitle="Track fulfillment, update statuses, and monitor revenue from a single queue."
    >
      <FurniCard interactive={false} className="!p-0 overflow-hidden">
        <div className="border-b border-furni-primary/10 px-5 py-4">
          <AdminSectionHeader
            title="Fulfillment queue"
            description={`${orders.length} order${orders.length === 1 ? "" : "s"} loaded`}
          />
        </div>

        {storeLoading ? (
          <div className="p-5">
            <LoadingState variant="list" message="Loading orders…" count={4} />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-5">
            <EmptyState
              title="No orders yet"
              description="When customers complete checkout, orders will appear here for fulfillment."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-furni-primary/10 bg-furni-surface/60 text-left text-xs uppercase tracking-wide text-furni-muted">
                  <th className="px-5 py-3 font-semibold">Order</th>
                  <th className="px-5 py-3 font-semibold">Customer</th>
                  <th className="px-5 py-3 font-semibold">Items</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-furni-primary/5 transition hover:bg-furni-surface/50"
                  >
                    <td className="px-5 py-4 font-semibold text-furni-primary">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="hover:underline"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-furni-muted">{order.customer}</td>
                    <td className="px-5 py-4 tabular-nums text-furni-muted">{order.items}</td>
                    <td className="px-5 py-4 font-medium tabular-nums text-furni-ink">
                      {formatNgn(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value as FurniOrderStatus)
                        }
                        className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${statusStyles[order.status]}`}
                        aria-label={`Update status for order ${order.id}`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-furni-muted">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </FurniCard>
    </AdminLayout>
  );
}
