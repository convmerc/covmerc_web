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
  shippingHighlights,
  shippingSections
} from "@/lib/site-content";

const policyLinks = [
  { href: "/returns", label: "Returns" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/support", label: "Help Center" }
] as const;

const deliverySteps = [
  {
    title: "Checkout & confirmation",
    description: "Fees and estimated timelines appear before you pay. You receive confirmation by email."
  },
  {
    title: "Dispatch & tracking",
    description: "We share carrier tracking when your order ships. Check Account → Orders anytime."
  },
  {
    title: "Delivery day",
    description: "Our team or partner confirms access and time slot. Inspect items on arrival."
  }
] as const;

export default function ShippingPage() {
  return (
    <MarketingShell maxWidth="4xl">
      <PageHero
        eyebrow="Policies"
        title="Shipping & delivery"
        description="How we deliver furniture across Nigeria—fees, timelines, tracking, and what to expect on delivery day."
      />
      <PolicyMetaBar lastUpdated={policyLastUpdated} links={policyLinks} />

      <ProcessSteps
        title="From warehouse to your door"
        description="Every Covmerc order follows the same transparent path—whether you are in Ibadan or elsewhere in Nigeria."
        steps={deliverySteps}
      />

      <LegalDocument
        sections={shippingSections}
        contactLabel="Delivery questions"
        contactEmail={companyContact.supportEmail}
        alternateHref="/returns"
        alternateLabel="Returns & refunds"
        highlights={shippingHighlights}
      />

      <CtaBanner
        className="mt-14"
        eyebrow="Need help?"
        title="Questions about your delivery?"
        description="Message us with your order ID—we prioritize same-day responses for urgent delivery issues."
        primary={{ href: "/contact", label: "Contact support" }}
        secondary={{ href: "/account/orders", label: "Track order" }}
      />

      <RelatedPages
        title="More help"
        links={[...relatedPageGroups.legal, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
