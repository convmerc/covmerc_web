"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { FurniButton } from "@/components/ui/FurniButton";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

export default function AccountWishlistPage() {
  const {
    products,
    wishlistProductIds,
    wishlistLoading,
    addToCart,
    storeLoading
  } = useFurniStore();

  const wishlistProducts = useMemo(
    () =>
      wishlistProductIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is NonNullable<typeof product> => Boolean(product)),
    [products, wishlistProductIds]
  );

  if (wishlistLoading || storeLoading) {
    return <LoadingState message="Loading your wishlist…" />;
  }

  if (wishlistProductIds.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product while signed in to save it here for later."
      >
        <Link href="/shop">
          <FurniButton variant="accent">Browse shop</FurniButton>
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-furni-primary">Saved items</h2>
        <p className="mt-1 text-sm text-furni-muted">
          {wishlistProducts.length}{" "}
          {wishlistProducts.length === 1 ? "piece" : "pieces"} saved for later.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {wishlistProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={(id) => addToCart(id, 1)}
          />
        ))}
      </div>

      {wishlistProductIds.length > wishlistProducts.length ? (
        <p className="text-xs text-furni-muted">
          Some saved items are no longer in the catalog and were hidden.
        </p>
      ) : null}
    </div>
  );
}
