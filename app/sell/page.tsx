import Link from "next/link";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { ProcessSteps } from "@/components/content/ProcessSteps";
import { RelatedPages } from "@/components/content/RelatedPages";
import { AppStoreButtons } from "@/components/sell/AppStoreButtons";
import { SellPageStatusPanel } from "@/components/sell/SellPageStatusPanel";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { CtaBanner } from "@/components/ui/CtaBanner";
import {
  companyContact,
  relatedPageGroups,
  sellPageBenefits,
  sellPageEligibility,
  sellPageFaqs,
  sellPageRequirements,
  sellPageSteps
} from "@/lib/site-content";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Sell on Covmerc",
  description:
    "Learn how to sell furniture on Covmerc—open to everyone, no sign-in required. Register as a vendor in the mobile app and manage listings on the web once approved.",
  path: "/sell"
});

export default function SellPage() {
  return (
    <MarketingShell>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Sell on Covmerc" }
        ]}
      />

      <section className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-start">
        <PageHero
          eyebrow="Marketplace vendors"
          title="Sell furniture on Covmerc"
          description="Anyone can read this page—no account needed. Covmerc connects verified makers and sellers with buyers across Nigeria. Download the app to apply; use the web vendor portal after approval."
        >
          <AppStoreButtons />
          <p className="mt-4 text-xs text-furni-muted">
            Based in {companyContact.address.split(",").slice(-2).join(",").trim()} ·{" "}
            {companyContact.hours.weekdays}
          </p>
        </PageHero>

        <SellPageStatusPanel />
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <FurniCard interactive={false} className="p-6">
          <p className="covmerc-eyebrow">Who can apply</p>
          <h2 className="mt-2 font-display text-xl text-furni-primary">Built for serious sellers</h2>
          <ul className="mt-4 space-y-3">
            {sellPageEligibility.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-furni-muted">
                <span className="text-furni-accent" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </FurniCard>

        <FurniCard interactive={false} className="p-6">
          <p className="covmerc-eyebrow">Before you apply</p>
          <h2 className="mt-2 font-display text-xl text-furni-primary">What to prepare</h2>
          <ul className="mt-4 space-y-4">
            {sellPageRequirements.map((item) => (
              <li key={item.title}>
                <p className="font-semibold text-furni-primary">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-furni-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </FurniCard>
      </section>

      <ProcessSteps
        title="How vendor registration works"
        description="The mobile app handles onboarding and verification. The website is your command centre once you are approved."
        steps={sellPageSteps}
      />

      <section className="mt-14">
        <p className="covmerc-eyebrow">Why sell with us</p>
        <h2 className="mt-2 font-display text-2xl text-furni-primary md:text-3xl">
          Built for makers, not just marketplaces
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sellPageBenefits.map((item) => (
            <FurniCard key={item.title} interactive={false} className="p-5">
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="mt-3 font-semibold text-furni-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-furni-muted">{item.description}</p>
            </FurniCard>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-3xl border border-furni-primary/10 bg-white p-6 shadow-soft md:p-8">
        <p className="covmerc-eyebrow">After approval</p>
        <h2 className="mt-2 font-display text-2xl text-furni-primary">Manage selling on the web</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-furni-muted md:text-base">
          Approved vendors use the same tools you know from the app, plus a desktop-friendly
          dashboard for catalog and order management.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            "Add and edit product listings (pending review)",
            "Track orders that include your items",
            "View business profile synced from the app",
            "Coordinate with Covmerc support on delivery"
          ].map((item) => (
            <li
              key={item}
              className="flex gap-2 rounded-2xl bg-furni-surface px-4 py-3 text-sm text-furni-muted"
            >
              <span className="text-furni-accent" aria-hidden>
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/auth/login?next=/vendor">
            <FurniButton variant="outline">Sign in for vendor portal</FurniButton>
          </Link>
          <Link href="/contact">
            <FurniButton variant="ghost" className="text-furni-muted">
              Partnership inquiry
            </FurniButton>
          </Link>
        </div>
        <p className="mt-2 text-xs text-furni-muted">
          Vendor portal access requires an approved vendor account.
        </p>
      </section>

      <section className="mt-14">
        <p className="covmerc-eyebrow">Common questions</p>
        <h2 className="mt-2 font-display text-2xl text-furni-primary">Vendor FAQ</h2>
        <div className="mt-6 space-y-3">
          {sellPageFaqs.map((item) => (
            <FurniCard key={item.question} interactive={false} className="p-5">
              <h3 className="font-semibold text-furni-primary">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-furni-muted">{item.answer}</p>
            </FurniCard>
          ))}
        </div>
      </section>

      <CtaBanner
        className="mt-14"
        variant="primary"
        eyebrow="Partnerships"
        title="Questions about selling on Covmerc?"
        description="Our team helps with vendor onboarding, listing quality, and delivery coordination."
        primary={{ href: "/contact", label: "Contact us" }}
        secondary={{ href: "/support", label: "Help center" }}
      />

      <RelatedPages
        className="mt-12"
        title="Explore Covmerc"
        links={[...relatedPageGroups.explore, ...relatedPageGroups.help]}
      />
    </MarketingShell>
  );
}
