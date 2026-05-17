"use client";

import Link from "next/link";
import { useEffect } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { formatNgn } from "@/lib/format-currency";

export default function AccountOrdersPage() {
  const { currentUser } = useAuthSession();
  const { orders, storeLoading, refreshOrders } = useFurniStore();

  useEffect(() => {
    if (currentUser) {
      void refreshOrders();
    }
  }, [currentUser, refreshOrders]);

  if (storeLoading) {
    return <LoadingState variant="list" message="Loading orders…" count={4} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        description="When you place your first order, it will appear here with live status updates."
      >
        <Link href="/shop">
          <FurniButton variant="accent">Shop collection</FurniButton>
        </Link>
      </EmptyState>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link href={`/account/orders/${order.id}`}>
          <FurniCard className="flex flex-wrap items-center justify-between gap-4 transition hover:-translate-y-0.5">
            <div>
              <p className="font-semibold text-furni-primary">{order.id}</p>
              <p className="mt-1 text-sm text-furni-muted">
                {order.createdAt} · {order.items} item{order.items === 1 ? "" : "s"}
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
          </Link>
        </li>
      ))}
    </ul>
  );
}
