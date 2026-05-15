"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

export default function AdminContentPage() {
  const { blogPosts, addBlogPost } = useFurniStore();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Design");
  const [coverImage, setCoverImage] = useState(
    "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80"
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addBlogPost({ title, excerpt, content, category, coverImage });
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("Design");
  }

  return (
    <AdminLayout
      title="Content Manager"
      subtitle="Publish homepage blog cards directly from the admin dashboard."
    >
      <FurniCard>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-furni-primary">Add Blog Post</h2>
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
          <FurniButton type="submit" className="w-max">
            Publish Post
          </FurniButton>
        </form>
      </FurniCard>

      <FurniCard>
        <h2 className="text-lg font-semibold text-furni-primary">Recent Blog Entries</h2>
        <div className="mt-3 grid gap-2">
          {blogPosts.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="rounded-xl bg-furni-surface px-3 py-2 text-sm text-furni-muted"
            >
              <p className="font-medium text-furni-primary">{post.title}</p>
              <p className="text-xs">
                {post.category} • {post.publishedAt}
              </p>
            </div>
          ))}
        </div>
      </FurniCard>
    </AdminLayout>
  );
}
