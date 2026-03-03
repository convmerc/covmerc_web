"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getFirebase } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export default function CustomerDashboardPage() {
  const { auth } = getFirebase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (next) => {
      setUser(next);
    });
    return () => unsub();
  }, [auth]);

  return (
    <div className="flex min-h-screen flex-col bg-covmerc-grayLight">
      <TopNav />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-0">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-covmerc-textLight">
              Customer dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-covmerc-black md:text-3xl">
              Welcome back{user?.displayName ? `, ${user.displayName}` : ""}.
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link
              href="/"
              className="rounded-full border border-covmerc-primary/20 px-3 py-1.5 text-covmerc-primary hover:bg-covmerc-primary/5"
            >
              Back to home
            </Link>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-[2fr,1.4fr]">
          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <h2 className="mb-2 text-sm font-semibold text-covmerc-black">
                Quick actions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <ActionCard
                  title="Browse products"
                  description="Discover items from verified vendors."
                />
                <ActionCard
                  title="My orders"
                  description="See your recent purchases and statuses."
                />
                <ActionCard
                  title="Wishlist"
                  description="View items you&apos;ve saved to buy later."
                />
                <ActionCard
                  title="Support"
                  description="Get help via FAQ, contact, or chat."
                />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-covmerc-black">
                  Recent activity
                </h2>
                <span className="text-xs text-covmerc-textLight">
                  Mirrored from mobile app
                </span>
              </div>
              <p className="text-sm text-covmerc-textLight">
                Once wired to your production Firestore collections, this section
                will show your latest orders, wishlist changes, and support
                tickets in real time.
              </p>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl bg-covmerc-primary/95 p-4 text-white shadow-soft">
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">
                Account overview
              </p>
              <p className="mt-1 text-lg font-semibold">
                Signed in via Firebase Auth
              </p>
              <p className="mt-3 text-xs text-white/80">
                Email: {user?.email ?? "not signed in"}
              </p>
            </div>

            <div className="rounded-3xl bg-white p-4 text-xs text-covmerc-textLight shadow-soft ring-1 ring-slate-100">
              <p className="mb-1 font-semibold text-covmerc-black">
                Environment hint
              </p>
              <p>
                This dashboard uses the Firebase Web SDK with environment-based
                configuration, so you can point it at the same project used by
                the Covmerc Flutter app.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ActionCard({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl bg-covmerc-grayLight/80 p-3 transition hover:bg-covmerc-grayLight">
      <p className="text-sm font-semibold text-covmerc-black">{title}</p>
      <p className="mt-1 text-xs text-covmerc-textLight">{description}</p>
    </div>
  );
}

