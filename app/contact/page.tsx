import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { FurniCard } from "@/components/ui/FurniCard";
import { ContactForm } from "@/components/contact/ContactForm";
import {
  companyContact,
  contactReasons,
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
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 md:px-6 lg:px-8">
        <PageHero
          eyebrow="Contact"
          title="We are here to help—before and after you buy"
          description="Whether you need delivery updates, sizing advice for a tight hallway, or you are a maker interested in selling on Covmerc, message us. Real people in Lagos read every note."
        />

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactReasons.map((reason) => (
            <FurniCard key={reason.title} className="animate-fade-up">
              <h2 className="text-base font-semibold text-furni-primary">{reason.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-furni-muted">{reason.description}</p>
              <a
                href={`mailto:${reason.email}`}
                className="mt-3 inline-block text-xs font-medium text-furni-primary hover:underline"
              >
                {reason.email}
              </a>
            </FurniCard>
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.15fr,1fr]">
          <FurniCard className="animate-fade-up">
            <h2 className="text-xl font-semibold text-furni-primary">Send a message</h2>
            <p className="mt-2 text-sm text-furni-muted">
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
            <FurniCard className="animate-fade-up">
              <h2 className="text-lg font-semibold text-furni-primary">Studio & showroom</h2>
              <address className="mt-3 space-y-2 text-sm not-italic leading-relaxed text-furni-muted">
                <p>{companyContact.address}</p>
                <p>
                  <a href={`tel:${companyContact.phone.replace(/\s/g, "")}`} className="hover:text-furni-primary">
                    {companyContact.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${companyContact.email}`} className="hover:text-furni-primary">
                    {companyContact.email}
                  </a>
                </p>
              </address>
            </FurniCard>

            <FurniCard className="animate-fade-up">
              <h2 className="text-lg font-semibold text-furni-primary">Business hours</h2>
              <ul className="mt-3 space-y-2 text-sm text-furni-muted">
                <li>{companyContact.hours.weekdays}</li>
                <li>{companyContact.hours.saturday}</li>
                <li>{companyContact.hours.sunday}</li>
              </ul>
              <p className="mt-4 text-xs text-furni-muted">
                Average email response time: under 24 hours on business days.
              </p>
            </FurniCard>

            <FurniCard className="bg-furni-primary/5 animate-fade-up">
              <h2 className="text-lg font-semibold text-furni-primary">Prefer self-service?</h2>
              <p className="mt-2 text-sm text-furni-muted">
                Track orders, read return guidance, and browse FAQs without waiting for a reply.
              </p>
              <Link
                href="/support"
                className="mt-3 inline-block text-sm font-semibold text-furni-primary hover:underline"
              >
                Open Help Center →
              </Link>
            </FurniCard>
          </div>
        </section>

        <RelatedPages
          title="Policies & resources"
          links={[...relatedPageGroups.help, ...relatedPageGroups.legal]}
        />
      </main>
      <Footer />
    </div>
  );
}
