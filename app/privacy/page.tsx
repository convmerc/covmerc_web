import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import {
  companyContact,
  privacySections,
  relatedPageGroups
} from "@/lib/site-content";

export default function PrivacyPage() {
  return (
    <MarketingShell maxWidth="4xl">
        <PageHero
          eyebrow="Legal"
          title="Privacy Policy"
          description="We respect your trust. This policy explains what we collect when you shop on Covmerc, how we use it, and the choices you have—on web, mobile, and when you contact our team."
        />
        <p className="mt-2 text-sm text-furni-muted">Last updated: May 15, 2026</p>

        <LegalDocument
          sections={privacySections}
          contactLabel="Privacy enquiries"
          contactEmail={companyContact.privacyEmail}
          alternateHref="/terms"
          alternateLabel="Terms of Service"
        />

        <RelatedPages
          title="Help & policies"
          links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
        />
    </MarketingShell>
  );
}
