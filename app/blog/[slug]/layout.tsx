import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchBlogPostBySlug } from "@/lib/store-firestore";
import { createPageMetadata } from "@/lib/site-metadata";

type Props = {
  children: ReactNode;
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await fetchBlogPostBySlug(slug);

    if (!post || post.status !== "published") {
      return createPageMetadata({
        title: "Article",
        description: "Covmerc design journal.",
        path: `/blog/${slug}`
      });
    }

    return createPageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      imageUrl: post.coverImage
    });
  } catch {
    return createPageMetadata({
      title: "Article",
      description: "Covmerc design journal.",
      path: `/blog/${slug}`
    });
  }
}

export default function BlogPostLayout({ children }: { children: ReactNode }) {
  return children;
}
