"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

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
      <div className="flex min-h-screen flex-col bg-furni-surface">
        <TopNav />
        <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-4 py-16">
          <p className="text-sm text-furni-muted">Loading your orders...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <header className="mb-6">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Account</p>
          <h1 className="mt-1 font-display text-4xl text-furni-primary">Your Orders</h1>
          <p className="mt-2 text-sm text-furni-muted">
            Signed in as {currentUser.name} ({currentUser.email})
          </p>
        </header>

        {storeLoading ? (
          <FurniCard>
            <p className="text-sm text-furni-muted">Loading orders...</p>
          </FurniCard>
        ) : orders.length === 0 ? (
          <FurniCard className="text-center">
            <p className="text-sm text-furni-muted">You have not placed any orders yet.</p>
            <Link href="/shop" className="mt-4 inline-block">
              <FurniButton>Browse shop</FurniButton>
            </Link>
          </FurniCard>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <FurniCard key={order.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-furni-primary">{order.id}</p>
                  <p className="text-sm text-furni-muted">
                    {order.createdAt} · {order.items} item{order.items === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-furni-ink">${order.total.toFixed(2)}</p>
                  <p className="text-xs uppercase tracking-wide text-furni-accent">{order.status}</p>
                  <p className="text-[11px] text-furni-muted">
                    {order.paymentStatus} · {order.paymentMethod}
                  </p>
                </div>
              </FurniCard>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
