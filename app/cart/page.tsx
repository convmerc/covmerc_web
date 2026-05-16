"use client";

import Link from "next/link";
import { FurniImage } from "@/components/ui/FurniImage";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { formatNgn } from "@/lib/format-currency";

export default function CartPage() {
  const {
    cartItems,
    products,
    cartSubtotal,
    updateCartItem,
    removeCartItem,
    clearCart
  } = useFurniStore();

  const detailedItems = cartItems
    .map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId)
    }))
    .filter((entry) => Boolean(entry.product));

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold text-furni-primary">Your Cart</h1>
        <p className="mt-2 text-sm text-furni-muted">
          Review your selected items before checkout.
        </p>

        {detailedItems.length === 0 ? (
          <FurniCard className="mt-6 text-center">
            <p className="text-sm text-furni-muted">Your cart is currently empty.</p>
            <Link href="/shop" className="mt-4 inline-block">
              <FurniButton>Continue shopping</FurniButton>
            </Link>
          </FurniCard>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr,320px]">
            <div className="space-y-3">
              {detailedItems.map((item) => {
                const product = item.product!;
                return (
                  <FurniCard key={product.id} className="grid gap-4 sm:grid-cols-[120px,1fr]">
                    <FurniImage
                      src={product.image}
                      alt={product.name}
                      variant="thumb"
                      className="rounded-xl"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-semibold text-furni-primary">
                            {product.name}
                          </h2>
                          <p className="text-sm text-furni-muted">{formatNgn(product.price)} each</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCartItem(product.id)}
                          className="text-xs font-medium text-furni-danger"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wide text-furni-muted">
                          Qty
                        </span>
                        <div className="inline-flex items-center rounded-xl border border-furni-primary/20 bg-white">
                          <button
                            type="button"
                            className="px-3 py-1.5 text-furni-primary"
                            onClick={() =>
                              updateCartItem(product.id, Math.max(1, item.quantity - 1))
                            }
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-3 py-1.5 text-furni-primary"
                            onClick={() => updateCartItem(product.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-furni-ink">
                          {formatNgn(item.quantity * product.price)}
                        </span>
                      </div>
                    </div>
                  </FurniCard>
                );
              })}
            </div>

            <FurniCard className="h-max">
              <h2 className="text-xl font-semibold text-furni-primary">Summary</h2>
              <div className="mt-4 space-y-2 text-sm text-furni-muted">
                <p className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-furni-ink">{formatNgn(cartSubtotal)}</span>
                </p>
                <p className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-furni-ink">Free</span>
                </p>
              </div>
              <p className="mt-4 flex items-center justify-between border-t border-furni-primary/10 pt-3 text-base font-semibold text-furni-primary">
                <span>Total</span>
                <span>{formatNgn(cartSubtotal)}</span>
              </p>
              <div className="mt-4 grid gap-2">
                <Link href="/checkout">
                  <FurniButton variant="accent" fullWidth>
                    Proceed to checkout
                  </FurniButton>
                </Link>
                <FurniButton variant="outline" fullWidth onClick={clearCart}>
                  Clear cart
                </FurniButton>
              </div>
            </FurniCard>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
