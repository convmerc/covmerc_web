"use client";

import { useEffect, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getFirebase } from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export default function VendorDashboardPage() {
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
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-covmerc-textLight">
            Vendor dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-covmerc-black md:text-3xl">
            Manage your Covmerc store
          </h1>
          <p className="mt-2 text-sm text-covmerc-textLight">
            This screen mirrors the vendor experience from the mobile app:
            products, orders, and analytics backed by Firebase.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <SummaryCard label="Today&apos;s orders" value="–" />
          <SummaryCard label="Revenue" value="₦0.00" />
          <SummaryCard label="Live products" value="–" />
        </section>

        <section className="grid gap-4 md:grid-cols-[1.3fr,1.1fr]">
          <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <h2 className="mb-2 text-sm font-semibold text-covmerc-black">
              Catalog
            </h2>
            <p className="text-xs text-covmerc-textLight">
              Hook this table up to your `products` collection in Firestore to
              show and manage inventory for this vendor.
            </p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-soft ring-1 ring-slate-100">
            <h2 className="mb-2 text-sm font-semibold text-covmerc-black">
              Signed-in vendor
            </h2>
            <p className="text-xs text-covmerc-textLight">
              Once you add vendor role metadata to your Firebase Auth users, you
              can scope this dashboard to only their store data.
            </p>
            <p className="mt-2 text-xs text-covmerc-textLight">
              Current user: {user?.email ?? "not signed in"}
            </p>
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

