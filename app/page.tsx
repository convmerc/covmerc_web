import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { SupportForm } from "@/components/landing/SupportForm";

export const metadata = {
  title: "Covmerc | Marketplace Growth Platform",
  description:
    "Covmerc helps local businesses grow with seamless mobile + web commerce operations, real-time orders, and secure admin tooling."
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-covmerc-grayLight to-covmerc-grayLight dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <TopNav />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-4 pb-16 pt-10 md:px-6 lg:px-8 lg:pt-16">
        <section className="grid gap-10 md:grid-cols-[1.3fr,1fr] md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center rounded-full bg-covmerc-primary/5 px-3 py-1 text-xs font-medium text-covmerc-primary ring-1 ring-covmerc-primary/15">
              Omnichannel commerce · Web + Mobile
            </span>

            <h1 className="text-balance text-4xl font-semibold tracking-tight text-covmerc-black dark:text-slate-100 sm:text-5xl lg:text-6xl">
              Scale your marketplace with{" "}
              <span className="bg-gradient-to-r from-covmerc-primary to-covmerc-secondary bg-clip-text text-transparent">
                one Firebase-backed ecosystem
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-covmerc-textLight dark:text-slate-300 sm:text-base">
              Launch a high-converting web experience that stays synced with your
              production mobile backend. Covmerc web supports discoverability,
              trust, and conversion while preserving your existing Firebase data
              contracts.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="https://apps.apple.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-covmerc-primary px-6 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-covmerc-primary/90"
              >
                Download on App Store
              </Link>
              <Link
                href="https://play.google.com/store"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-covmerc-primary/20 px-5 py-2.5 text-sm font-medium text-covmerc-primary transition hover:bg-covmerc-primary/5"
              >
                Get it on Google Play
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-covmerc-black transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                Admin login
              </Link>
            </div>

            <div className="mt-4 grid gap-4 text-xs text-covmerc-textLight dark:text-slate-300 sm:grid-cols-3 sm:text-sm">
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <p className="font-semibold text-covmerc-black dark:text-slate-100">
                  Customer
                </p>
                <p>Browse products, track orders, and get support in a few taps.</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <p className="font-semibold text-covmerc-black dark:text-slate-100">
                  Vendor
                </p>
                <p>Publish inventory, manage fulfillment, and view analytics.</p>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                <p className="font-semibold text-covmerc-black dark:text-slate-100">
                  Admin
                </p>
                <p>Review businesses, moderate listings, and configure the system.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-gradient-to-tr from-covmerc-primary/10 via-covmerc-secondary/10 to-covmerc-primary/5 blur-3xl" />
            <div className="relative rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-covmerc-textLight">
                    Covmerc Web
                  </p>
                  <p className="text-sm font-semibold text-covmerc-black dark:text-slate-100">
                    Unified dashboard
                  </p>
                </div>
                <span className="rounded-full bg-covmerc-success/10 px-3 py-1 text-xs font-medium text-covmerc-success">
                  Live sync via Firebase
                </span>
              </div>

              <div className="space-y-4 text-xs text-covmerc-textLight dark:text-slate-300">
                <div className="rounded-2xl bg-covmerc-grayLight p-3 dark:bg-slate-800">
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-covmerc-textLight">
                    Real-time orders
                  </p>
                  <p className="text-sm font-semibold text-covmerc-black dark:text-slate-100">
                    Incoming order · 3 items · ₦18,500
                  </p>
                  <p>Automatically synced from mobile to web via Firestore.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-covmerc-primary/95 p-3 text-white">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                      Today&apos;s revenue
                    </p>
                    <p className="mt-1 text-lg font-semibold">₦245,000</p>
                  </div>
                  <div className="rounded-2xl bg-covmerc-secondary/95 p-3 text-white">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                      Active vendors
                    </p>
                    <p className="mt-1 text-lg font-semibold">128</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="grid gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
          <FeatureCard
            title="Customer experience"
            body="Mobile-first product discovery, smooth checkout, and live order tracking — all mirrored in a responsive web UI."
          />
          <FeatureCard
            title="Vendor workspace"
            body="A modern dashboard for managing catalog, pricing, and fulfillment with Firebase-backed data."
          />
          <FeatureCard
            title="Admin control"
            body="Centralized tools for business review, system configuration, and user management."
          />
        </section>

        <section
          id="how-it-works"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <h2 className="text-2xl font-semibold dark:text-slate-100">How it works</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <StepCard
              index="01"
              title="Connect existing Firebase"
              body="Use the same project and environment variables already trusted by your Flutter application."
            />
            <StepCard
              index="02"
              title="Publish SEO-ready landing"
              body="App Router pages render fast and index well, while preserving a native app conversion flow."
            />
            <StepCard
              index="03"
              title="Operate via protected admin"
              body="Only verified admin identities can access metrics and safe collection management tools."
            />
          </div>
        </section>

        <section
          id="support"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-semibold dark:text-slate-100">Contact support</h2>
            <p className="mt-2 text-sm text-covmerc-textLight dark:text-slate-300">
              Need implementation support, migration checks, or admin onboarding?
              Send a request and we will follow up.
            </p>
          </div>
          <SupportForm />
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
      <h3 className="mb-2 text-base font-semibold text-covmerc-black dark:text-slate-100">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-covmerc-textLight dark:text-slate-300">
        {body}
      </p>
    </div>
  );
}

function StepCard({
  index,
  title,
  body
}: {
  index: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-covmerc-grayLight p-4 dark:bg-slate-800">
      <p className="text-xs font-semibold text-covmerc-primary">{index}</p>
      <h3 className="mt-1 text-base font-semibold dark:text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-covmerc-textLight dark:text-slate-300">{body}</p>
    </div>
  );
}

