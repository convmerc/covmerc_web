"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/TrustBar";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniImage } from "@/components/ui/FurniImage";
import { formatNgn } from "@/lib/format-currency";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { ProductReviews } from "@/components/product/ProductReviews";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const { products, addToCart } = useFurniStore();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((entry) => entry.id === params.id);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((entry) => entry.category === product.category && entry.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (!product) {
    return (
      <MarketingShell maxWidth="4xl">
        <EmptyState
          title="Product not found"
          description="This item may have been removed from our catalog. Browse the shop for similar pieces."
        >
          <Link href="/shop">
            <FurniButton variant="accent">Back to shop</FurniButton>
          </Link>
        </EmptyState>
      </MarketingShell>
    );
  }

  const displayCategory = product.categoryName || product.category;

  return (
    <>
      <ProductJsonLd product={product} />
      <MarketingShell maxWidth="6xl" flush className="pb-0">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Shop", href: "/shop" },
            { label: displayCategory, href: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name }
          ]}
        />

        <section className="grid gap-8 lg:grid-cols-[1.1fr,1fr] lg:items-start">
          <FurniImage
            src={product.image}
            alt={product.name}
            variant="detail"
            className="min-h-[340px] rounded-3xl"
            priority
          />

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-furni-muted">
              {displayCategory}
            </p>
            <h1 className="font-display text-4xl text-furni-primary">{product.name}</h1>
            <p className="text-2xl font-semibold text-furni-ink">{formatNgn(product.price)}</p>
            {product.discount > 0 && product.originalPrice > product.price ? (
              <p className="text-sm text-furni-muted">
                Was{" "}
                <span className="line-through">{formatNgn(product.originalPrice)}</span>
                <span className="ml-2 font-medium text-furni-accent">
                  Save {product.discount}%
                </span>
              </p>
            ) : null}
            <p className="text-sm leading-relaxed text-furni-muted">{product.description}</p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-furni-muted">Quantity</span>
              <div className="inline-flex items-center rounded-xl border border-furni-primary/20 bg-white">
                <button
                  type="button"
                  className="px-3 py-2 text-furni-primary hover:bg-furni-primary/5"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-furni-primary hover:bg-furni-primary/5"
                  onClick={() => setQuantity((value) => value + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <FurniButton variant="accent" onClick={() => addToCart(product.id, quantity)}>
                Add to cart
              </FurniButton>
              <Link href="/checkout">
                <FurniButton variant="outline">Buy now</FurniButton>
              </Link>
              <Link href="/support">
                <FurniButton variant="ghost">Ask about this piece</FurniButton>
              </Link>
            </div>

            <FurniCard className="rounded-2xl">
              <h2 className="font-display text-lg text-furni-primary">Specifications</h2>
              <dl className="mt-3 grid gap-2 text-sm text-furni-muted">
                <div className="flex justify-between gap-4 border-b border-furni-primary/10 pb-2">
                  <dt>Material</dt>
                  <dd className="text-right text-furni-ink">{product.specs.material}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-furni-primary/10 pb-2">
                  <dt>Dimensions</dt>
                  <dd className="text-right text-furni-ink">{product.specs.dimensions}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-furni-primary/10 pb-2">
                  <dt>Weight</dt>
                  <dd className="text-right text-furni-ink">{product.specs.weight}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Finish</dt>
                  <dd className="text-right text-furni-ink">{product.specs.finish}</dd>
                </div>
              </dl>
            </FurniCard>
          </div>
        </section>

        <section className="mt-14 border-t border-furni-primary/10 pt-12">
          <ProductReviews productId={product.id} fallbackRating={product.rating} />
        </section>

        {relatedProducts.length > 0 ? (
          <section className="mt-14 border-t border-furni-primary/10 pt-12">
            <h2 className="font-display text-2xl text-furni-primary">You may also like</h2>
            <p className="mt-1 text-sm text-furni-muted">More from {displayCategory}</p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onAddToCart={(id) => addToCart(id, 1)}
                  layout="compact"
                />
              ))}
            </div>
          </section>
        ) : null}
      </MarketingShell>
      <TrustBar />
    </>
  );
}
