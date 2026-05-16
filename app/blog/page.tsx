"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FurniImage } from "@/components/ui/FurniImage";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { relatedPageGroups } from "@/lib/site-content";

export default function BlogPage() {
  const { blogPosts } = useFurniStore();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const unique = new Set(blogPosts.map((post) => post.category));
    return ["All", ...Array.from(unique)];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") return blogPosts;
    return blogPosts.filter((post) => post.category === activeCategory);
  }, [blogPosts, activeCategory]);

  const featured = blogPosts[0];
  const rest = filteredPosts.filter((post) => post.id !== featured?.id);

  return (
    <MarketingShell>
        <PageHero
          eyebrow="Covmerc Journal"
          title="Ideas for homes you actually live in"
          description="Practical styling tips, material guides, and behind-the-scenes stories from our Lagos studio—written for renters, new homeowners, and anyone upgrading room by room."
        />

        {featured && activeCategory === "All" ? (
          <Link href={`/blog/${featured.id}`} className="mt-10 block animate-fade-up">
            <FurniCard className="grid overflow-hidden p-0 lg:grid-cols-[1.2fr,1fr]">
              <FurniImage
                src={featured.coverImage}
                alt={featured.title}
                variant="hero"
                className="min-h-[280px] lg:min-h-full"
              />
              <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
                  Featured · {featured.category}
                </p>
                <h2 className="font-display text-3xl text-furni-primary">{featured.title}</h2>
                <p className="text-sm leading-relaxed text-furni-muted">{featured.excerpt}</p>
                <p className="text-xs text-furni-muted">
                  {featured.publishedAt} · {featured.author}
                </p>
                <span className="text-sm font-semibold text-furni-primary">Read article →</span>
              </div>
            </FurniCard>
          </Link>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeCategory === category
                  ? "bg-furni-primary text-white"
                  : "bg-white text-furni-primary ring-1 ring-furni-primary/15 hover:bg-furni-primary/5"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(activeCategory === "All" ? rest : filteredPosts).map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`}>
              <FurniCard className="h-full overflow-hidden p-0 transition hover:-translate-y-1">
                <FurniImage src={post.coverImage} alt={post.title} variant="card" />
                <div className="space-y-2 p-4">
                  <p className="text-xs uppercase tracking-wide text-furni-muted">
                    {post.publishedAt} · {post.category}
                  </p>
                  <h2 className="text-lg font-semibold text-furni-primary">{post.title}</h2>
                  <p className="line-clamp-3 text-sm text-furni-muted">{post.excerpt}</p>
                  <span className="text-xs font-medium text-furni-primary">Read more →</span>
                </div>
              </FurniCard>
            </Link>
          ))}
        </div>

        <FurniCard className="mt-12 flex flex-col items-start justify-between gap-4 bg-furni-primary text-white md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-furni-accent">Stay inspired</p>
            <h2 className="mt-1 font-display text-2xl">Have a home project in mind?</h2>
            <p className="mt-2 max-w-lg text-sm text-white/80">
              Tell us about your space and budget—we will suggest pieces from the shop and share
              relevant articles from the journal.
            </p>
          </div>
          <Link href="/contact">
            <FurniButton variant="accent">Get design guidance</FurniButton>
          </Link>
        </FurniCard>

        <RelatedPages title="More from Covmerc" links={relatedPageGroups.explore} />
    </MarketingShell>
  );
}
