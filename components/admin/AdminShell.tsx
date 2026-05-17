"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { CovmercLogoMark } from "@/components/brand/CovmercLogoMark";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { MANAGED_COLLECTIONS } from "@/lib/admin-collections";
import {
  ADMIN_OPERATIONS_NAV,
  ADMIN_PRIMARY_NAV,
  isAdminNavActive
} from "@/lib/admin-nav";

function NavLink({
  href,
  label,
  icon,
  description,
  pathname,
  onNavigate
}: {
  href: string;
  label: string;
  icon: string;
  description?: string;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isAdminNavActive(pathname, href);

  return (
    <Link
      href={href as Route}
      onClick={onNavigate}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
        active
          ? "bg-white text-furni-primary shadow-sm"
          : "text-white/85 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm ${
          active ? "bg-furni-accent/30" : "bg-white/10"
        }`}
        aria-hidden
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight">{label}</span>
        {description ? (
          <span
            className={`mt-0.5 block truncate text-[11px] leading-snug ${
              active ? "text-furni-muted" : "text-white/55"
            }`}
          >
            {description}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function SidebarContent({
  pathname,
  email,
  onNavigate,
  collectionsOpen,
  onToggleCollections
}: {
  pathname: string;
  email?: string;
  onNavigate?: () => void;
  collectionsOpen: boolean;
  onToggleCollections: () => void;
}) {
  return (
    <Fragment>
      <div className="flex items-center gap-3">
        <CovmercLogoMark size="sm" light showWordmark={false} />
        <div className="min-w-0">
          <p className="covmerc-eyebrow-light">Admin</p>
          <p className="truncate text-sm font-semibold text-white">Operations</p>
        </div>
      </div>
      {email ? (
        <p className="mt-4 truncate rounded-xl bg-white/10 px-3 py-2 text-xs text-white/75">
          {email}
        </p>
      ) : null}

      <nav className="mt-6 space-y-6" aria-label="Admin navigation">
        <div>
          <p className="covmerc-eyebrow-light mb-2 px-1">Storefront</p>
          <div className="grid gap-1">
            {ADMIN_PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <div>
          <p className="covmerc-eyebrow-light mb-2 px-1">Platform</p>
          <div className="grid gap-1">
            {ADMIN_OPERATIONS_NAV.map((item) => (
              <NavLink
                key={item.href}
                {...item}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={onToggleCollections}
            className="covmerc-eyebrow-light mb-2 flex w-full items-center justify-between px-1 text-left"
            aria-expanded={collectionsOpen}
          >
            <span>Collections</span>
            <span className="text-white/70" aria-hidden>
              {collectionsOpen ? "−" : "+"}
            </span>
          </button>
          {collectionsOpen ? (
            <div className="grid max-h-44 gap-1 overflow-y-auto pr-1 text-xs">
              {MANAGED_COLLECTIONS.map((collection) => {
                const href = `/admin/data/${collection.id}`;
                const active = pathname === href;

                return (
                  <Link
                    key={collection.id}
                    href={href as Route}
                    onClick={onNavigate}
                    className={`rounded-lg border px-2.5 py-2 transition ${
                      active
                        ? "border-white bg-white/15 text-white"
                        : "border-white/15 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    <p className="font-semibold">{collection.label}</p>
                    <p className={active ? "text-white/70" : "text-white/50"}>
                      {collection.readOnly ? "Read-only" : "Writable"}
                    </p>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </div>
      </nav>

      <div className="mt-6 flex flex-wrap gap-2 border-t border-white/15 pt-4">
        <Link
          href="/shop"
          onClick={onNavigate}
          className="rounded-xl border border-white/25 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
        >
          View storefront
        </Link>
        <Link
          href="/account"
          onClick={onNavigate}
          className="rounded-xl border border-white/25 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/10"
        >
          My account
        </Link>
      </div>
    </Fragment>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { currentUser, logout } = useAuthSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(
    pathname.startsWith("/admin/data/")
  );

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith("/admin/data/")) {
      setCollectionsOpen(true);
    }
  }, [pathname]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-furni-surface covmerc-surface-texture">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <CovmercLogoMark size="sm" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-xl border border-furni-primary/15 px-3 py-2 text-xs font-semibold text-furni-primary"
            >
              Sign out
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-xl bg-furni-primary px-3 py-2 text-xs font-semibold text-white"
              aria-expanded={mobileOpen}
              aria-controls="admin-mobile-nav"
            >
              {mobileOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id="admin-mobile-nav"
            className="mb-4 rounded-3xl bg-furni-primary p-5 text-white shadow-soft lg:hidden"
          >
            <SidebarContent
              pathname={pathname}
              email={currentUser?.email}
              onNavigate={closeMobile}
              collectionsOpen={collectionsOpen}
              onToggleCollections={() => setCollectionsOpen((open) => !open)}
            />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <aside className="hidden rounded-3xl bg-furni-primary p-5 text-white shadow-soft lg:block lg:sticky lg:top-6 lg:self-start">
            <SidebarContent
              pathname={pathname}
              email={currentUser?.email}
              collectionsOpen={collectionsOpen}
              onToggleCollections={() => setCollectionsOpen((open) => !open)}
            />
            <button
              type="button"
              onClick={() => void logout()}
              className="mt-6 w-full rounded-xl border border-white/25 px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              Sign out
            </button>
          </aside>

          <section className="min-w-0 space-y-6">{children}</section>
        </div>
      </div>
    </div>
  );
}
