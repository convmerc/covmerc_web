"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { getFirebase } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const { auth } = getFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      window.location.href = "/dashboard/customer";
    } catch (err) {
      const message =
        (err as Error).message || "Unable to sign in. Please try again.";
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
            Welcome back to Covmerc
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-covmerc-textLight">
            Use the same account as the mobile app to access your customer,
            vendor, or admin workspace on the web. All data is synced via
            Firebase.
          </p>
          <div className="mt-6 grid gap-3 text-xs text-covmerc-textLight">
            <Badge>Secure Firebase Auth</Badge>
            <Badge>Single account across devices</Badge>
            <Badge>Real-time data sync</Badge>
          </div>
        </section>

        <section className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <h2 className="mb-1 text-xl font-semibold text-covmerc-black">
            Sign in
          </h2>
          <p className="mb-6 text-xs text-covmerc-textLight">
            Enter your Covmerc credentials to continue.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                placeholder="••••••••"
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
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            <div className="pt-2 text-center text-xs text-covmerc-textLight">
              <span>New to Covmerc? </span>
              <Link
                href="/auth/register"
                className="font-medium text-covmerc-primary hover:underline"
              >
                Create an account
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

