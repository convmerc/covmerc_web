"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaInfoCircle,
  FaUserCircle,
  FaEnvelope,
  FaHome,
  FaNewspaper,
  FaSignOutAlt,
  FaSignInAlt,
  FaShieldAlt,
  FaUserPlus
} from "react-icons/fa";

export function TopNav() {
  const pathname = usePathname();
  const { cartCount } = useFurniStore();
  const { currentUser, logout } = useAuthSession();
  const isAdmin = currentUser?.userType === "admin";

  const navItems = [
    { href: "/", label: "Home", Icon: FaHome },
    { href: "/shop", label: "Shop", Icon: FaShoppingBag },
    { href: "/about", label: "About", Icon: FaInfoCircle },
    { href: "/blog", label: "Blog", Icon: FaNewspaper },
    { href: "/contact", label: "Contact", Icon: FaEnvelope }
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-furni-primary/15 bg-furni-primary/95 text-white backdrop-blur-lg">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-semibold tracking-tight">Covmerc</span>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-furni-accent">
            Studio
          </span>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1.5 font-medium transition ${isActive ? "text-furni-accent" : "text-white/85 hover:text-white"}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-sm">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden items-center gap-1 rounded-full border border-furni-accent/40 bg-furni-accent/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-furni-accent md:inline-flex"
            >
              <FaShieldAlt className="h-3.5 w-3.5" />
              Admin Access
            </Link>
          ) : null}
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-4 py-1.5 text-white transition hover:bg-white/10"
          >
            <FaShoppingCart className="h-4 w-4" />
            Cart ({cartCount})
          </Link>
          {currentUser ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="inline-flex items-center gap-1 text-xs text-white/85">
                <FaUserCircle className="h-3.5 w-3.5" />
                {currentUser.name}
              </span>
              <FurniButton
                variant="outline"
                className="inline-flex items-center gap-1.5 border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                onClick={logout}
              >
                <FaSignOutAlt className="h-3.5 w-3.5" />
                Sign out
              </FurniButton>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link href="/auth/login">
                <FurniButton
                  variant="outline"
                  className="inline-flex items-center gap-1.5 border-white/30 px-3 py-1.5 text-xs text-white hover:bg-white/10"
                >
                  <FaSignInAlt className="h-3.5 w-3.5" />
                  Sign in
                </FurniButton>
              </Link>
              <Link href="/auth/register">
                <FurniButton variant="accent" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs">
                  <FaUserPlus className="h-3.5 w-3.5" />
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

