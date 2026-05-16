"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniImage } from "@/components/ui/FurniImage";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { fetchVendorProducts } from "@/lib/store-marketplace";
import type { FurniProduct } from "@/lib/furni-types";
import { formatNgn } from "@/lib/format-currency";

function statusClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved" || normalized === "active") {
    return "bg-furni-success/20 text-furni-success";
  }
  if (normalized === "pending") {
    return "bg-furni-warning/20 text-furni-warning";
  }
  if (normalized === "rejected") {
    return "bg-red-100 text-red-700";
  }
  return "bg-slate-100 text-slate-700";
}

export default function VendorProductsPage() {
  const { currentUser } = useAuthSession();
  const [products, setProducts] = useState<FurniProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    void (async () => {
      setLoading(true);
      try {
        setProducts(await fetchVendorProducts(currentUser.id));
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser?.id]);

  if (loading) {
    return (
      <FurniCard>
        <p className="text-sm text-furni-muted">Loading your products…</p>
      </FurniCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-furni-muted">
          Listings sync from Firestore. New products require admin approval before appearing on the
          shop.
        </p>
        <Link href="/vendor/products/new">
          <FurniButton variant="accent">Add product</FurniButton>
        </Link>
      </div>

      {products.length === 0 ? (
        <FurniCard>
          <h2 className="font-display text-xl text-furni-primary">No products yet</h2>
          <p className="mt-2 text-sm text-furni-muted">
            Create your first listing on the web or add products from the Covmerc mobile app.
          </p>
        </FurniCard>
      ) : (
    <ul className="space-y-3">
      {products.map((product) => (
        <li key={product.id}>
          <FurniCard className="flex flex-wrap items-center gap-4">
            <FurniImage
              src={product.image}
              alt={product.name}
              variant="thumb"
              className="h-20 w-20 shrink-0 rounded-xl"
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-furni-primary">{product.name}</p>
              <p className="mt-1 text-sm text-furni-muted">
                {product.categoryName || product.category} · Stock {product.stock}
              </p>
              <p className="mt-1 text-sm font-medium text-furni-ink">{formatNgn(product.price)}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusClass(product.status)}`}
            >
              {product.status}
            </span>
          </FurniCard>
        </li>
      ))}
    </ul>
      )}
    </div>
  );
}
