import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { SupportFaqExplorer } from "@/components/content/SupportFaqExplorer";
import { HelpTopicCard } from "@/components/content/HelpTopicCard";
import { ProcessSteps } from "@/components/content/ProcessSteps";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { FurniCard } from "@/components/ui/FurniCard";
import {
  companyContact,
  relatedPageGroups,
  supportChannels,
  supportFaqs,
  supportProcessSteps
} from "@/lib/site-content";

export default function SupportPage() {
  return (
    <MarketingShell>
      <PageHero
        eyebrow="Help Center"
        title="Answers when you need them"
        description="Most questions are covered below. If you still need a human, our Lagos support team typically replies within one business day—faster for urgent delivery issues."
      >
        <div className="flex flex-wrap gap-3">
          {[
            { label: "14-day returns", href: "/returns" },
            { label: "Nationwide delivery", href: "/shipping" },
            { label: "Track orders", href: "/account/orders" }
          ].map((pill) => (
            <Link
              key={pill.href}
              href={pill.href}
              className="rounded-full border border-furni-primary/15 bg-white px-4 py-2 text-sm font-medium text-furni-primary shadow-sm transition hover:border-furni-primary/30"
            >
              {pill.label}
            </Link>
          ))}
        </div>
      </PageHero>

      <section className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {supportChannels.map((channel) => (
          <HelpTopicCard key={channel.title} {...channel} />
        ))}
      </section>

      <ProcessSteps
        title="How we help"
        description="Start self-service, then reach out if you need a person—we keep every thread tied to your order when possible."
        steps={supportProcessSteps}
      />

      <section className="mt-14">
        <p className="covmerc-eyebrow">FAQs</p>
        <h2 className="mt-2 font-display text-2xl text-furni-primary md:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-furni-muted md:text-base">
          Can’t find what you need?{" "}
          <Link href="/contact" className="font-medium text-furni-primary hover:underline">
            Contact us
          </Link>{" "}
          or review our{" "}
          <Link href="/privacy" className="font-medium text-furni-primary hover:underline">
            Privacy Policy
          </Link>
          ,{" "}
          <Link href="/shipping" className="font-medium text-furni-primary hover:underline">
            Shipping
          </Link>
          , and{" "}
          <Link href="/returns" className="font-medium text-furni-primary hover:underline">
            Returns
          </Link>
          .
        </p>
        <SupportFaqExplorer items={supportFaqs} />
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Email",
            body: companyContact.supportEmail,
            href: `mailto:${companyContact.supportEmail}`,
            cta: "Send email"
          },
          {
            title: "Phone",
            body: companyContact.phone,
            href: `tel:${companyContact.phone.replace(/\s/g, "")}`,
            cta: "Call studio"
          },
          {
            title: "Studio hours",
            body: companyContact.hours.weekdays,
            href: "/contact",
            cta: "Visit contact page"
          }
        ].map((channel) => (
          <FurniCard key={channel.title} interactive={false} className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-furni-accent">
              {channel.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-furni-muted">{channel.body}</p>
            <a
              href={channel.href}
              className="mt-4 inline-block text-sm font-semibold text-furni-primary hover:underline"
            >
              {channel.cta} →
            </a>
          </FurniCard>
        ))}
      </section>

      <CtaBanner
        className="mt-14"
        eyebrow="Still stuck?"
        title="Talk to a real person in Lagos"
        description={`Email ${companyContact.supportEmail} or call ${companyContact.phone} during studio hours. Include your order number for faster help.`}
        primary={{ href: "/contact", label: "Contact Covmerc" }}
        secondary={{ href: "/account/orders", label: "View orders" }}
      />

      <RelatedPages
        title="Related"
        links={[...relatedPageGroups.help, ...relatedPageGroups.legal, ...relatedPageGroups.explore.slice(0, 2)]}
      />
    </MarketingShell>
  );
}
