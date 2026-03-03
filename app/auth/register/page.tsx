"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getFirebase } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

export default function RegisterPage() {
  const { auth } = getFirebase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (name.trim()) {
        await updateProfile(userCredential.user, { displayName: name.trim() });
      }

      window.location.href = "/dashboard/customer";
    } catch (err) {
      const message =
        (err as Error).message || "Unable to create account. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-covmerc-grayLight">
      <TopNav />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-10 md:flex-row md:items-stretch md:gap-10 md:px-6 lg:px-0">
        <section className="hidden flex-1 flex-col justify-center md:flex">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-covmerc-black md:text-4xl">
            Create your Covmerc account
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-covmerc-textLight">
            One account for both mobile and web. Start as a customer today and
            upgrade to vendor or admin roles as your business grows.
          </p>
          <div className="mt-6 grid gap-3 text-xs text-covmerc-textLight">
            <Badge>Customer, vendor & admin flows</Badge>
            <Badge>Firebase-secured data</Badge>
            <Badge>Designed to mirror the mobile app</Badge>
          </div>
        </section>

        <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <h2 className="mb-1 text-xl font-semibold text-covmerc-black">
            Get started
          </h2>
          <p className="mb-6 text-xs text-covmerc-textLight">
            Create an account to access the Covmerc web dashboard.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-xs font-medium text-covmerc-textLight"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-covmerc-grayLight/60 px-3 py-2 text-sm outline-none ring-covmerc-primary/10 focus:bg-white focus:ring-2"
                placeholder="Ada Lovelace"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-covmerc-textLight"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-covmerc-grayLight/60 px-3 py-2 text-sm outline-none ring-covmerc-primary/10 focus:bg-white focus:ring-2"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-covmerc-textLight"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-covmerc-grayLight/60 px-3 py-2 text-sm outline-none ring-covmerc-primary/10 focus:bg-white focus:ring-2"
                placeholder="At least 6 characters"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-covmerc-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-covmerc-primary px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-covmerc-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            <div className="pt-2 text-center text-xs text-covmerc-textLight">
              <span>Already have an account? </span>
              <Link
                href="/auth/login"
                className="font-medium text-covmerc-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="inline-flex w-max items-center rounded-full bg-white px-3 py-1 text-[11px] font-medium text-covmerc-textLight shadow-sm ring-1 ring-slate-100">
      {children}
    </span>
  );
}

