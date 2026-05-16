import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import {
  companyContact,
  relatedPageGroups,
  shippingSections,
} from "@/lib/site-content";

export default function ShippingPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <PageHero
        eyebrow="Policies"
        title="Shipping & delivery"
        description="How we deliver furniture across Nigeria—fees, timelines, and tracking for every Covmerc order."
      />
      <p className="mt-2 text-sm text-furni-muted">Last updated: May 16, 2026</p>

      <LegalDocument
        sections={shippingSections}
        contactLabel="Delivery questions"
        contactEmail={companyContact.supportEmail}
        alternateHref="/returns"
        alternateLabel="Returns & refunds"
      />

      <RelatedPages
        title="More help"
        links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
