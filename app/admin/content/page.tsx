"use client";

import Link from "next/link";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { blogPostHref } from "@/lib/blog-utils";

export default function AdminContentPage() {
  const { blogPosts, addBlogPost } = useFurniStore();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Design");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80"
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await addBlogPost({ title, excerpt, content, category, coverImage });
      setTitle("");
      setExcerpt("");
      setContent("");
      setCategory("Design");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to publish post."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout
      title="Journal"
      subtitle="Publish editorial content to Firestore — shared with the storefront and mobile app."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,400px),1fr]">
      <FurniCard interactive={false}>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <AdminSectionHeader
            title="New post"
            description="Posts publish to the blog collection immediately."
          />
          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <FurniInput
            required
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <FurniInput
            required
            label="Excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
          />
          <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
            <span className="text-xs font-medium">Content</span>
            <textarea
              required
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="min-h-[120px] w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm text-furni-ink outline-none transition focus:border-furni-primary focus:ring-2 focus:ring-furni-primary/15"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <FurniInput
              required
              label="Category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            />
            <FurniInput
              required
              label="Cover Image URL"
              value={coverImage}
              onChange={(event) => setCoverImage(event.target.value)}
            />
          </div>
          <FurniButton type="submit" className="w-max" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish Post"}
          </FurniButton>
        </form>
      </FurniCard>

      <FurniCard interactive={false}>
        <AdminSectionHeader
          title="Recent entries"
          description="Latest posts from your catalog."
          action={{ label: "Data manager →", href: "/admin/data/blogPosts" }}
        />
        <div className="mt-4 grid gap-2">
          {blogPosts.slice(0, 8).map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-furni-primary/8 bg-furni-surface/80 px-3 py-3 text-sm transition hover:bg-furni-surface"
            >
              <div>
                <p className="font-medium text-furni-primary">{post.title}</p>
                <p className="text-xs">
                  {post.category} · {post.status} · {post.publishedAt}
                </p>
              </div>
              {post.status === "published" ? (
                <Link
                  href={blogPostHref(post)}
                  className="text-xs font-semibold text-furni-primary hover:underline"
                >
                  View →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </FurniCard>
      </div>
    </AdminLayout>
  );
}
