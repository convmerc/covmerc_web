"use client";

import Image from "next/image";
import Link from "next/link";
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

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />

      <main className="flex-1">
        <section className="bg-furni-primary text-white">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-[1.05fr,1fr] md:px-6 lg:px-8 lg:py-16">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Modern Interior
                <br />
                Design Studio
              </h1>
              <p className="max-w-md text-sm text-white/80 md:text-base">
                Craft your home with furniture that blends comfort, craftsmanship,
                and sustainable materials.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/shop">
                  <FurniButton variant="accent">Shop Now</FurniButton>
                </Link>
                <Link href="/about">
                  <FurniButton variant="outline" className="border-white/40 text-white">
                    Explore
                  </FurniButton>
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -right-4 -top-3 h-24 w-24 rounded-full bg-furni-accent/50 blur-2xl" />
              <Image
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80"
                alt="Furni sofa hero"
                width={900}
                height={620}
                className="h-auto w-full rounded-3xl object-cover"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-14 md:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
                Crafted with excellent material
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-furni-primary">
                Featured Products
              </h2>
            </div>
            <Link href="/shop" className="text-sm font-medium text-furni-primary">
              View all
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <FurniCard key={product.id} className="overflow-hidden p-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={450}
                  className="h-52 w-full object-cover"
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

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 md:grid-cols-[1.1fr,1fr] md:px-6 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold text-furni-primary">Why Choose Us</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {whyChooseFeatures.map((feature) => (
                <FurniCard key={feature.title} className="rounded-2xl p-4">
                  <h3 className="text-base font-semibold text-furni-ink">
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

        <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-14 md:grid-cols-[1fr,1.1fr] md:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3">
            <Image
              src="https://images.unsplash.com/photo-1616594039964-3e996fdc16f2?auto=format&fit=crop&w=1000&q=80"
              alt="Wood table styling"
              width={400}
              height={500}
              className="h-full min-h-[220px] w-full rounded-3xl object-cover"
            />
            <Image
              src="https://images.unsplash.com/photo-1617098474202-0d0d7f60a66c?auto=format&fit=crop&w=800&q=80"
              alt="Accent table detail"
              width={400}
              height={500}
              className="h-full min-h-[220px] w-full rounded-3xl object-cover"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold text-furni-primary">
              We help you make modern interior design
            </h2>
            <p className="text-sm leading-relaxed text-furni-muted">
              Furni combines premium craftsmanship with practical function. Our
              furniture collection is curated to keep your space calm, timeless,
              and ready for modern life.
            </p>
            <ul className="grid gap-2 text-sm text-furni-muted md:grid-cols-2">
              <li>• Carefully sourced sustainable materials</li>
              <li>• Tested durability and finish quality</li>
              <li>• Space-savvy dimensions and proportions</li>
              <li>• Thoughtful delivery and setup support</li>
            </ul>
            <Link href="/about">
              <FurniButton>Explore Story</FurniButton>
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 pb-14 text-center md:px-6">
          <h2 className="text-3xl font-semibold text-furni-primary">Testimonials</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <FurniCard key={testimonial.id} className="text-left">
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

        <section className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-semibold text-furni-primary">Recent Blog</h2>
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

