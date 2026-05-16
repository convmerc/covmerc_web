import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Shop",
  description:
    "Browse Covmerc furniture collections — chairs, tables, and sofas curated for modern living.",
  path: "/shop"
});

export default function ShopLayout({ children }: { children: ReactNode }) {
  return children;
}
