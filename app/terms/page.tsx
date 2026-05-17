import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { LegalDocument } from "@/components/content/LegalDocument";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PolicyMetaBar } from "@/components/content/PolicyMetaBar";
import { PolicyHighlights } from "@/components/content/PolicyHighlights";
import { CtaBanner } from "@/components/ui/CtaBanner";
import {
  companyContact,
  policyLastUpdated,
  relatedPageGroups,
  returnsHighlights,
  termsSections
} from "@/lib/site-content";

const policyLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/support", label: "Help Center" }
] as const;

const termsHighlights = [
  { icon: "🛒", label: "Orders", value: "Confirmed", description: "When you receive confirmation" },
  { icon: "💳", label: "Currency", value: "NGN", description: "Prices in Nigerian Naira" },
  ...returnsHighlights.slice(0, 2)
];

export default function TermsPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        description="These terms govern your use of Covmerc’s website and app—including browsing, ordering, vendor listings, and support. Please read them alongside our Privacy Policy."
      />
      <PolicyMetaBar lastUpdated={policyLastUpdated} links={policyLinks} />

      <LegalDocument
        sections={termsSections}
        contactLabel="Legal notices"
        contactEmail={companyContact.legalEmail}
        alternateHref="/privacy"
        alternateLabel="Privacy Policy"
        highlights={termsHighlights}
      />

      <CtaBanner
        className="mt-14"
        variant="light"
        eyebrow="Shopping with confidence"
        title="Delivery & returns at a glance"
        description="Full shipping and return policies live on dedicated pages—linked from checkout and order emails."
        primary={{ href: "/shipping", label: "Shipping guide" }}
        secondary={{ href: "/returns", label: "Returns policy" }}
      />

      <RelatedPages
        title="Help & policies"
        links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
