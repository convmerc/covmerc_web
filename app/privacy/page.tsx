import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniCard } from "@/components/ui/FurniCard";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 md:px-6">
        <header className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
            Legal
          </p>
          <h1 className="mt-2 font-display text-5xl text-furni-primary">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-furni-muted">
            Last updated: May 15, 2026
          </p>
        </header>

        <FurniCard className="mt-6 space-y-4 text-sm leading-relaxed text-furni-muted animate-fade-up">
          <section>
            <h2 className="text-lg font-semibold text-furni-primary">Information We Collect</h2>
            <p>
              Covmerc collects account information, order records, and service usage
              data to provide a secure shopping and support experience.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-furni-primary">How We Use Data</h2>
            <p>
              We use your data to process orders, personalize product discovery,
              deliver support, and improve platform performance.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-furni-primary">Your Rights</h2>
            <p>
              You can request access, updates, or deletion of your personal data by
              contacting us at privacy@covmerc.com.
            </p>
          </section>
        </FurniCard>
      </main>
      <Footer />
    </div>
  );
}
