import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { PolicyHighlights } from "@/components/content/PolicyHighlights";
import { FurniCard } from "@/components/ui/FurniCard";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  companyContact,
  contactReasons,
  contactSlaCards,
  relatedPageGroups
} from "@/lib/site-content";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Covmerc for orders, product advice, partnerships, and privacy requests. Our Lagos team responds within one business day.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Contact"
        title="We are here to help—before and after you buy"
        description="Whether you need delivery updates, sizing advice for a tight hallway, or you are a maker interested in selling on Covmerc, message us. Real people in Lagos read every note."
      />

      <PolicyHighlights
        items={contactSlaCards.map((card) => ({
          icon: card.icon,
          label: card.title,
          value: card.value,
          description: card.description
        }))}
      />

      <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contactReasons.map((reason) => (
          <FurniCard key={reason.title} className="flex flex-col p-5">
            <h2 className="text-base font-semibold text-furni-primary">{reason.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-furni-muted">{reason.description}</p>
            <a
              href={`mailto:${reason.email}?subject=${encodeURIComponent(reason.title)}`}
              className="mt-4 text-sm font-semibold text-furni-primary hover:underline"
            >
              {reason.email} →
            </a>
          </FurniCard>
        ))}
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <FurniCard className="relative overflow-hidden p-6 md:p-8">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-furni-accent/20 blur-2xl"
            aria-hidden
          />
          <h2 className="text-xl font-semibold text-furni-primary">Send a message</h2>
          <p className="mt-2 text-sm leading-relaxed text-furni-muted">
            Include your order number if you have one—we will route your request to the right
            specialist. For urgent delivery issues, call us during business hours.
          </p>
          <ContactForm />
          <p className="mt-4 text-xs text-furni-muted">
            By submitting, you agree to our{" "}
            <Link href="/privacy" className="font-medium text-furni-primary hover:underline">
              Privacy Policy
            </Link>
            . Need quick answers? Visit the{" "}
            <Link href="/support" className="font-medium text-furni-primary hover:underline">
              Help Center
            </Link>
            .
          </p>
        </FurniCard>

        <div className="grid gap-4">
          <FurniCard className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-furni-primary to-furni-primary/80 px-6 py-8 text-white">
              <p className="covmerc-eyebrow-light">Studio & showroom</p>
              <p className="mt-3 font-display text-2xl">Victoria Island, Lagos</p>
              <p className="mt-2 text-sm text-white/85">
                Visit by appointment or message us to schedule a walkthrough of select pieces.
              </p>
            </div>
            <address className="space-y-2 px-6 py-5 text-sm not-italic leading-relaxed text-furni-muted">
              <p>{companyContact.address}</p>
              <p>
                <a
                  href={`tel:${companyContact.phone.replace(/\s/g, "")}`}
                  className="font-medium text-furni-primary hover:underline"
                >
                  {companyContact.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${companyContact.email}`}
                  className="font-medium text-furni-primary hover:underline"
                >
                  {companyContact.email}
                </a>
              </p>
            </address>
          </FurniCard>

          <FurniCard className="p-5">
            <h2 className="text-lg font-semibold text-furni-primary">Business hours</h2>
            <ul className="mt-3 space-y-2 text-sm text-furni-muted">
              <li>{companyContact.hours.weekdays}</li>
              <li>{companyContact.hours.saturday}</li>
              <li>{companyContact.hours.sunday}</li>
            </ul>
          </FurniCard>

          <CtaBanner
            variant="light"
            eyebrow="Self-service"
            title="Help Center"
            description="Track orders, read return guidance, and browse FAQs without waiting for a reply."
            primary={{ href: "/support", label: "Open Help Center" }}
            secondary={{ href: "/shipping", label: "Delivery guide" }}
          />
        </div>
      </section>

      <RelatedPages
        title="Policies & resources"
        links={[...relatedPageGroups.help, ...relatedPageGroups.legal]}
      />
    </MarketingShell>
  );
}
