import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: "How Covmerc collects, uses, and protects your personal information.",
  path: "/privacy"
});

export default function PrivacyLayout({ children }: { children: ReactNode }) {
  return children;
}
