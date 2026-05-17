import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PolicyMetaBar } from "@/components/content/PolicyMetaBar";
import { ProcessSteps } from "@/components/content/ProcessSteps";
import { CtaBanner } from "@/components/ui/CtaBanner";
import {
  companyContact,
  policyLastUpdated,
  relatedPageGroups,
  returnsHighlights,
  returnsSections
} from "@/lib/site-content";

const policyLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/contact", label: "Contact" }
] as const;

const returnSteps = [
  {
    title: "Request authorization",
    description: "Email support with your order ID, photos, and reason—do not ship without approval."
  },
  {
    title: "Pickup or drop-off",
    description: "We arrange logistics in Lagos or provide instructions for other regions."
  },
  {
    title: "Inspection & refund",
    description: "Refunds go to your original payment method within 7–14 business days after inspection."
  }
] as const;

export default function ReturnsPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <PageHero
        eyebrow="Policies"
        title="Returns & refunds"
        description="Our 14-day return window, refund process, and how to get help with damaged or incorrect items."
      />
      <PolicyMetaBar lastUpdated={policyLastUpdated} links={policyLinks} />

      <ProcessSteps
        title="Return in three steps"
        description="We keep the process straightforward—most returns are resolved within two weeks of approval."
        steps={returnSteps}
      />

      <LegalDocument
        sections={returnsSections}
        contactLabel="Returns support"
        contactEmail={companyContact.supportEmail}
        alternateHref="/shipping"
        alternateLabel="Shipping & delivery"
        highlights={returnsHighlights}
      />

      <CtaBanner
        className="mt-14"
        eyebrow="Start a return"
        title="Ready to return an item?"
        description={`Email ${companyContact.supportEmail} with your order ID and photos. For damage, contact us within 48 hours of delivery.`}
        primary={{ href: "/contact", label: "Contact returns" }}
        secondary={{ href: "/support", label: "Browse FAQs" }}
      />

      <RelatedPages
        title="More help"
        links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
