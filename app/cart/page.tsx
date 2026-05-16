"use client";

import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/shop/ProductCard";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniImage } from "@/components/ui/FurniImage";
import { formatNgn } from "@/lib/format-currency";
import { relatedPageGroups } from "@/lib/site-content";

export default function CartPage() {
  const {
    cartItems,
    products,
    cartSubtotal,
    updateCartItem,
    removeCartItem,
    clearCart,
    addToCart
  } = useFurniStore();

  const detailedItems = cartItems
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId)
    }))
    .filter((entry) => Boolean(entry.product));

  const suggested = products.filter((p) => !cartItems.some((c) => c.productId === p.id)).slice(0, 3);

  return (
    <MarketingShell maxWidth="6xl">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Cart" }
        ]}
      />

      <PageHero
        eyebrow="Your bag"
        title="Review your cart"
        description="Confirm quantities and totals before checkout. Prices are in Nigerian Naira; delivery is calculated at the next step."
      />

      {detailedItems.length === 0 ? (
        <EmptyState
          icon="cart"
          title="Your cart is empty"
          description="Browse our catalog and add pieces you love—you can check out as a guest or with your Covmerc account."
        >
          <Link href="/shop">
            <FurniButton variant="accent">Shop collection</FurniButton>
          </Link>
          <Link href="/">
            <FurniButton variant="outline">Back to home</FurniButton>
          </Link>
        </EmptyState>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
          <div className="space-y-4">
            {detailedItems.map((item) => {
              const product = item.product!;
              return (
                <FurniCard
                  key={product.id}
                  className="grid gap-4 overflow-hidden p-0 sm:grid-cols-[140px,1fr]"
                >
                  <Link href={`/product/${product.id}`} className="block">
                    <FurniImage
                      src={product.image}
                      alt={product.name}
                      variant="thumb"
                      className="h-full min-h-[120px] rounded-none sm:min-h-full"
                    />
                  </Link>
                  <div className="flex flex-col justify-between gap-3 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-furni-muted">
                          {product.categoryName || product.category}
                        </p>
                        <Link href={`/product/${product.id}`}>
                          <h2 className="text-lg font-semibold text-furni-primary hover:underline">
                            {product.name}
                          </h2>
                        </Link>
                        <p className="mt-1 text-sm text-furni-muted">
                          {formatNgn(product.price)} each
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCartItem(product.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-xl border border-furni-primary/15 bg-furni-surface">
                        <button
                          type="button"
                          className="px-3 py-2 text-furni-primary hover:bg-furni-primary/5"
                          onClick={() =>
                            updateCartItem(product.id, Math.max(1, item.quantity - 1))
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-2 text-furni-primary hover:bg-furni-primary/5"
                          onClick={() => updateCartItem(product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-base font-semibold text-furni-ink">
                        {formatNgn(item.quantity * product.price)}
                      </p>
                    </div>
                  </div>
                </FurniCard>
              );
            })}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <FurniCard className="p-6">
              <h2 className="font-display text-xl text-furni-primary">Order summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-furni-muted">
                  <dt>Subtotal</dt>
                  <dd className="font-medium text-furni-ink">{formatNgn(cartSubtotal)}</dd>
                </div>
                <div className="flex justify-between text-furni-muted">
                  <dt>Shipping</dt>
                  <dd className="font-medium text-furni-primary">Calculated at checkout</dd>
                </div>
              </dl>
              <p className="mt-5 flex justify-between border-t border-furni-primary/10 pt-4 text-base font-semibold text-furni-primary">
                <span>Estimated total</span>
                <span>{formatNgn(cartSubtotal)}</span>
              </p>
              <div className="mt-6 grid gap-2">
                <Link href="/checkout">
                  <FurniButton variant="accent" fullWidth>
                    Proceed to checkout
                  </FurniButton>
                </Link>
                <Link href="/shop">
                  <FurniButton variant="outline" fullWidth>
                    Continue shopping
                  </FurniButton>
                </Link>
                <FurniButton variant="ghost" fullWidth onClick={clearCart} className="text-furni-muted">
                  Clear cart
                </FurniButton>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-furni-muted">
                Secure checkout · Need help?{" "}
                <Link href="/support" className="font-medium text-furni-primary hover:underline">
                  Visit support
                </Link>
              </p>
            </FurniCard>
          </aside>
        </div>
      )}

      {suggested.length > 0 && detailedItems.length > 0 ? (
        <section className="mt-16 border-t border-furni-primary/10 pt-12">
          <h2 className="font-display text-2xl text-furni-primary">You might also like</h2>
          <p className="mt-1 text-sm text-furni-muted">Complete your room with these picks.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {suggested.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={(id) => addToCart(id, 1)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <RelatedPages
        className="mt-12"
        title="Help & policies"
        links={[...relatedPageGroups.help, ...relatedPageGroups.legal]}
      />
    </MarketingShell>
  );
}
