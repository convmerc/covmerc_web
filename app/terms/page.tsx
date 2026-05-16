import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import {
  companyContact,
  relatedPageGroups,
  termsSections
} from "@/lib/site-content";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8">
        <PageHero
          eyebrow="Legal"
          title="Terms of Service"
          description="These terms govern your use of Covmerc’s website and app—including browsing, ordering, vendor listings, and support. Please read them alongside our Privacy Policy."
        />
        <p className="mt-2 text-sm text-furni-muted">Last updated: May 15, 2026</p>

        <LegalDocument
          sections={termsSections}
          contactLabel="Legal notices"
          contactEmail={companyContact.legalEmail}
          alternateHref="/privacy"
          alternateLabel="Privacy Policy"
        />

        <RelatedPages
          title="Help & policies"
          links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
        />
      </main>
      <Footer />
    </div>
  );
}
