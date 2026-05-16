"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { formatNgn } from "@/lib/format-currency";
import { relatedPageGroups } from "@/lib/site-content";

export default function AccountOrdersPage() {
  const router = useRouter();
  const { currentUser, authLoading } = useAuthSession();
  const { orders, storeLoading, refreshOrders } = useFurniStore();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace("/auth/login?next=/account/orders");
    }
  }, [authLoading, currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      void refreshOrders();
    }
  }, [currentUser, refreshOrders]);

  if (authLoading || !currentUser) {
    return (
      <MarketingShell maxWidth="4xl">
        <FurniCard className="text-center">
          <p className="text-sm text-furni-muted">Loading your orders…</p>
        </FurniCard>
      </MarketingShell>
    );
  }

  return (
    <MarketingShell maxWidth="4xl">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account/orders" },
          { label: "Orders" }
        ]}
      />

      <PageHero
        eyebrow="Your account"
        title="Order history"
        description={`Signed in as ${currentUser.name}. Track status, payment, and delivery for every Covmerc purchase.`}
      />

      {storeLoading ? (
        <FurniCard>
          <p className="text-sm text-furni-muted">Loading orders…</p>
        </FurniCard>
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place your first order, it will appear here with live status updates."
        >
          <Link href="/shop">
            <FurniButton variant="accent">Shop collection</FurniButton>
          </Link>
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <FurniCard className="flex flex-wrap items-center justify-between gap-4">
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
            </li>
          ))}
        </ul>
      )}

      <RelatedPages
        className="mt-12"
        title="Need help with an order?"
        links={relatedPageGroups.help}
      />
    </MarketingShell>
  );
}
