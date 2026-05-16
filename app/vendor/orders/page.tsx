"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { FurniCard } from "@/components/ui/FurniCard";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { fetchVendorOrders } from "@/lib/store-marketplace";
import type { FurniOrder } from "@/lib/furni-types";
import { formatNgn } from "@/lib/format-currency";

export default function VendorOrdersPage() {
  const { currentUser } = useAuthSession();
  const [orders, setOrders] = useState<FurniOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    void (async () => {
      setLoading(true);
      try {
        const vendorOrders = await fetchVendorOrders(currentUser.id);
        setOrders(
          vendorOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <FurniCard>
        <p className="text-sm text-furni-muted">Loading orders…</p>
      </FurniCard>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No vendor orders yet"
        description="When customers purchase your products, orders containing your items will show here."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <FurniCard className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-furni-primary">{order.id}</p>
              <p className="mt-1 text-sm text-furni-muted">
                {order.customer} · {order.createdAt}
              </p>
              <p className="mt-1 text-xs text-furni-muted">
                {order.paymentStatus} · {order.paymentMethod}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-furni-ink">{formatNgn(order.total)}</p>
              <div className="mt-2 flex justify-end">
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </FurniCard>
        </li>
      ))}
    </ul>
  );
}
