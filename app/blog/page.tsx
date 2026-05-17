"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FurniImage } from "@/components/ui/FurniImage";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { FilterPill } from "@/components/ui/FilterPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { LoadingState } from "@/components/ui/LoadingState";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { blogPostHref } from "@/lib/blog-utils";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { relatedPageGroups } from "@/lib/site-content";

export default function BlogPage() {
  const { blogPosts, storeLoading } = useFurniStore();
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
  const gridPosts = activeCategory === "All" ? rest : filteredPosts;
  const showFeatured = featured && activeCategory === "All" && blogPosts.length > 0;

  return (
    <MarketingShell>
      <PageHero
        eyebrow="Covmerc Journal"
        title="Ideas for homes you actually live in"
        description="Practical styling tips, material guides, and behind-the-scenes stories from our Lagos studio—written for renters, new homeowners, and anyone upgrading room by room."
      />

      {storeLoading ? (
        <div className="mt-10">
          <LoadingState message="Loading articles…" />
        </div>
      ) : blogPosts.length === 0 ? (
        <EmptyState
          className="mt-10"
          title="No articles yet"
          description="Our design team is preparing fresh stories on styling, materials, and small-space living. Check back soon or browse the shop in the meantime."
        >
          <Link href="/shop">
            <FurniButton variant="accent">Browse shop</FurniButton>
          </Link>
        </EmptyState>
      ) : (
        <>
          {showFeatured ? (
            <Link href={blogPostHref(featured)} className="mt-10 block animate-fade-up">
              <FurniCard className="grid overflow-hidden p-0 lg:grid-cols-[1.2fr,1fr]">
                <FurniImage
                  src={featured.coverImage}
                  alt={featured.title}
                  variant="hero"
                  className="min-h-[280px] lg:min-h-full"
                />
                <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
                  <p className="covmerc-eyebrow">
                    Featured · {featured.category}
                  </p>
                  <h2 className="font-display text-3xl text-balance text-furni-primary">
                    {featured.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-furni-muted">{featured.excerpt}</p>
                  <p className="text-xs text-furni-muted">
                    {featured.publishedAt} · {featured.author}
                  </p>
                  <span className="text-sm font-semibold text-furni-primary">Read article →</span>
                </div>
              </FurniCard>
            </Link>
          ) : null}

          {categories.length > 1 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {categories.map((category) => (
                <FilterPill
                  key={category}
                  label={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>
          ) : null}

          {gridPosts.length === 0 ? (
            <EmptyState
              className="mt-8"
              icon="search"
              title="No articles in this category"
              description="Try another topic or view all posts."
            >
              <FurniButton variant="outline" onClick={() => setActiveCategory("All")}>
                View all articles
              </FurniButton>
            </EmptyState>
          ) : (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <Link key={post.id} href={blogPostHref(post)}>
                  <FurniCard className="h-full overflow-hidden p-0">
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
          )}

          <CtaBanner
            className="mt-12"
            variant="primary"
            eyebrow="Stay inspired"
            title="Have a home project in mind?"
            description="Tell us about your space and budget—we will suggest pieces from the shop and share relevant articles from the journal."
            primary={{ href: "/contact", label: "Get design guidance" }}
          />
        </>
      )}

      <RelatedPages title="More from Covmerc" links={relatedPageGroups.explore} />
    </MarketingShell>
  );
}
