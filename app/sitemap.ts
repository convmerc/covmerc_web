import type { MetadataRoute } from "next";
import { initialBlogPosts } from "@/lib/furni-data";
import { siteConfig } from "@/lib/site-metadata";

const staticRoutes = [
  "",
  "/shop",
  "/about",
  "/blog",
  "/contact",
  "/support",
  "/cart",
  "/checkout",
  "/account/orders",
  "/privacy",
  "/terms"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/shop" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7
  }));

  const blogEntries = initialBlogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6
  }));

  return [...staticEntries, ...blogEntries];
}
