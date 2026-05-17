"use client";

import { useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
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
  Pending: "bg-furni-warning/20 text-furni-warning",
  Confirmed: "bg-furni-primary/10 text-furni-primary",
  Processing: "bg-furni-primary/15 text-furni-primary",
  Shipped: "bg-furni-accent/30 text-furni-primary",
  Delivered: "bg-furni-success/20 text-furni-success",
  Cancelled: "bg-red-100 text-red-700",
  Returned: "bg-slate-200 text-slate-700"
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
      title="Order Management"
      subtitle="Track and update order statuses from a centralized queue."
    >
      <FurniCard>
        {storeLoading ? (
          <LoadingState variant="list" message="Loading orders…" count={4} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="When customers complete checkout, orders will appear here for fulfillment."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-furni-primary/10 text-left text-furni-muted">
                  <th className="py-2 pr-4 font-medium">Order ID</th>
                  <th className="py-2 pr-4 font-medium">Customer</th>
                  <th className="py-2 pr-4 font-medium">Items</th>
                  <th className="py-2 pr-4 font-medium">Total</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-furni-primary/5">
                    <td className="py-3 pr-4 font-medium text-furni-primary">{order.id}</td>
                    <td className="py-3 pr-4 text-furni-muted">{order.customer}</td>
                    <td className="py-3 pr-4 text-furni-muted">{order.items}</td>
                    <td className="py-3 pr-4 text-furni-muted">{formatNgn(order.total)}</td>
                    <td className="py-3 pr-4">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order.id, event.target.value as FurniOrderStatus)
                        }
                        className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[order.status]}`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 pr-4 text-furni-muted">{order.createdAt}</td>
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
