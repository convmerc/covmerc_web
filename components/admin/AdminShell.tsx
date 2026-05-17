"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { MANAGED_COLLECTIONS } from "@/lib/admin-collections";

const PRIMARY_LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/content", label: "Content" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/announcements", label: "Announcements" },
  { href: "/admin/data", label: "Data manager" }
] as const;

function linkActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuthSession();

  return (
    <div className="min-h-screen bg-furni-surface covmerc-surface-texture">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[240px,1fr] md:px-6">
        <aside className="rounded-3xl bg-furni-primary p-5 text-white shadow-soft lg:sticky lg:top-6 lg:self-start">
          <p className="covmerc-eyebrow-light">Covmerc Admin</p>
          <p className="mt-1 text-xl font-semibold">Operations</p>
          <p className="mt-2 truncate text-xs text-white/70">{currentUser?.email}</p>

          <nav className="mt-8 grid gap-1.5 text-sm">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href as Route}
                className={`rounded-xl px-3 py-2 transition ${
                  linkActive(pathname, link.href)
                    ? "bg-white text-furni-primary"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 border-t border-white/15 pt-4">
            <p className="covmerc-eyebrow-light mb-2">Collections</p>
            <div className="grid max-h-48 gap-1 overflow-y-auto pr-1 text-xs">
              {MANAGED_COLLECTIONS.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/admin/data/${collection.id}` as Route}
                  className={`rounded-lg border px-2.5 py-1.5 transition ${
                    pathname === `/admin/data/${collection.id}`
                      ? "border-white bg-white/15"
                      : "border-white/15 hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold">{collection.label}</p>
                  <p className="text-white/60">
                    {collection.readOnly ? "Read-only" : "Writable"}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/15 pt-4">
            <Link
              href="/shop"
              className="rounded-xl border border-white/25 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
            >
              View storefront
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-xl border border-white/25 px-3 py-2 text-xs font-medium uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              Sign out
            </button>
          </div>
        </aside>

        <section className="min-w-0 space-y-4">{children}</section>
      </div>
    </div>
  );
}
