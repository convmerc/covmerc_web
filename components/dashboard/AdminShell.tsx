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
    <div className="min-h-screen bg-covmerc-grayLight text-covmerc-black dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 md:px-6 lg:flex-row lg:px-8">
        <aside className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-72 lg:overflow-y-auto">
          <div className="mb-5">
            <p className="text-xs uppercase tracking-wide text-covmerc-textLight dark:text-slate-400">
              Covmerc Admin
            </p>
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p className="mt-2 text-xs text-covmerc-textLight dark:text-slate-400">
              Signed in as {user.email ?? "unknown account"}
            </p>
            {roleSource ? (
              <p className="mt-1 text-[11px] text-covmerc-textLight dark:text-slate-400">
                Access source: {roleSource}
              </p>
            ) : null}
          </div>

          <nav className="space-y-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-covmerc-primary text-white"
                    : "text-covmerc-black hover:bg-covmerc-primary/10 dark:text-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-covmerc-textLight dark:text-slate-400">
              Collections
            </p>
            <div className="grid gap-2">
              {MANAGED_COLLECTIONS.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/dashboard/admin/data/${collection.id}` as Route}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs transition hover:border-covmerc-primary/40 hover:bg-covmerc-primary/5 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  <p className="font-semibold">{collection.label}</p>
                  <p className="mt-0.5 text-covmerc-textLight dark:text-slate-400">
                    {collection.readOnly ? "Read-only" : "Writable"}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <ThemeToggle />
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
