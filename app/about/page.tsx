import Image from "next/image";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniCard } from "@/components/ui/FurniCard";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <section className="grid gap-8 md:grid-cols-[1.1fr,1fr] md:items-center">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
              About Covmerc
            </p>
            <h1 className="font-display text-5xl text-furni-primary">
              Sustainable Craftsmanship for Modern Living
            </h1>
            <p className="text-sm leading-relaxed text-furni-muted">
              Covmerc was founded to build timeless furniture with responsible
              materials and transparent manufacturing. We collaborate with artisan
              makers who prioritize durability, repairability, and low-impact
              production.
            </p>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1200&q=80"
            alt="Covmerc studio interior"
            width={900}
            height={620}
            className="h-full min-h-[320px] w-full rounded-3xl object-cover"
          />
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <FurniCard>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-furni-primary">
              <span className="inline-flex h-4 w-4 items-center justify-center">❧</span>
              Sustainable sourcing
            </h2>
            <p className="mt-2 text-sm text-furni-muted">
              We use certified wood, durable textiles, and water-based finishes to
              keep our footprint low.
            </p>
          </FurniCard>
          <FurniCard>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-furni-primary">
              <span className="inline-flex h-4 w-4 items-center justify-center">✦</span>
              Thoughtful design
            </h2>
            <p className="mt-2 text-sm text-furni-muted">
              Every silhouette is tested for comfort, proportions, and seamless fit
              in urban homes.
            </p>
          </FurniCard>
          <FurniCard>
            <h2 className="inline-flex items-center gap-2 text-lg font-semibold text-furni-primary">
              <span className="inline-flex h-4 w-4 items-center justify-center">⛨</span>
              Modern living tips
            </h2>
            <p className="mt-2 text-sm text-furni-muted">
              Our design team shares styling guides that balance texture, light, and
              practical functionality.
            </p>
          </FurniCard>
        </section>
      </main>
      <Footer />
    </div>
  );
}
