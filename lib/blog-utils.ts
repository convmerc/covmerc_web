import type { FurniBlogPost } from "@/lib/furni-types";

export function slugifyBlogTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function blogPostHref(post: Pick<FurniBlogPost, "slug" | "id">): string {
  return `/blog/${post.slug || post.id}`;
}

export function findBlogPostBySlugOrId(
  posts: FurniBlogPost[],
  slugOrId: string
): FurniBlogPost | undefined {
  return posts.find(
    (post) => post.slug === slugOrId || post.id === slugOrId
  );
}

export function uniqueBlogSlug(
  base: string,
  existing: Pick<FurniBlogPost, "slug">[]
): string {
  const taken = new Set(existing.map((post) => post.slug));
  if (!taken.has(base)) return base;

  let index = 2;
  while (taken.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}
