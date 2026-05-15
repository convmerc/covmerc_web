"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Sparkles, Star } from "lucide-react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { testimonials, whyChooseFeatures } from "@/lib/furni-data";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

export default function HomePage() {
  const { products, blogPosts, addToCart } = useFurniStore();
  const featuredProducts = products.filter((item) => item.featured).slice(0, 3);
  const latestPosts = blogPosts.slice(0, 3);
  const stats = [
    { label: "Happy Customers", value: "8.2k+" },
    { label: "Curated Products", value: "240+" },
    { label: "Cities Delivered", value: "19" }
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />

      <main className="flex-1">
        <section className="bg-furni-primary text-white">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-[1.05fr,1fr] md:px-6 lg:px-8 lg:py-16">
            <div className="space-y-6 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.15em] text-furni-accent">
                <Sparkles className="h-3.5 w-3.5" />
                Covmerc Signature Collection
              </span>
              <h1 className="font-display text-5xl leading-tight md:text-6xl">
                Modern Interior
                <br />
                by Covmerc Studio
              </h1>
              <p className="max-w-md text-sm text-white/80 md:text-base">
                Reimagine your space with premium furniture, thoughtful craftsmanship,
                and a commerce journey designed for modern living.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/shop">
                  <FurniButton variant="accent" className="inline-flex items-center gap-1.5">
                    Shop Now
                    <ArrowRight className="h-4 w-4" />
                  </FurniButton>
                </Link>
                <Link href="/about">
                  <FurniButton variant="outline" className="border-white/40 text-white">
                    Learn More
                  </FurniButton>
                </Link>
              </div>
              <div className="grid max-w-lg grid-cols-3 gap-2">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-xl bg-white/10 px-3 py-2">
                    <p className="text-lg font-semibold text-furni-accent">{item.value}</p>
                    <p className="text-[11px] uppercase tracking-wide text-white/70">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl animate-fade-up">
              <div className="absolute -right-4 -top-3 h-24 w-24 rounded-full bg-furni-accent/50 blur-2xl" />
              <Image
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80"
                alt="Covmerc sofa hero"
                width={900}
                height={620}
                className="h-auto w-full rounded-3xl object-cover animate-float-soft"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 lg:px-8 animate-fade-up">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
                Crafted with excellent material
              </p>
              <h2 className="mt-2 font-display text-4xl text-furni-primary">
                Featured Products
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-medium text-furni-primary">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <FurniCard key={product.id} className="group overflow-hidden p-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={450}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="space-y-2 p-4">
                  <h3 className="text-lg font-semibold text-furni-primary">
                    {product.name}
                  </h3>
                  <p className="text-sm text-furni-muted">{product.shortDescription}</p>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-lg font-semibold text-furni-ink">
                      ${product.price}
                    </p>
                    <FurniButton
                      variant="primary"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => addToCart(product.id, 1)}
                    >
                      Add
                    </FurniButton>
                  </div>
                </div>
              </FurniCard>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 md:grid-cols-[1.1fr,1fr] md:px-6 lg:px-8 animate-fade-up">
          <div>
            <h2 className="font-display text-4xl text-furni-primary">Why Choose Covmerc</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {whyChooseFeatures.map((feature) => (
                <FurniCard key={feature.title} className="rounded-2xl p-4">
                  <h3 className="inline-flex items-center gap-2 text-base font-semibold text-furni-ink">
                    <ShieldCheck className="h-4 w-4 text-furni-primary" />
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-sm text-furni-muted">{feature.description}</p>
                </FurniCard>
              ))}
            </div>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80"
            alt="Curated living room setup"
            width={820}
            height={660}
            className="h-full min-h-[320px] w-full rounded-3xl object-cover"
          />
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 md:grid-cols-[1fr,1.1fr] md:px-6 lg:px-8 animate-fade-up">
          <div className="grid grid-cols-2 gap-3">
            <Image
              src="https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=1000&q=80"
              alt="Covmerc wood table styling"
              width={400}
              height={500}
              className="h-full min-h-[220px] w-full rounded-3xl object-cover"
            />
            <Image
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"
              alt="Covmerc accent table detail"
              width={400}
              height={500}
              className="h-full min-h-[220px] w-full rounded-3xl object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="font-display text-4xl text-furni-primary">
              We help you make modern interior design
            </h2>
            <p className="text-sm leading-relaxed text-furni-muted">
              Covmerc combines premium craftsmanship with practical functionality.
              Our collection is curated to keep your space timeless, comfortable,
              and ready for modern life.
            </p>
            <ul className="grid gap-2 text-sm text-furni-muted md:grid-cols-2">
              <li className="inline-flex items-start gap-2">
                <Leaf className="mt-0.5 h-4 w-4 text-furni-primary" />
                Carefully sourced sustainable materials
              </li>
              <li className="inline-flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 text-furni-primary" />
                Tested durability and finish quality
              </li>
              <li className="inline-flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 text-furni-primary" />
                Space-savvy dimensions and proportions
              </li>
              <li className="inline-flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-furni-primary" />
                Thoughtful delivery and setup support
              </li>
            </ul>
            <Link href="/about">
              <FurniButton className="inline-flex items-center gap-1.5">
                Explore Story
                <ArrowRight className="h-4 w-4" />
              </FurniButton>
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-14 text-center md:px-6 animate-fade-up">
          <h2 className="font-display text-4xl text-furni-primary">Testimonials</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <FurniCard key={testimonial.id} className="text-left">
                <p className="mb-2 inline-flex items-center text-furni-accent">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </p>
                <p className="text-sm leading-relaxed text-furni-muted">
                  “{testimonial.quote}”
                </p>
                <p className="mt-4 text-base font-semibold text-furni-primary">
                  {testimonial.author}
                </p>
                <p className="text-xs uppercase tracking-wide text-furni-muted">
                  {testimonial.role}
                </p>
              </FurniCard>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6 lg:px-8 animate-fade-up">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-4xl text-furni-primary">Recent Blog</h2>
            <Link href="/blog" className="text-sm font-medium text-furni-primary">
              View all posts
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link key={post.id} href="/blog">
                <FurniCard className="h-full overflow-hidden p-0">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={500}
                    height={360}
                    className="h-48 w-full object-cover"
                  />
                  <div className="space-y-2 p-4">
                    <p className="text-xs uppercase tracking-wide text-furni-muted">
                      {post.publishedAt}
                    </p>
                    <h3 className="text-lg font-semibold text-furni-primary">
                      {post.title}
                    </h3>
                    <p className="text-sm text-furni-muted">{post.excerpt}</p>
                  </div>
                </FurniCard>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

