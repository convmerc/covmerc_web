"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getFirebase } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export default function AdminDashboardPage() {
  const { auth } = getFirebase();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (next) => setUser(next));
    return () => unsub();
  }, [auth]);

  return (
    <div className="flex min-h-screen flex-col bg-covmerc-grayLight">
      <TopNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-6 lg:px-0">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-covmerc-textLight">
              Admin dashboard
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-covmerc-black md:text-3xl">
              Platform control center
            </h1>
            <p className="mt-2 max-w-xl text-sm text-covmerc-textLight">
              Inspired by the Covmerc mobile admin experience: review businesses,
              configure the system, and monitor performance for your marketplace.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Pending business reviews" value="–" />
          <SummaryCard label="Open support tickets" value="–" />
          <SummaryCard label="Total vendors" value="–" />
        </section>

        <section className="grid gap-4 md:grid-cols-[1.4fr,1.1fr]">
          <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <h2 className="mb-2 text-sm font-semibold text-covmerc-black">
              Businesses awaiting review
            </h2>
            <p className="text-xs text-covmerc-textLight">
              Connect this view to the same Firestore collections used in the
              mobile app&apos;s admin flows (e.g. `businesses` + status fields) to
              approve or reject vendors from the web.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
              <h2 className="mb-2 text-sm font-semibold text-covmerc-black">
                Signed-in admin
              </h2>
              <p className="text-xs text-covmerc-textLight">
                Restrict access here using custom claims or role documents in
                Firestore; the component is wired to Firebase Auth and ready for
                role checks.
              </p>
              <p className="mt-2 text-xs text-covmerc-textLight">
                Current user: {user?.email ?? "not signed in"}
              </p>
            </div>

            <div className="rounded-3xl bg-covmerc-secondary/95 p-4 text-xs text-white shadow-soft">
              <p className="font-semibold">Next steps</p>
              <p className="mt-1 text-white/90">
                Map these admin cards to your existing Covmerc Flutter routes like
                `ADMIN_DASHBOARD`, `ADMIN_BUSINESS_REVIEW`, and chat/analytics
                screens by reusing the same Firebase collections.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
      <p className="text-xs text-covmerc-textLight">{label}</p>
      <p className="mt-1 text-lg font-semibold text-covmerc-black">{value}</p>
    </div>
  );
}

