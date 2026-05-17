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
import type { FurniBlogPost, FurniBlogPostStatus } from "@/lib/furni-types";

const defaultCover =
  "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80";

export default function AdminContentPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useFurniStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Design");
  const [coverImage, setCoverImage] = useState(defaultCover);
  const [status, setStatus] = useState<FurniBlogPostStatus>("published");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setCategory("Design");
    setCoverImage(defaultCover);
    setStatus("published");
  }

  function startEdit(post: FurniBlogPost) {
    setEditingId(post.id);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setCoverImage(post.coverImage);
    setStatus(post.status);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = { title, excerpt, content, category, coverImage, status };

      if (editingId) {
        await updateBlogPost(editingId, payload);
      } else {
        await addBlogPost(payload);
      }

      resetForm();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to save post."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(postId: string) {
    if (!window.confirm("Delete this blog post permanently?")) return;

    setSubmitting(true);
    setError(null);
    try {
      await deleteBlogPost(postId);
      if (editingId === postId) {
        resetForm();
      }
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete post."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout
      title="Journal"
      subtitle="Publish, edit, and unpublish editorial content shared with web and mobile."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,400px),1fr]">
        <FurniCard interactive={false} className="lg:sticky lg:top-6 lg:self-start">
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <AdminSectionHeader
              title={editingId ? "Edit post" : "New post"}
              description={
                editingId
                  ? "Update copy or switch between draft and published."
                  : "New posts can be saved as drafts before going live."
              }
            />
            {error ? (
              <p className="rounded-xl bg-furni-danger/10 px-3 py-2 text-sm text-furni-danger">
                {error}
              </p>
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
                label="Cover image URL"
                value={coverImage}
                onChange={(event) => setCoverImage(event.target.value)}
              />
            </div>
            <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
              <span className="text-xs font-medium">Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as FurniBlogPostStatus)}
                className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <FurniButton type="submit" disabled={submitting}>
                {submitting
                  ? "Saving…"
                  : editingId
                    ? "Save changes"
                    : status === "draft"
                      ? "Save draft"
                      : "Publish post"}
              </FurniButton>
              {editingId ? (
                <FurniButton type="button" variant="outline" onClick={resetForm}>
                  Cancel edit
                </FurniButton>
              ) : null}
            </div>
          </form>
        </FurniCard>

        <FurniCard interactive={false}>
          <AdminSectionHeader
            title="Recent entries"
            description="Latest posts from your catalog."
            action={{ label: "Data manager →", href: "/admin/data/blogPosts" }}
          />
          <div className="mt-4 grid gap-2">
            {blogPosts.slice(0, 12).map((post) => (
              <div
                key={post.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-furni-primary/8 bg-furni-surface/80 px-3 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-furni-primary">{post.title}</p>
                  <p className="text-xs text-furni-muted">
                    {post.category} · {post.status} · {post.publishedAt}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <FurniButton
                    type="button"
                    variant="outline"
                    className="px-2 py-1 text-xs"
                    onClick={() => startEdit(post)}
                  >
                    Edit
                  </FurniButton>
                  {post.status === "published" ? (
                    <Link
                      href={blogPostHref(post)}
                      className="inline-flex items-center rounded-full border border-furni-primary/20 px-2 py-1 text-xs font-semibold text-furni-primary hover:bg-furni-primary/5"
                    >
                      View
                    </Link>
                  ) : null}
                  <FurniButton
                    type="button"
                    variant="ghost"
                    className="px-2 py-1 text-xs text-furni-danger"
                    disabled={submitting}
                    onClick={() => void handleDelete(post.id)}
                  >
                    Delete
                  </FurniButton>
                </div>
              </div>
            ))}
          </div>
        </FurniCard>
      </div>
    </AdminLayout>
  );
}
