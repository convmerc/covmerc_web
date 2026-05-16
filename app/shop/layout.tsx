import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Shop",
  description:
    "Browse Covmerc furniture—chairs, tables, sofas and more. Filter by category, search the catalog, and order with delivery across Nigeria.",
  path: "/shop"
});

export default function ShopLayout({ children }: { children: ReactNode }) {
  return children;
}
