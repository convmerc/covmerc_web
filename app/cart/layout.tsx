import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Cart",
  description: "Review your Covmerc cart before checkout.",
  path: "/cart"
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
