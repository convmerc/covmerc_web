"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import {
  fetchBusinessByUserId,
  fetchVendorOrders,
  fetchVendorProducts,
} from "@/lib/store-marketplace";
import type { CovmercBusiness } from "@/lib/marketplace-types";
import type { FurniOrder, FurniProduct } from "@/lib/furni-types";
import { formatNgn } from "@/lib/format-currency";

export default function VendorOverviewPage() {
  const { currentUser } = useAuthSession();
  const [business, setBusiness] = useState<CovmercBusiness | null>(null);
  const [products, setProducts] = useState<FurniProduct[]>([]);
  const [orders, setOrders] = useState<FurniOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;

    void (async () => {
      setLoading(true);
      try {
        const [biz, vendorProducts, vendorOrders] = await Promise.all([
          fetchBusinessByUserId(currentUser.id),
          fetchVendorProducts(currentUser.id),
          fetchVendorOrders(currentUser.id),
        ]);
        setBusiness(biz);
        setProducts(vendorProducts);
        setOrders(vendorOrders);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.id]);

  const stats = useMemo(() => {
    const approved = products.filter((p) =>
      ["approved", "active"].includes(p.status.toLowerCase()),
    ).length;
    const pending = products.filter((p) => p.status.toLowerCase() === "pending").length;
    const revenue = orders.reduce((sum, order) => sum + order.total, 0);
    return { approved, pending, revenue, orderCount: orders.length };
  }, [products, orders]);

  if (loading) {
    return (
      <FurniCard>
        <p className="text-sm text-furni-muted">Loading vendor dashboard…</p>
      </FurniCard>
    );
  }

  return (
    <div className="space-y-6">
      {business ? (
        <FurniCard>
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Your business</p>
          <h2 className="mt-1 font-display text-2xl text-furni-primary">
            {business.businessName}
          </h2>
          <p className="mt-2 text-sm text-furni-muted">{business.businessDescription}</p>
          <p className="mt-2 text-xs text-furni-muted">
            Status: <span className="font-medium capitalize">{business.status}</span>
          </p>
        </FurniCard>
      ) : (
        <FurniCard>
          <h2 className="font-display text-xl text-furni-primary">Business profile</h2>
          <p className="mt-2 text-sm text-furni-muted">
            Complete your business details in the Covmerc app to appear on product listings.
          </p>
        </FurniCard>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FurniCard>
          <p className="text-xs text-furni-muted">Listed products</p>
          <p className="mt-1 text-2xl font-semibold text-furni-primary">{products.length}</p>
        </FurniCard>
        <FurniCard>
          <p className="text-xs text-furni-muted">Live on storefront</p>
          <p className="mt-1 text-2xl font-semibold text-furni-primary">{stats.approved}</p>
        </FurniCard>
        <FurniCard>
          <p className="text-xs text-furni-muted">Pending approval</p>
          <p className="mt-1 text-2xl font-semibold text-furni-primary">{stats.pending}</p>
        </FurniCard>
        <FurniCard>
          <p className="text-xs text-furni-muted">Orders</p>
          <p className="mt-1 text-2xl font-semibold text-furni-primary">{stats.orderCount}</p>
          <p className="mt-1 text-sm text-furni-muted">{formatNgn(stats.revenue)} total</p>
        </FurniCard>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link href="/vendor/products">
          <FurniButton variant="accent">Manage products</FurniButton>
        </Link>
        <Link href="/vendor/orders">
          <FurniButton variant="outline">View orders</FurniButton>
        </Link>
      </div>
    </div>
  );
}
