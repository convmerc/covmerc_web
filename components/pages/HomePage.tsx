"use client";

import Link from "next/link";
import { FurniImage } from "@/components/ui/FurniImage";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/TrustBar";
import { testimonials, whyChooseFeatures } from "@/lib/furni-data";
import {
  homeProcessSteps,
  roomCollections,
  shopCategories
} from "@/lib/catalog-content";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

export function HomePage() {
  const { products, blogPosts, addToCart } = useFurniStore();
  const featuredProducts = products.filter((item) => item.featured).slice(0, 3);
  const displayFeatured =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);

  const stats = [
    { label: "Happy customers", value: "8.2k+" },
    { label: "Curated pieces", value: `${products.length || 240}+` },
    { label: "Cities served", value: "19" }
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-furni-primary text-white">
          <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-furni-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr,1fr] md:px-6 lg:px-8 lg:py-20">
            <div className="space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.15em] text-furni-accent backdrop-blur-sm">
                <span aria-hidden>✦</span>
                Covmerc Studio · Lagos
              </span>
              <h1 className="font-display text-5xl leading-[1.08] md:text-6xl lg:text-[3.5rem]">
                Furniture for homes
                <br />
                <span className="text-furni-accent">you actually live in</span>
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-white/85">
                Discover curated chairs, tables, and sofas from trusted makers—shop on the web
                or in the Covmerc app, with delivery across Nigeria and support from real people.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/shop">
                  <FurniButton variant="accent" className="inline-flex items-center gap-2 px-6">
                    Shop collection
                    <span aria-hidden>→</span>
                  </FurniButton>
                </Link>
                <Link href="/about">
                  <FurniButton variant="outline" className="border-white/40 px-6 text-white">
                    Our story
                  </FurniButton>
                </Link>
              </div>
              <div className="grid max-w-lg grid-cols-3 gap-3 pt-2">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-sm"
                  >
                    <p className="text-xl font-semibold text-furni-accent">{item.value}</p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-wide text-white/65">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl animate-fade-up">
              <FurniImage
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80"
                alt="Covmerc living room sofa"
                variant="hero"
                priority
                className="rounded-3xl ring-1 ring-white/20 animate-float-soft"
              />
              <FurniCard className="absolute -bottom-4 -left-2 max-w-[200px] border-white/20 bg-white/95 p-3 shadow-lg backdrop-blur md:-left-6">
                <p className="text-[10px] uppercase tracking-wide text-furni-muted">This week</p>
                <p className="text-sm font-semibold text-furni-primary">Free Lagos delivery</p>
                <p className="text-xs text-furni-muted">On orders over ₦150,000</p>
              </FurniCard>
            </div>
          </div>
        </section>

        <TrustBar variant="dark" />

        {/* Shop by category */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Collections"
            title="Shop by category"
            description="Start with the room you are furnishing—or jump straight into our full catalog of verified listings."
            action={{ href: "/shop", label: "View all products" }}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {shopCategories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${encodeURIComponent(cat.id)}`}>
                <FurniCard className="group overflow-hidden p-0">
                  <FurniImage
                    src={cat.image}
                    alt={cat.label}
                    variant="card"
                    imageClassName="transition duration-500 group-hover:scale-105"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-furni-primary">{cat.label}</h3>
                    <p className="mt-1 text-sm text-furni-muted">{cat.description}</p>
                    <span className="mt-3 inline-block text-xs font-semibold text-furni-primary">
                      Explore →
                    </span>
                  </div>
                </FurniCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Editor's pick"
              title="Featured this season"
              description="Hand-selected pieces balancing comfort, proportion, and materials that age well in Nigerian homes."
              action={{ href: "/shop", label: "Shop all" }}
            />
            {displayFeatured.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-3">
                {displayFeatured.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(id) => addToCart(id, 1)}
                  />
                ))}
              </div>
            ) : (
              <FurniCard className="text-center">
                <p className="text-sm text-furni-muted">Loading our catalog…</p>
              </FurniCard>
            )}
          </div>
        </section>

        {/* Room collections */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Inspiration"
            title="Curated for real rooms"
            description="Not sure where to start? These edit boards pair bestsellers with styling notes from our Lagos studio."
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {roomCollections.map((room) => (
              <Link key={room.title} href={room.href}>
                <FurniCard className="group overflow-hidden p-0">
                  <div className="relative">
                    <FurniImage
                      src={room.image}
                      alt={room.title}
                      variant="card"
                      imageClassName="transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-furni-primary/80 via-furni-primary/20 to-transparent" />
                    <div className="absolute bottom-0 p-5 text-white">
                      <h3 className="font-display text-2xl">{room.title}</h3>
                      <p className="mt-1 text-sm text-white/85">{room.description}</p>
                    </div>
                  </div>
                </FurniCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Why choose + image */}
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.05fr,1fr] md:items-center md:px-6 lg:px-8">
          <div>
            <SectionHeader
              eyebrow="The Covmerc difference"
              title="Why thousands choose us"
              description="We are not just a listing site—we review vendors, publish honest specs, and stay with you after delivery."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              {whyChooseFeatures.map((feature, index) => (
                <FurniCard key={feature.title} className="p-4">
                  <span className="text-xs font-semibold text-furni-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-semibold text-furni-primary">{feature.title}</h3>
                  <p className="mt-1 text-sm text-furni-muted">{feature.description}</p>
                </FurniCard>
              ))}
            </div>
          </div>
          <FurniImage
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80"
            alt="Covmerc curated living room"
            variant="detail"
            className="min-h-[360px] rounded-3xl"
          />
        </section>

        {/* How it works */}
        <section className="border-y border-furni-primary/10 bg-furni-primary/5 py-16">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Simple journey"
              title="From browse to delivered"
              description="Three steps—no hidden surprises at checkout."
              align="center"
            />
            <div className="grid gap-6 md:grid-cols-3">
              {homeProcessSteps.map((step) => (
                <FurniCard key={step.step} className="relative overflow-hidden p-6">
                  <span className="font-display text-5xl text-furni-primary/15">{step.step}</span>
                  <h3 className="mt-2 text-lg font-semibold text-furni-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-furni-muted">{step.description}</p>
                </FurniCard>
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Link href="/shop">
                <FurniButton variant="primary" className="px-8">
                  Start shopping
                </FurniButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Craft story */}
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1fr,1.05fr] md:items-center md:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3">
            <FurniImage
              src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1000&q=80"
              alt="Wood furniture detail"
              variant="inline"
              className="min-h-[240px] rounded-3xl"
            />
            <FurniImage
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
              alt="Modern accent furniture"
              variant="inline"
              className="mt-8 min-h-[240px] rounded-3xl"
            />
          </div>
          <div className="space-y-5">
            <SectionHeader
              eyebrow="Craft & care"
              title="Designed for modern Nigerian living"
              description="Humidity, guest nights, and tight floor plans—we factor it all in when we curate each piece."
            />
            <ul className="grid gap-3 text-sm text-furni-muted">
              {[
                "Certified timber and low-emission finishes",
                "Dimensions listed for every product",
                "Vendor reviews and quality checks before listing",
                "Delivery coordination and aftercare support"
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-furni-primary text-[10px] text-white">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href="/about">
                <FurniButton>Explore our story</FurniButton>
              </Link>
              <Link href="/contact">
                <FurniButton variant="outline">Ask a stylist</FurniButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Community"
            title="Loved in real homes"
            description="Customers and stylists across Nigeria share why they keep coming back to Covmerc."
            align="center"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <FurniCard key={testimonial.id} className="flex flex-col">
                <p className="mb-3 inline-flex gap-0.5 text-furni-accent" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx}>★</span>
                  ))}
                </p>
                <p className="flex-1 text-sm leading-relaxed text-furni-muted">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-furni-primary/10 pt-4">
                  <p className="font-semibold text-furni-primary">{testimonial.author}</p>
                  <p className="text-xs uppercase tracking-wide text-furni-muted">
                    {testimonial.role}
                  </p>
                </div>
              </FurniCard>
            ))}
          </div>
        </section>

        {/* Blog */}
        <section className="bg-white pt-16 pb-20 md:pb-28">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
            <SectionHeader
              eyebrow="Covmerc Journal"
              title="Ideas for your next refresh"
              description="Styling tips, material guides, and small-space hacks from our design team."
              action={{ href: "/blog", label: "All articles" }}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <FurniCard className="h-full overflow-hidden p-0 transition hover:-translate-y-1">
                    <FurniImage src={post.coverImage} alt={post.title} variant="card" />
                    <div className="space-y-2 p-4">
                      <p className="text-xs uppercase tracking-wide text-furni-muted">
                        {post.publishedAt} · {post.category}
                      </p>
                      <h3 className="text-lg font-semibold text-furni-primary">{post.title}</h3>
                      <p className="line-clamp-2 text-sm text-furni-muted">{post.excerpt}</p>
                    </div>
                  </FurniCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Dual CTA */}
        <section className="mx-auto w-full max-w-6xl border-t border-furni-primary/10 px-4 pt-16 pb-20 md:px-6 md:pt-20 lg:px-8 lg:pb-24">
          <div className="grid gap-4 md:grid-cols-2">
            <FurniCard className="bg-furni-primary p-8 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-furni-accent">Shop</p>
              <h3 className="mt-2 font-display text-3xl">Ready to furnish your space?</h3>
              <p className="mt-2 text-sm text-white/80">
                Browse the full catalog with filters, specs, and fast add-to-cart.
              </p>
              <Link href="/shop" className="mt-6 inline-block">
                <FurniButton variant="accent">View shop</FurniButton>
              </Link>
            </FurniCard>
            <FurniCard className="p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Support</p>
              <h3 className="mt-2 font-display text-3xl text-furni-primary">Questions before you buy?</h3>
              <p className="mt-2 text-sm text-furni-muted">
                Our Lagos team helps with sizing, delivery, and post-purchase care.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Link href="/support">
                  <FurniButton variant="outline">Help center</FurniButton>
                </Link>
                <Link href="/contact">
                  <FurniButton>Contact us</FurniButton>
                </Link>
              </div>
            </FurniCard>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
