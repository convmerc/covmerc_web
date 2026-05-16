import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your Covmerc order with secure shipping and payment details.",
  path: "/checkout"
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
