"use client";

import { FurniImage } from "@/components/ui/FurniImage";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { formatNgn } from "@/lib/format-currency";

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
      <div className="flex min-h-screen flex-col bg-furni-surface">
        <TopNav />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-4 py-20 text-center md:px-6">
          <div>
            <h1 className="text-3xl font-semibold text-furni-primary">Product not found</h1>
            <p className="mt-2 text-sm text-furni-muted">
              This product may have been removed from inventory.
            </p>
            <Link href="/shop" className="mt-4 inline-block">
              <FurniButton>Back to shop</FurniButton>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
          <FurniImage
            src={product.image}
            alt={product.name}
            variant="detail"
            className="min-h-[340px] rounded-3xl"
          />

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
              {product.category}
            </p>
            <h1 className="text-4xl font-semibold text-furni-primary">{product.name}</h1>
            <p className="text-2xl font-semibold text-furni-ink">{formatNgn(product.price)}</p>
            <p className="text-sm leading-relaxed text-furni-muted">{product.description}</p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-sm text-furni-muted">Quantity</span>
              <div className="inline-flex items-center rounded-xl border border-furni-primary/20 bg-white">
                <button
                  type="button"
                  className="px-3 py-2 text-furni-primary"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  −
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  type="button"
                  className="px-3 py-2 text-furni-primary"
                  onClick={() => setQuantity((value) => value + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <FurniButton onClick={() => addToCart(product.id, quantity)}>
                Add to cart
              </FurniButton>
              <Link href="/checkout">
                <FurniButton variant="accent">Buy now</FurniButton>
              </Link>
            </div>

            <FurniCard className="rounded-2xl">
              <h2 className="text-lg font-semibold text-furni-primary">Specifications</h2>
              <dl className="mt-3 grid gap-2 text-sm text-furni-muted">
                <div className="flex justify-between gap-4 border-b border-furni-primary/10 pb-2">
                  <dt>Material</dt>
                  <dd>{product.specs.material}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-furni-primary/10 pb-2">
                  <dt>Dimensions</dt>
                  <dd>{product.specs.dimensions}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-furni-primary/10 pb-2">
                  <dt>Weight</dt>
                  <dd>{product.specs.weight}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Finish</dt>
                  <dd>{product.specs.finish}</dd>
                </div>
              </dl>
            </FurniCard>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold text-furni-primary">Related Products</h2>
          <div className="mt-4 flex snap-x gap-4 overflow-x-auto pb-2">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="min-w-[260px] snap-start"
              >
                <FurniCard className="overflow-hidden p-0">
                  <FurniImage src={item.image} alt={item.name} variant="card" />
                  <div className="space-y-1 p-3">
                    <p className="text-sm font-semibold text-furni-primary">{item.name}</p>
                    <p className="text-xs text-furni-muted">${item.price}</p>
                  </div>
                </FurniCard>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
