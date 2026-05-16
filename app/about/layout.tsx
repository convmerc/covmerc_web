import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Learn how Covmerc brings sustainable craftsmanship, thoughtful design, and modern commerce to homes across Nigeria.",
  path: "/about"
});

export default function AboutLayout({ children }: { children: ReactNode }) {
  return children;
}
