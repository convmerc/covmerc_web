import type { Metadata } from "next";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { createPageMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Page not found",
  description: "The page you are looking for could not be found. Return to Covmerc to shop furniture or get help.",
  path: "/404"
});

export default function NotFound() {
  return <NotFoundPage />;
}
