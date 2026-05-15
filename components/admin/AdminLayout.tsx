"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAdminSession } from "@/components/providers/AdminSessionProvider";

const adminLinks = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/content", label: "Content" }
] as const;

export function AdminLayout({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdminAuthenticated, logout } = useAdminSession();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAdminAuthenticated, router]);

  if (!isAdminAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-furni-surface">
        <p className="text-sm text-furni-muted">Redirecting to admin login...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-furni-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px,1fr] md:px-6">
        <aside className="rounded-3xl bg-furni-primary p-5 text-white shadow-soft">
          <p className="text-xl font-semibold">Furni Admin</p>
          <p className="mt-1 text-xs text-white/70">Internal operations dashboard</p>

          <nav className="mt-8 grid gap-2 text-sm">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 transition ${pathname === link.href ? "bg-white text-furni-primary" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={logout}
            className="mt-8 rounded-xl border border-white/25 px-3 py-2 text-xs uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            Logout
          </button>
        </aside>

        <section className="space-y-4">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-furni-primary">
              {title}
            </h1>
            <p className="mt-1 text-sm text-furni-muted">{subtitle}</p>
          </header>
          {children}
        </section>
      </div>
    </div>
  );
}
