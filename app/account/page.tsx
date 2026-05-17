"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { AccountStatCard } from "@/components/account/AccountStatCard";
import { accountNavItems } from "@/components/account/account-nav";
import { SellOnCovmercPanel } from "@/components/sell/SellOnCovmercPanel";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { OrderStatusBadge } from "@/components/ui/OrderStatusBadge";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { formatNgn } from "@/lib/format-currency";
import { companyContact } from "@/lib/site-content";
import { canAccessVendorPortal } from "@/lib/vendor-onboarding";

function greeting(name: string) {
  const hour = new Date().getHours();
  const time =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const first = name.trim().split(/\s+/)[0] ?? name;
  return `${time}, ${first}`;
}

export default function AccountOverviewPage() {
  const { currentUser } = useAuthSession();
  const {
    orders,
    cartCount,
    wishlistProductIds,
    storeLoading,
    refreshOrders
  } = useFurniStore();

  const isVendor = canAccessVendorPortal(currentUser);

  useEffect(() => {
    if (currentUser) {
      void refreshOrders();
    }
  }, [currentUser, refreshOrders]);

  const recentOrder = orders[0] ?? null;

  const quickLinks = useMemo(
    () => accountNavItems.filter((item) => item.href !== "/account"),
    []
  );

  if (!currentUser) {
    return null;
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Overview</p>
        <h1 className="mt-1 font-display text-3xl text-furni-primary md:text-4xl">
          {greeting(currentUser.name)}
        </h1>
        <p className="mt-2 max-w-lg text-sm text-furni-muted">
          Manage orders, saved pieces, and delivery details from one place.
        </p>
      </header>

      <section aria-label="Account summary">
        <div className="grid gap-3 sm:grid-cols-3">
          <AccountStatCard
            label="Orders"
            value={storeLoading ? "—" : orders.length}
            hint={orders.length === 1 ? "1 purchase" : `${orders.length} purchases`}
            href="/account/orders"
            icon="📦"
          />
          <AccountStatCard
            label="Wishlist"
            value={wishlistProductIds.length}
            hint="Saved for later"
            href="/account/wishlist"
            icon="♥"
          />
          <AccountStatCard
            label="Cart"
            value={cartCount}
            hint={cartCount > 0 ? "Ready to checkout" : "Empty"}
            href="/cart"
            icon="🛒"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <FurniCard interactive={false} className="!p-0 overflow-hidden">
          <div className="border-b border-furni-primary/10 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-xl text-furni-primary">Recent order</h2>
              {orders.length > 0 ? (
                <Link
                  href="/account/orders"
                  className="text-sm font-medium text-furni-primary hover:underline"
                >
                  All orders
                </Link>
              ) : null}
            </div>
          </div>
          {storeLoading ? (
            <div className="p-5">
              <LoadingState variant="list" message="Loading orders…" count={1} />
            </div>
          ) : recentOrder ? (
            <Link
              href={`/account/orders/${recentOrder.id}`}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 transition hover:bg-furni-surface/80"
            >
              <div>
                <p className="font-semibold text-furni-primary">{recentOrder.id}</p>
                <p className="mt-1 text-sm text-furni-muted">
                  {recentOrder.createdAt} · {recentOrder.items} item
                  {recentOrder.items === 1 ? "" : "s"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-furni-ink">
                  {formatNgn(recentOrder.total)}
                </p>
                <div className="mt-2 flex justify-end">
                  <OrderStatusBadge status={recentOrder.status} />
                </div>
              </div>
            </Link>
          ) : (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-furni-muted">You have not placed an order yet.</p>
              <Link href="/shop" className="mt-4 inline-block">
                <FurniButton variant="accent" className="px-3 py-2 text-xs">
                  Browse the shop
                </FurniButton>
              </Link>
            </div>
          )}
        </FurniCard>

        <FurniCard interactive={false}>
          <h2 className="font-display text-xl text-furni-primary">Quick links</h2>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-furni-surface"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-furni-surface text-base"
                    aria-hidden
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-furni-primary">{item.label}</span>
                    <span className="block text-xs text-furni-muted">{item.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </FurniCard>
      </section>

      {isVendor ? (
        <FurniCard className="bg-furni-primary text-white" interactive={false}>
          <h2 className="font-display text-xl text-furni-accent">Vendor portal</h2>
          <p className="mt-2 text-sm text-white/85">
            Manage listings, inventory, and vendor orders from your dashboard.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/vendor">
              <FurniButton variant="accent">Open vendor portal</FurniButton>
            </Link>
            <Link href="/sell">
              <FurniButton
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Selling guide
              </FurniButton>
            </Link>
          </div>
        </FurniCard>
      ) : (
        <SellOnCovmercPanel variant="compact" />
      )}

      <FurniCard interactive={false} className="bg-furni-surface/60">
        <h2 className="font-display text-lg text-furni-primary">Need help?</h2>
        <p className="mt-2 text-sm text-furni-muted">
          Our team in Ibadan can help with orders, delivery, and returns.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/support">
            <FurniButton variant="outline" className="px-3 py-2 text-xs">
              Help center
            </FurniButton>
          </Link>
          <Link href="/contact">
            <FurniButton variant="outline" className="px-3 py-2 text-xs">
              Contact us
            </FurniButton>
          </Link>
          <a href={`mailto:${companyContact.supportEmail}`}>
            <FurniButton variant="ghost" className="px-3 py-2 text-xs">
              {companyContact.supportEmail}
            </FurniButton>
          </a>
        </div>
      </FurniCard>
    </div>
  );
}
