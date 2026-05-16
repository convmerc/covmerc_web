"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";

function navLinkClass(isActive: boolean) {
  return `block rounded-lg px-3 py-2 font-medium transition ${
    isActive ? "bg-white/15 text-furni-accent" : "text-white/90 hover:bg-white/10 hover:text-white"
  }`;
}

export function TopNav() {
  const pathname = usePathname();
  const { cartCount } = useFurniStore();
  const { currentUser, logout } = useAuthSession();
  const isAdmin = currentUser?.userType === "admin";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: Array<{ href: string; label: string }> = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" }
  ];

  if (currentUser) {
    navItems.push({ href: "/account/orders", label: "Orders" });
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-furni-primary/15 bg-furni-primary/95 text-white backdrop-blur-lg">
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight">Covmerc</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-furni-accent">
            Studio
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`font-medium transition ${isActive ? "text-furni-accent" : "text-white/85 hover:text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-sm md:gap-3">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden rounded-full border border-furni-accent/40 bg-furni-accent/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-furni-accent md:inline-flex"
            >
              Admin Access
            </Link>
          ) : null}
          <Link
            href="/cart"
            className="rounded-full border border-white/25 px-3 py-1.5 text-white transition hover:bg-white/10 md:px-4"
          >
            Cart ({cartCount})
          </Link>
          {currentUser ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs text-white/85">{currentUser.name}</span>
              <FurniButton
                variant="outline"
                className="border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                onClick={logout}
              >
                Sign out
              </FurniButton>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/login">
                <FurniButton
                  variant="outline"
                  className="border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                >
                  Sign in
                </FurniButton>
              </Link>
              <Link href="/auth/register">
                <FurniButton variant="accent" className="px-3 py-1.5 text-xs">
                  Register
                </FurniButton>
              </Link>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10 md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen ? (
          <div
            id="mobile-nav-panel"
            className="absolute inset-x-0 top-full border-t border-white/10 bg-furni-primary px-4 py-4 shadow-lg md:hidden"
          >
            <div className="flex flex-col gap-1 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(pathname === item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
              {isAdmin ? (
                <Link href="/admin" className={navLinkClass(pathname.startsWith("/admin"))}>
                  Admin Access
                </Link>
              ) : null}
              {currentUser ? (
                <>
                  <p className="px-3 text-xs text-white/70">Signed in as {currentUser.name}</p>
                  <FurniButton
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                    onClick={logout}
                  >
                    Sign out
                  </FurniButton>
                </>
              ) : (
                <div className="grid gap-2">
                  <Link href="/auth/login">
                    <FurniButton
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      Sign in
                    </FurniButton>
                  </Link>
                  <Link href="/auth/register">
                    <FurniButton variant="accent" className="w-full">
                      Register
                    </FurniButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
