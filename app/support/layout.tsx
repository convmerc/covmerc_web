import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Support",
  description:
    "Get help with orders, returns, product guidance, and live assistance from Covmerc support.",
  path: "/support"
});

export default function SupportLayout({ children }: { children: ReactNode }) {
  return children;
}
