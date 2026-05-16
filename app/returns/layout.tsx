import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Returns & refunds",
  description:
    "Covmerc return eligibility, refund timelines, and how to start a return for furniture orders.",
  path: "/returns",
});

export default function ReturnsLayout({ children }: { children: ReactNode }) {
  return children;
}
