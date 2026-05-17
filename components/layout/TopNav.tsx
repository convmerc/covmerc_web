"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const isVendor =
    currentUser?.userType === "vendor" || currentUser?.userType === "admin";
  const showSellLink = !isVendor;
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const navItems: Array<{ href: string; label: string }> = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" },
    { href: "/support", label: "Support" },
    { href: "/contact", label: "Contact" }
  ];

  if (!isVendor) {
    navItems.push({ href: "/sell", label: "Sell" });
  }

  if (currentUser) {
    navItems.push({ href: "/account", label: "Account" });
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

  useEffect(() => {
    if (!mobileOpen || !mobilePanelRef.current) return;

    const panel = mobilePanelRef.current;
    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
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
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative font-medium transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-furni-accent after:transition after:duration-300 ${
                  isActive
                    ? "text-furni-accent after:scale-x-100"
                    : "text-white/85 after:scale-x-0 hover:text-white hover:after:scale-x-100"
                }`}
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
          {isVendor ? (
            <Link
              href="/vendor"
              className="hidden rounded-full border border-white/25 px-3 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/10 md:inline-flex"
            >
              Vendor
            </Link>
          ) : showSellLink ? (
            <Link
              href="/sell"
              className="hidden rounded-full border border-furni-accent/40 bg-furni-accent/15 px-3 py-1.5 text-xs font-semibold text-furni-accent transition hover:bg-furni-accent/25 md:inline-flex"
            >
              Sell
            </Link>
          ) : null}
          <Link
            href="/cart"
            className={`relative rounded-full border px-3 py-1.5 transition md:px-4 ${
              cartCount > 0
                ? "border-furni-accent/50 bg-furni-accent/15 text-furni-accent hover:bg-furni-accent/25"
                : "border-white/25 text-white hover:bg-white/10"
            }`}
          >
            Cart
            {cartCount > 0 ? (
              <span className="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-furni-accent px-1.5 text-[11px] font-bold text-furni-primary">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
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
            ref={mobilePanelRef}
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
              {isVendor ? (
                <Link href="/vendor" className={navLinkClass(pathname.startsWith("/vendor"))}>
                  Vendor portal
                </Link>
              ) : (
                <Link href="/sell" className={navLinkClass(pathname.startsWith("/sell"))}>
                  Sell on Covmerc
                </Link>
              )}
              {currentUser ? (
                <Link href="/account" className={navLinkClass(pathname.startsWith("/account"))}>
                  Account
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
