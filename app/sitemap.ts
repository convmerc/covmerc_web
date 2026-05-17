import type { MetadataRoute } from "next";
import { fetchBlogPostsFromFirestore, fetchProductsFromFirestore } from "@/lib/store-firestore";
import { siteConfig } from "@/lib/site-metadata";

const staticRoutes = [
  "",
  "/shop",
  "/about",
  "/sell",
  "/blog",
  "/contact",
  "/support",
  "/cart",
  "/checkout",
  "/account/orders",
  "/privacy",
  "/terms",
  "/shipping",
  "/returns"
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const staticEntries = staticRoutes.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/shop" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/shop" ? 0.9 : 0.7
  }));

  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const posts = await fetchBlogPostsFromFirestore();
    blogEntries = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }));
  } catch {
    blogEntries = [];
  }

  let productEntries: MetadataRoute.Sitemap = [];

  try {
    const products = await fetchProductsFromFirestore();
    productEntries = products.map((product) => ({
      url: `${siteConfig.url}/product/${product.id}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...blogEntries, ...productEntries];
}
