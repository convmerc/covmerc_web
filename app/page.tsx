import type { Metadata } from "next";
import { HomePage } from "@/components/pages/HomePage";
import { siteConfig } from "@/lib/site-metadata";

export const metadata: Metadata = {
  title: { absolute: siteConfig.title },
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url
  }
};

export default function Page() {
  return <HomePage />;
}
