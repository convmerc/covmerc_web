import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import {
  companyContact,
  relatedPageGroups,
  returnsSections,
} from "@/lib/site-content";

export default function ReturnsPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <PageHero
        eyebrow="Policies"
        title="Returns & refunds"
        description="Our 14-day return window, refund process, and how to get help with damaged or incorrect items."
      />
      <p className="mt-2 text-sm text-furni-muted">Last updated: May 16, 2026</p>

      <LegalDocument
        sections={returnsSections}
        contactLabel="Returns support"
        contactEmail={companyContact.supportEmail}
        alternateHref="/shipping"
        alternateLabel="Shipping & delivery"
      />

      <RelatedPages
        title="More help"
        links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
