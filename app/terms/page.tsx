import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniCard } from "@/components/ui/FurniCard";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 md:px-6">
        <header className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
            Legal
          </p>
          <h1 className="mt-2 font-display text-5xl text-furni-primary">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-furni-muted">
            Last updated: May 15, 2026
          </p>
        </header>

        <FurniCard className="mt-6 space-y-4 text-sm leading-relaxed text-furni-muted animate-fade-up">
          <section>
            <h2 className="text-lg font-semibold text-furni-primary">Account Use</h2>
            <p>
              Users must provide accurate account details and protect credentials.
              Covmerc may suspend accounts that violate platform policies.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-furni-primary">Purchases & Payments</h2>
            <p>
              Pricing, taxes, and delivery fees are displayed at checkout. By placing
              an order, you agree to the listed payment terms and refund rules.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-furni-primary">Limitations</h2>
            <p>
              Covmerc is not liable for indirect damages resulting from delayed
              shipments, third-party service issues, or external product misuse.
            </p>
          </section>
        </FurniCard>
      </main>
      <Footer />
    </div>
  );
}
