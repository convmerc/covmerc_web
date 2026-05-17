"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniImage } from "@/components/ui/FurniImage";
import { LoadingState } from "@/components/ui/LoadingState";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { fetchOrderById } from "@/lib/store-firestore";
import type { FurniOrder, FurniOrderStatus } from "@/lib/furni-types";
import { formatNgn } from "@/lib/format-currency";

const statuses: FurniOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned"
];

type AdminOrderDetailProps = {
  orderId: string;
  backHref?: string;
  backLabel?: string;
};

export function AdminOrderDetail({
  orderId,
  backHref = "/admin/orders",
  backLabel = "← All orders"
}: AdminOrderDetailProps) {
  const { updateOrderStatus } = useFurniStore();
  const [order, setOrder] = useState<FurniOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    void (async () => {
      setLoading(true);
      try {
        const result = await fetchOrderById(orderId, { isAdmin: true });
        if (!result) {
          setNotFound(true);
          setOrder(null);
        } else {
          setOrder(result);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return <LoadingState variant="card" message="Loading order…" className="w-full" />;
  }

  if (notFound || !order) {
    return (
      <EmptyState title="Order not found" description="This order may have been removed.">
        <Link href={backHref}>
          <FurniButton variant="accent">{backLabel.replace("← ", "")}</FurniButton>
        </Link>
      </EmptyState>
    );
  }

  const address = order.deliveryAddress;

  return (
    <div className="space-y-6">
      <Link href={backHref} className="text-sm font-semibold text-furni-primary hover:underline">
        {backLabel}
      </Link>

      <FurniCard interactive={false} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="covmerc-eyebrow">Order</p>
          <h2 className="mt-1 font-display text-2xl text-furni-primary">{order.id}</h2>
          <p className="mt-2 text-sm text-furni-muted">{order.customer}</p>
          {order.customerEmail ? (
            <p className="text-sm text-furni-muted">{order.customerEmail}</p>
          ) : null}
          <p className="mt-1 text-xs text-furni-muted">{order.createdAt}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl text-furni-primary">{formatNgn(order.total)}</p>
          <div className="mt-2 flex justify-end">
            <OrderStatusBadge status={order.status} />
          </div>
          <label className="mt-4 block text-left text-xs font-medium text-furni-muted">
            Update status
            <select
              value={order.status}
              onChange={(event) => {
                const status = event.target.value as FurniOrderStatus;
                void updateOrderStatus(order.id, status).then(() => {
                  setOrder((current) => (current ? { ...current, status } : current));
                });
              }}
              className="mt-1 w-full min-w-[10rem] rounded-xl border border-furni-primary/20 bg-white px-3 py-2 text-sm text-furni-ink"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </FurniCard>

      {order.lineItems && order.lineItems.length > 0 ? (
        <FurniCard interactive={false}>
          <AdminSectionHeader title="Line items" description={`${order.items} items in this order`} />
          <ul className="mt-4 space-y-3">
            {order.lineItems.map((item) => (
              <li
                key={`${item.productId}-${item.name}`}
                className="flex flex-wrap items-center gap-4 border-b border-furni-primary/10 pb-3 last:border-0 last:pb-0"
              >
                {item.image ? (
                  <FurniImage
                    src={item.image}
                    alt={item.name}
                    variant="thumb"
                    className="h-16 w-16 rounded-xl"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-furni-primary">{item.name}</p>
                  <p className="text-sm text-furni-muted">
                    Qty {item.quantity} × {formatNgn(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold tabular-nums text-furni-ink">{formatNgn(item.total)}</p>
              </li>
            ))}
          </ul>
        </FurniCard>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {address ? (
          <FurniCard interactive={false}>
            <h3 className="font-display text-lg text-furni-primary">Delivery address</h3>
            <p className="mt-3 text-sm leading-relaxed text-furni-muted">
              {address.fullName}
              <br />
              {address.addressLine1}
              {address.addressLine2 ? (
                <>
                  <br />
                  {address.addressLine2}
                </>
              ) : null}
              <br />
              {[address.city, address.state, address.country].filter(Boolean).join(", ")}
              {address.postalCode ? (
                <>
                  <br />
                  {address.postalCode}
                </>
              ) : null}
              {address.phone ? (
                <>
                  <br />
                  {address.phone}
                </>
              ) : null}
            </p>
          </FurniCard>
        ) : null}

        <FurniCard interactive={false}>
          <h3 className="font-display text-lg text-furni-primary">Payment summary</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between text-furni-muted">
              <dt>Payment status</dt>
              <dd className="capitalize text-furni-ink">{order.paymentStatus}</dd>
            </div>
            <div className="flex justify-between text-furni-muted">
              <dt>Payment method</dt>
              <dd className="text-furni-ink">{order.paymentMethod}</dd>
            </div>
            {order.subtotal !== undefined ? (
              <div className="flex justify-between text-furni-muted">
                <dt>Subtotal</dt>
                <dd className="tabular-nums text-furni-ink">{formatNgn(order.subtotal)}</dd>
              </div>
            ) : null}
            {order.deliveryFee !== undefined ? (
              <div className="flex justify-between text-furni-muted">
                <dt>Delivery</dt>
                <dd className="tabular-nums text-furni-ink">{formatNgn(order.deliveryFee)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-furni-primary/10 pt-2 font-semibold text-furni-primary">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatNgn(order.total)}</dd>
            </div>
          </dl>
          {order.trackingNumber ? (
            <p className="mt-4 text-sm text-furni-muted">
              Tracking:{" "}
              <span className="font-medium text-furni-primary">{order.trackingNumber}</span>
            </p>
          ) : null}
          {order.notes ? (
            <p className="mt-3 text-sm text-furni-muted">
              Notes: <span className="text-furni-ink">{order.notes}</span>
            </p>
          ) : null}
        </FurniCard>
      </div>
    </div>
  );
}
