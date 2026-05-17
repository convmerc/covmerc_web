"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";

const links = [
  { href: "/vendor", label: "Overview" },
  { href: "/vendor/products", label: "My products" },
  { href: "/vendor/orders", label: "Orders" },
] as const;

export function VendorShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, authLoading } = useAuthSession();

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser) {
      router.replace("/auth/login?next=/vendor");
      return;
    }
    if (currentUser.userType !== "vendor" && currentUser.userType !== "admin") {
      router.replace("/shop");
    }
  }, [authLoading, currentUser, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col bg-furni-surface">
        <SkipToContent />
        <TopNav />
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
          <LoadingState variant="page" message="Loading vendor portal…" className="w-full" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <SkipToContent />
      <TopNav />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
              Vendor portal
            </p>
            <h1 className="mt-1 font-display text-4xl text-furni-primary">
              Sell on Covmerc
            </h1>
            <p className="mt-2 text-sm text-furni-muted">
              Manage listings, track orders, and grow your furniture business on
              the web.
            </p>
          </div>
          <Link
            href="/account"
            className="text-sm font-medium text-furni-primary underline hover:text-furni-ink"
          >
            Customer account
          </Link>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-furni-primary/10 pb-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-furni-primary text-white"
                    : "bg-white text-furni-primary ring-1 ring-furni-primary/15 hover:bg-furni-primary/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </main>
      <Footer />
    </div>
  );
}
