import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PolicyMetaBar } from "@/components/content/PolicyMetaBar";
import { CtaBanner } from "@/components/ui/CtaBanner";
import {
  companyContact,
  policyLastUpdated,
  privacyHighlights,
  privacySections,
  relatedPageGroups
} from "@/lib/site-content";

const policyLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/contact", label: "Contact" }
] as const;

export default function PrivacyPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="We respect your trust. This policy explains what we collect when you shop on Covmerc, how we use it, and the choices you have—on web, mobile, and when you contact our team."
      />
      <PolicyMetaBar lastUpdated={policyLastUpdated} links={policyLinks} />

      <LegalDocument
        sections={privacySections}
        contactLabel="Privacy enquiries"
        contactEmail={companyContact.privacyEmail}
        alternateHref="/terms"
        alternateLabel="Terms of Service"
        highlights={privacyHighlights}
      />

      <CtaBanner
        className="mt-14"
        variant="light"
        eyebrow="Your data"
        title="Request access or deletion"
        description={`Email ${companyContact.privacyEmail} with the subject “Privacy Request” and the email on your account.`}
        primary={{ href: `mailto:${companyContact.privacyEmail}`, label: "Email privacy team" }}
        secondary={{ href: "/support", label: "Help Center" }}
      />

      <RelatedPages
        title="Help & policies"
        links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
