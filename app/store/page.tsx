"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getFirebase } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

type Product = {
  id: string;
  name: string;
  description: string;
  price: string;
  badge?: string;
};

const demoProducts: Product[] = [
  {
    id: "fresh-basket",
    name: "Fresh Basket Essentials",
    description: "Curated fruits, vegetables, and pantry items from nearby vendors.",
    price: "₦8,500",
    badge: "Popular"
  },
  {
    id: "artisan-bread",
    name: "Artisan Bread Box",
    description: "Daily baked loaves and pastries from verified neighborhood bakeries.",
    price: "₦5,200"
  },
  {
    id: "care-pack",
    name: "Home Care Pack",
    description: "Detergents, toiletries, and cleaning supplies bundled for weekly restocks.",
    price: "₦6,750",
    badge: "New"
  }
];

export default function StorePage() {
  const [user, setUser] = useState<User | null>(null);
  const [lastOrderMessage, setLastOrderMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebase().auth, (next) => setUser(next));
    return () => unsub();
  }, []);

  function handleOrder(product: Product) {
    if (!user) {
      return;
    }

    setLastOrderMessage(
      `Demo only: an order for “${product.name}” would be created for ${user.email ?? "this account"}.`
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-covmerc-grayLight">
      <TopNav />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 md:px-6 lg:px-0">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-covmerc-textLight">
              Marketplace
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-covmerc-black md:text-3xl">
              Browse items from local vendors
            </h1>
            <p className="mt-2 max-w-xl text-sm text-covmerc-textLight">
              You can explore products without an account.{" "}
              <span className="font-medium text-covmerc-black">
                Signing in is only required when you want to place an order.
              </span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-xs md:items-end">
            {user ? (
              <>
                <p className="text-covmerc-textLight">
                  Signed in as <span className="font-medium">{user.email}</span>
                </p>
                <p className="text-[11px] text-covmerc-textLight">
                  Connect this page to your Firestore `products` and `orders` collections
                  to power real orders.
                </p>
              </>
            ) : (
              <>
                <p className="text-covmerc-textLight">
                  You&apos;re browsing as a guest.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="rounded-full border border-covmerc-primary/30 px-3 py-1.5 text-xs font-medium text-covmerc-primary hover:bg-covmerc-primary/5"
                  >
                    Sign in to order
                  </Link>
                  <Link
                    href="/auth/register"
                    className="rounded-full bg-covmerc-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft hover:bg-covmerc-primary/90"
                  >
                    Create free account
                  </Link>
                </div>
              </>
            )}
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-3">
          {demoProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold text-covmerc-black">
                    {product.name}
                  </h2>
                  {product.badge ? (
                    <span className="rounded-full bg-covmerc-secondary/10 px-2 py-0.5 text-[10px] font-medium text-covmerc-secondary">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <p className="text-xs leading-relaxed text-covmerc-textLight">
                  {product.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-covmerc-black">
                  {product.price}
                </p>

                {user ? (
                  <button
                    type="button"
                    onClick={() => handleOrder(product)}
                    className="rounded-full bg-covmerc-primary px-3 py-1.5 text-xs font-medium text-white shadow-soft transition hover:bg-covmerc-primary/90"
                  >
                    Order now
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="rounded-full border border-covmerc-primary/30 px-3 py-1.5 text-xs font-medium text-covmerc-primary transition hover:bg-covmerc-primary/5"
                  >
                    Sign in to order
                  </Link>
                )}
              </div>
            </article>
          ))}
        </section>

        {lastOrderMessage && (
          <div className="mt-2 rounded-2xl bg-covmerc-primary/5 p-3 text-xs text-covmerc-textLight ring-1 ring-covmerc-primary/10">
            {lastOrderMessage}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

