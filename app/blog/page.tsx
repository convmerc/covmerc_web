"use client";

import Image from "next/image";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniCard } from "@/components/ui/FurniCard";

export default function BlogPage() {
  const { blogPosts } = useFurniStore();

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <header className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Blog</p>
          <h1 className="mt-1 text-4xl font-semibold text-furni-primary">
            Sustainable Craftsmanship & Modern Living Tips
          </h1>
          <p className="mt-2 text-sm text-furni-muted">
            Explore design stories, home styling guidance, and material insights from
            the Furni team.
          </p>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post) => (
            <FurniCard key={post.id} className="overflow-hidden p-0">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={500}
                height={360}
                className="h-48 w-full object-cover"
              />
              <div className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-furni-muted">
                  {post.publishedAt} • {post.category}
                </p>
                <h2 className="text-lg font-semibold text-furni-primary">{post.title}</h2>
                <p className="text-sm text-furni-muted">{post.excerpt}</p>
              </div>
            </FurniCard>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
