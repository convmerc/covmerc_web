"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniImage } from "@/components/ui/FurniImage";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { fetchOrderById } from "@/lib/store-firestore";
import type { FurniOrder } from "@/lib/furni-types";
import { formatNgn } from "@/lib/format-currency";

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { currentUser } = useAuthSession();
  const [order, setOrder] = useState<FurniOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!currentUser?.id || !params.id) return;

    void (async () => {
      setLoading(true);
      try {
        const result = await fetchOrderById(params.id, {
          userId: currentUser.id,
          isAdmin: currentUser.userType === "admin",
        });
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
  }, [currentUser?.id, currentUser?.userType, params.id]);

  if (loading) {
    return <LoadingState variant="card" message="Loading order…" className="w-full" />;
  }

  if (notFound || !order) {
    return (
      <EmptyState
        title="Order not found"
        description="This order may not exist or is not linked to your account."
      >
        <Link href="/account/orders">
          <FurniButton variant="accent">Back to orders</FurniButton>
        </Link>
      </EmptyState>
    );
  }

  const address = order.deliveryAddress;

  return (
    <div className="space-y-6">
      <Link
        href="/account/orders"
        className="text-sm font-medium text-furni-primary hover:underline"
      >
        ← All orders
      </Link>

      <FurniCard className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Order</p>
          <h2 className="mt-1 font-display text-2xl text-furni-primary">{order.id}</h2>
          <p className="mt-2 text-sm text-furni-muted">{order.createdAt}</p>
          <p className="mt-1 text-xs text-furni-muted capitalize">
            {order.paymentStatus} · {order.paymentMethod}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-furni-ink">{formatNgn(order.total)}</p>
          <div className="mt-2 flex justify-end">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>
      </FurniCard>

      {order.lineItems && order.lineItems.length > 0 ? (
        <FurniCard>
          <h3 className="font-display text-lg text-furni-primary">Items</h3>
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
                  <p className="font-medium text-furni-primary">{item.name}</p>
                  <p className="text-sm text-furni-muted">
                    Qty {item.quantity} × {formatNgn(item.unitPrice)}
                  </p>
                </div>
                <p className="font-semibold text-furni-ink">{formatNgn(item.total)}</p>
              </li>
            ))}
          </ul>
        </FurniCard>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {address ? (
          <FurniCard>
            <h3 className="font-display text-lg text-furni-primary">Delivery address</h3>
            <p className="mt-3 text-sm text-furni-muted">
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

        <FurniCard>
          <h3 className="font-display text-lg text-furni-primary">Summary</h3>
          <dl className="mt-3 space-y-2 text-sm">
            {order.subtotal !== undefined ? (
              <div className="flex justify-between text-furni-muted">
                <dt>Subtotal</dt>
                <dd className="text-furni-ink">{formatNgn(order.subtotal)}</dd>
              </div>
            ) : null}
            {order.deliveryFee !== undefined ? (
              <div className="flex justify-between text-furni-muted">
                <dt>Delivery</dt>
                <dd className="text-furni-ink">{formatNgn(order.deliveryFee)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-furni-primary/10 pt-2 font-semibold text-furni-primary">
              <dt>Total</dt>
              <dd>{formatNgn(order.total)}</dd>
            </div>
          </dl>
          {order.trackingNumber ? (
            <p className="mt-4 text-sm text-furni-muted">
              Tracking: <span className="font-medium text-furni-primary">{order.trackingNumber}</span>
            </p>
          ) : null}
        </FurniCard>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/account/messages">
          <FurniButton variant="outline">Contact support</FurniButton>
        </Link>
        <Link href="/shop">
          <FurniButton variant="accent">Continue shopping</FurniButton>
        </Link>
      </div>
    </div>
  );
}
