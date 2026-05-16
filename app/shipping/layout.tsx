import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Shipping & delivery",
  description:
    "Covmerc delivery coverage across Nigeria, fees, timelines, and how to track your furniture order.",
  path: "/shipping",
});

export default function ShippingLayout({ children }: { children: ReactNode }) {
  return children;
}
