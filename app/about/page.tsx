import Link from "next/link";
import { FurniImage } from "@/components/ui/FurniImage";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { aboutMilestones, companyContact, relatedPageGroups } from "@/lib/site-content";

const values = [
  {
    title: "Sustainable sourcing",
    description:
      "We partner with workshops that use certified wood, low-VOC finishes, and responsible packaging—so your furniture looks good and sits lightly on the planet.",
    icon: "🌿"
  },
  {
    title: "Built for real homes",
    description:
      "Every piece is chosen for daily use: stable joints, fabrics that handle Lagos humidity, and proportions that work in apartments and family homes alike.",
    icon: "🏠"
  },
  {
    title: "Transparent commerce",
    description:
      "Clear pricing, honest delivery timelines, and support you can reach by phone or email. The same Covmerc experience on web and in our mobile app.",
    icon: "✦"
  }
] as const;

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.05fr,1fr] lg:items-center">
          <PageHero
            eyebrow="About Covmerc"
            title="Furniture that fits how Nigerians actually live"
            description="Covmerc started with a simple idea: beautiful, durable furniture should be easy to discover, easy to order, and backed by people who care about your home—not just your checkout. Today we connect customers and trusted makers through our studio collection and vendor marketplace."
          >
            <div className="flex flex-wrap gap-3">
              <Link href="/shop">
                <FurniButton variant="accent">Shop the collection</FurniButton>
              </Link>
              <Link href="/contact">
                <FurniButton variant="outline">Talk to our team</FurniButton>
              </Link>
            </div>
          </PageHero>
          <FurniImage
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80"
            alt="Covmerc studio interior with modern furniture"
            variant="detail"
            className="min-h-[340px] rounded-3xl"
            priority
          />
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {values.map((item) => (
            <FurniCard key={item.title} className="animate-fade-up">
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-furni-primary">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-furni-muted">{item.description}</p>
            </FurniCard>
          ))}
        </section>

        <section className="mt-14 grid gap-8 rounded-3xl bg-furni-primary px-6 py-10 text-white md:grid-cols-2 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-furni-accent">Our mission</p>
            <h2 className="mt-2 font-display text-3xl">
              Make thoughtful design accessible across Nigeria
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/80">
              Whether you are furnishing your first flat in Lekki or refreshing a family home in
              Abuja, Covmerc helps you compare materials, understand dimensions, and order with
              confidence. Vendors on our platform are reviewed for quality; every listing is a
              promise we stand behind with customer support.
            </p>
          </div>
          <FurniCard className="bg-white/10 text-white ring-1 ring-white/15">
            <h3 className="font-semibold text-furni-accent">Visit our studio</h3>
            <p className="mt-2 text-sm text-white/85">{companyContact.address}</p>
            <p className="mt-2 text-sm text-white/85">{companyContact.phone}</p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${companyContact.email}`} className="underline hover:text-furni-accent">
                {companyContact.email}
              </a>
            </p>
            <p className="mt-4 text-xs text-white/70">{companyContact.hours.weekdays}</p>
            <p className="text-xs text-white/70">{companyContact.hours.saturday}</p>
          </FurniCard>
        </section>

        <section className="mt-14">
          <h2 className="font-display text-3xl text-furni-primary">How we grew</h2>
          <p className="mt-2 max-w-2xl text-sm text-furni-muted">
            From a small curation studio to a nationwide marketplace—still obsessed with craft and
            service.
          </p>
          <ol className="mt-8 space-y-6 border-l-2 border-furni-primary/20 pl-6">
            {aboutMilestones.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[1.6rem] top-1 flex h-3 w-3 rounded-full bg-furni-accent ring-4 ring-furni-surface" />
                <p className="text-xs font-semibold uppercase tracking-wide text-furni-muted">
                  {item.year}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-furni-primary">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-furni-muted">{item.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <RelatedPages
          title="Continue exploring"
          links={[...relatedPageGroups.explore, ...relatedPageGroups.help]}
        />
      </main>
      <Footer />
    </div>
  );
}
