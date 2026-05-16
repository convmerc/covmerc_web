"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MANAGED_COLLECTIONS } from "@/lib/admin-collections";
import { getFirebase } from "@/lib/firebase";

type AdminShellProps = {
  user: User;
  roleSource?: string;
  children: ReactNode;
};

const NAV_LINKS: Array<{ href: Route; label: string }> = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/data", label: "Data manager" }
];

export function AdminShell({ user, roleSource, children }: AdminShellProps) {
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut(getFirebase().auth);
    window.location.href = "/auth/login";
  }

  return (
    <div className="min-h-screen bg-furni-surface covmerc-surface-texture">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px,1fr] md:px-6">
        <aside className="rounded-3xl bg-furni-primary p-5 text-white shadow-soft lg:sticky lg:top-6 lg:self-start">
          <p className="covmerc-eyebrow-light">Covmerc Admin</p>
          <p className="mt-1 text-xl font-semibold">Data dashboard</p>
          <p className="mt-2 text-xs text-white/70">{user.email ?? "Unknown account"}</p>
          {roleSource ? (
            <p className="mt-1 text-[11px] text-white/60">Access: {roleSource}</p>
          ) : null}

          <nav className="mt-8 grid gap-2 text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-xl px-3 py-2 transition ${
                  pathname === link.href
                    ? "bg-white text-furni-primary"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6">
            <p className="covmerc-eyebrow-light mb-2">Collections</p>
            <div className="grid gap-1.5">
              {MANAGED_COLLECTIONS.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/dashboard/admin/data/${collection.id}` as Route}
                  className="rounded-lg border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"
                >
                  <p className="font-semibold">{collection.label}</p>
                  <p className="mt-0.5 text-white/60">
                    {collection.readOnly ? "Read-only" : "Writable"}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
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
