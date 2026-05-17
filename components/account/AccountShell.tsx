"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/messages", label: "Messages" },
  { href: "/account/wishlist", label: "Wishlist" },
] as const;

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, authLoading } = useAuthSession();

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, currentUser, pathname, router]);

  if (authLoading || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col bg-furni-surface">
        <TopNav />
        <main className="mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-4 py-16">
          <p className="text-sm text-furni-muted">Loading your account…</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <SkipToContent />
      <TopNav />
      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
            Your account
          </p>
          <h1 className="mt-1 font-display text-4xl text-furni-primary">
            Hello, {currentUser.name}
          </h1>
          <p className="mt-2 text-sm text-furni-muted">{currentUser.email}</p>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2 border-b border-furni-primary/10 pb-4">
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/account" && pathname.startsWith(link.href));
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
          {currentUser.userType === "vendor" ? (
            <Link
              href="/vendor"
              className="rounded-full bg-furni-accent/30 px-4 py-2 text-sm font-medium text-furni-primary"
            >
              Vendor portal
            </Link>
          ) : null}
        </nav>

        {children}
      </main>
      <Footer />
    </div>
  );
}
