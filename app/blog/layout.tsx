import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Blog",
  description:
    "Design stories, styling tips, and material insights from the Covmerc team.",
  path: "/blog"
});

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
