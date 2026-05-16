import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { SupportFaqList } from "@/components/content/SupportFaqList";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import {
  companyContact,
  relatedPageGroups,
  supportFaqs
} from "@/lib/site-content";

const supportChannels = [
  {
    title: "Order & delivery",
    description: "Tracking, rescheduling, and delivery-day questions.",
    href: "/contact",
    cta: "Message support"
  },
  {
    title: "Returns & refunds",
    description: "Start a return and understand eligibility windows.",
    href: "/terms",
    cta: "View policy"
  },
  {
    title: "Account & app",
    description: "Sign-in, profile updates, and syncing with the mobile app.",
    href: "/auth/login",
    cta: "Sign in"
  },
  {
    title: "Design & product help",
    description: "Dimensions, materials, and styling before you buy.",
    href: "/blog",
    cta: "Read the journal"
  }
] as const;

export default function SupportPage() {
  return (
    <MarketingShell>
        <PageHero
          eyebrow="Help Center"
          title="Answers when you need them"
          description="Most questions are covered below. If you still need a human, our Lagos support team typically replies within one business day—faster for urgent delivery issues."
        />

        <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {supportChannels.map((channel) => (
            <FurniCard key={channel.title} className="flex flex-col animate-fade-up">
              <h2 className="text-base font-semibold text-furni-primary">{channel.title}</h2>
              <p className="mt-2 flex-1 text-sm text-furni-muted">{channel.description}</p>
              <Link
                href={channel.href}
                className="mt-4 text-sm font-semibold text-furni-primary hover:underline"
              >
                {channel.cta} →
              </Link>
            </FurniCard>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-furni-primary">Frequently asked questions</h2>
          <p className="mt-2 text-sm text-furni-muted">
            Can’t find what you need?{" "}
            <Link href="/contact" className="font-medium text-furni-primary hover:underline">
              Contact us
            </Link>{" "}
            or review our{" "}
            <Link href="/privacy" className="font-medium text-furni-primary hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="font-medium text-furni-primary hover:underline">
              Terms of Service
            </Link>
            .
          </p>
          <div className="mt-6">
            <SupportFaqList items={supportFaqs} />
          </div>
        </section>

        <FurniCard className="mt-10 grid gap-4 md:grid-cols-[1fr,auto] md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-furni-primary">Still stuck?</h2>
            <p className="mt-1 text-sm text-furni-muted">
              Email {companyContact.supportEmail} or call {companyContact.phone} during studio hours.
            </p>
          </div>
          <Link href="/contact">
            <FurniButton>Contact Covmerc</FurniButton>
          </Link>
        </FurniCard>

        <RelatedPages
          title="Related"
          links={[...relatedPageGroups.help, ...relatedPageGroups.legal, ...relatedPageGroups.explore.slice(0, 2)]}
        />
    </MarketingShell>
  );
}
