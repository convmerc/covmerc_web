"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { isAdminUser } from "@/lib/admin-access";

const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
  { href: "/contact", label: "Contact" }
] as const;

function navLinkClass(isActive: boolean) {
  return `block rounded-lg px-3 py-2 font-medium transition ${
    isActive ? "bg-white/15 text-furni-accent" : "text-white/90 hover:bg-white/10 hover:text-white"
  }`;
}

function centerLinkClass(isActive: boolean) {
  return `whitespace-nowrap font-medium transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:rounded-full after:bg-furni-accent after:transition after:duration-300 ${
    isActive
      ? "relative text-furni-accent after:scale-x-100"
      : "relative text-white/85 after:scale-x-0 hover:text-white hover:after:scale-x-100"
  }`;
}

export function TopNav() {
  const pathname = usePathname();
  const { cartCount } = useFurniStore();
  const { currentUser, logout } = useAuthSession();
  const isAdmin = isAdminUser(currentUser);
  const isVendor = currentUser?.userType === "vendor";
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  const mobileNavItems = [
    ...PUBLIC_NAV,
    ...(currentUser ? [{ href: "/account" as const, label: "Account" }] : [])
  ];

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
      <nav className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 md:gap-4 md:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-semibold tracking-tight md:text-2xl">Covmerc</span>
          <span className="hidden rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-furni-accent sm:inline">
            Studio
          </span>
        </Link>

        <div className="hidden min-w-0 justify-center md:flex">
          <div className="flex max-w-full items-center gap-4 overflow-x-auto px-1 text-sm lg:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PUBLIC_NAV.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link key={item.href} href={item.href} className={centerLinkClass(isActive)}>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-1.5 text-sm sm:gap-2 md:gap-2.5">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden rounded-full border border-furni-accent/50 bg-furni-accent px-2.5 py-1.5 text-xs font-semibold text-furni-primary shadow-sm transition hover:bg-furni-accent/90 lg:inline-flex lg:px-3"
            >
              Admin
            </Link>
          ) : isVendor ? (
            <Link
              href="/vendor"
              className="hidden rounded-full border border-white/25 px-2.5 py-1.5 text-xs font-medium text-white/90 transition hover:bg-white/10 lg:inline-flex lg:px-3"
            >
              Vendor
            </Link>
          ) : (
            <Link
              href="/sell"
              className="hidden rounded-full border border-furni-accent/40 bg-furni-accent/15 px-2.5 py-1.5 text-xs font-semibold text-furni-accent transition hover:bg-furni-accent/25 lg:inline-flex lg:px-3"
            >
              Sell
            </Link>
          )}

          <Link
            href="/cart"
            className={`rounded-full border px-2.5 py-1.5 transition sm:px-3 ${
              cartCount > 0
                ? "border-furni-accent/50 bg-furni-accent/15 text-furni-accent hover:bg-furni-accent/25"
                : "border-white/25 text-white hover:bg-white/10"
            }`}
          >
            <span className="sr-only">Cart</span>
            <span aria-hidden>Cart</span>
            {cartCount > 0 ? (
              <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-furni-accent px-1.5 text-[11px] font-bold text-furni-primary">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            ) : null}
          </Link>

          {currentUser ? (
            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/account"
                className="max-w-[7rem] truncate text-xs text-white/85 hover:text-white"
                title={currentUser.name}
              >
                {currentUser.name}
              </Link>
              <FurniButton
                variant="outline"
                className="border-white/30 px-2.5 py-1.5 text-xs text-white hover:bg-white/10"
                onClick={() => void logout()}
              >
                Sign out
              </FurniButton>
            </div>
          ) : (
            <div className="hidden items-center gap-1.5 lg:flex">
              <Link href="/auth/login">
                <FurniButton
                  variant="outline"
                  className="border-white/30 px-2.5 py-1.5 text-xs text-white hover:bg-white/10"
                >
                  Sign in
                </FurniButton>
              </Link>
              <Link href="/auth/register">
                <FurniButton variant="accent" className="px-2.5 py-1.5 text-xs">
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
      </nav>

      {mobileOpen ? (
        <div
          ref={mobilePanelRef}
          id="mobile-nav-panel"
          className="border-t border-white/10 bg-furni-primary px-4 py-4 shadow-lg md:hidden"
        >
          <div className="flex flex-col gap-1 text-sm">
            {mobileNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link key={item.href} href={item.href} className={navLinkClass(isActive)}>
                  {item.label}
                </Link>
              );
            })}
            {isAdmin ? (
              <Link href="/admin" className={navLinkClass(pathname.startsWith("/admin"))}>
                Admin dashboard
              </Link>
            ) : isVendor ? (
              <Link href="/vendor" className={navLinkClass(pathname.startsWith("/vendor"))}>
                Vendor portal
              </Link>
            ) : (
              <Link href="/sell" className={navLinkClass(pathname.startsWith("/sell"))}>
                Sell on Covmerc
              </Link>
            )}
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            {currentUser ? (
              <div className="space-y-2">
                <p className="px-3 text-xs text-white/70">Signed in as {currentUser.name}</p>
                <FurniButton
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                  onClick={() => void logout()}
                >
                  Sign out
                </FurniButton>
              </div>
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
    </header>
  );
}
