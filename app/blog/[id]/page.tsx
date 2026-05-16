"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { FurniImage } from "@/components/ui/FurniImage";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RelatedPages } from "@/components/content/RelatedPages";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { relatedPageGroups } from "@/lib/site-content";

function paragraphsFromContent(content: string) {
  return content.split(/\n\n+/).filter(Boolean);
}

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const { blogPosts } = useFurniStore();
  const post = blogPosts.find((entry) => entry.id === params.id);

  if (!post) {
    notFound();
  }

  const related = blogPosts.filter((entry) => entry.id !== post.id).slice(0, 3);
  const paragraphs = paragraphsFromContent(post.content);

  return (
    <MarketingShell maxWidth="4xl">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/blog" },
          { label: post.title }
        ]}
      />

        <article className="animate-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">
            {post.category} · {post.publishedAt}
          </p>
          <h1 className="mt-3 font-display text-4xl text-furni-primary md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-furni-muted">By {post.author}</p>

          <FurniImage
            src={post.coverImage}
            alt={post.title}
            variant="hero"
            className="mt-8 rounded-3xl"
            priority
          />

          <p className="mt-8 text-lg leading-relaxed text-furni-ink">{post.excerpt}</p>

          <div className="mt-6 space-y-4 text-base leading-relaxed text-furni-muted">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </article>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-2xl text-furni-primary">More to read</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.id} href={`/blog/${item.id}`}>
                  <FurniCard className="h-full overflow-hidden p-0">
                    <FurniImage src={item.coverImage} alt={item.title} variant="card" />
                    <div className="p-3">
                      <p className="text-sm font-semibold text-furni-primary">{item.title}</p>
                    </div>
                  </FurniCard>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <FurniCard className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-furni-muted">
            Questions about materials or sizing? Our team replies within one business day.
          </p>
          <Link href="/contact">
            <FurniButton>Ask Covmerc</FurniButton>
          </Link>
        </FurniCard>

        <RelatedPages
          title="Explore Covmerc"
          links={[...relatedPageGroups.explore, ...relatedPageGroups.help]}
        />
      </main>
      <Footer />
    </div>
  );
}
