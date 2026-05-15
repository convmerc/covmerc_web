"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";

export function TopNav() {
  const pathname = usePathname();
  const { cartCount } = useFurniStore();
  const { currentUser, logout } = useAuthSession();
  const isAdmin = currentUser?.userType === "admin";

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/blog", label: "Blog" }
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-furni-primary/10 bg-furni-primary text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-semibold tracking-tight">
          Furni
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

        <div className="flex items-center gap-3 text-sm">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden rounded-full border border-furni-accent/40 bg-furni-accent/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-furni-accent md:inline-block"
            >
              Admin Access
            </Link>
          ) : null}
          <Link
            href="/cart"
            className="rounded-full border border-white/25 px-4 py-1.5 text-white transition hover:bg-white/10"
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
        </div>
      </nav>
    </header>
  );
}

