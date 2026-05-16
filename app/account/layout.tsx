import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata = createPageMetadata({
  title: "Your Orders",
  description: "View order history and delivery status for your Covmerc account.",
  path: "/account/orders"
});

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
