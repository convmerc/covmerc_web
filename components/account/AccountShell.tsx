"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { AccountNav } from "@/components/account/AccountNav";
import { AccountPageHeader } from "@/components/account/AccountPageHeader";
import { AccountProfileCard } from "@/components/account/AccountProfileCard";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { isAdminUser } from "@/lib/admin-access";
import { canAccessVendorPortal } from "@/lib/vendor-onboarding";

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, authLoading } = useAuthSession();
  const isOverview = pathname === "/account";
  const isAdmin = isAdminUser(currentUser);
  const showVendorPortal = !isAdmin && canAccessVendorPortal(currentUser);

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, currentUser, pathname, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col bg-furni-surface">
        <TopNav />
        <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-16">
          <LoadingState variant="page" message="Loading your account…" className="w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <SkipToContent />
      <TopNav />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-10 lg:px-8">
        <div className="mb-6 lg:hidden">
          <AccountProfileCard />
          <div className="mt-4">
            <AccountNav variant="horizontal" />
          </div>
          {isAdmin ? (
            <Link
              href="/admin"
              className="mt-3 flex items-center justify-center rounded-2xl bg-furni-accent px-4 py-2.5 text-sm font-semibold text-furni-primary"
            >
              Admin dashboard →
            </Link>
          ) : showVendorPortal ? (
            <Link
              href="/vendor"
              className="mt-3 flex items-center justify-center rounded-2xl bg-furni-accent/30 px-4 py-2.5 text-sm font-semibold text-furni-primary"
            >
              Vendor portal →
            </Link>
          ) : null}
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <aside className="hidden w-72 shrink-0 lg:block">
            <AccountProfileCard />
            <div className="mt-4 rounded-3xl border border-furni-primary/10 bg-white p-3 shadow-soft">
              <AccountNav variant="sidebar" />
            </div>
            {isAdmin ? (
              <Link
                href="/admin"
                className="mt-3 flex items-center gap-2 rounded-2xl bg-furni-accent px-4 py-3 text-sm font-semibold text-furni-primary shadow-soft transition hover:bg-furni-accent/90"
              >
                <span aria-hidden>⚙</span>
                Admin dashboard
              </Link>
            ) : showVendorPortal ? (
              <Link
                href="/vendor"
                className="mt-3 flex items-center gap-2 rounded-2xl bg-furni-primary px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-furni-primary/90"
              >
                <span aria-hidden>🏪</span>
                Vendor portal
              </Link>
            ) : (
              <Link
                href="/sell"
                className="mt-3 flex items-center gap-2 rounded-2xl border border-furni-primary/15 bg-white px-4 py-3 text-sm font-semibold text-furni-primary shadow-sm transition hover:bg-furni-surface"
              >
                <span aria-hidden>✦</span>
                Sell on Covmerc
              </Link>
            )}
          </aside>

          <div className="min-w-0 flex-1">
            {!isOverview ? <AccountPageHeader /> : null}
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
