import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Terms of Service",
  description: "Terms and conditions for using Covmerc products and services.",
  path: "/terms"
});

export default function TermsLayout({ children }: { children: ReactNode }) {
  return children;
}
