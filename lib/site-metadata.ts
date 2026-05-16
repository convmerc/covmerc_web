import type { Metadata } from "next";

export const siteConfig = {
  name: "Covmerc",
  title: "Covmerc — Modern Furniture & Interior Studio",
  description:
    "Premium furniture and thoughtful interior design for modern living. Shop curated collections, explore design stories, and get expert support from Covmerc Studio.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://covmerc.com",
  locale: "en_NG",
  twitterHandle: "@covmerc"
} as const;

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Covmerc",
    "furniture",
    "modern interior",
    "Lagos furniture",
    "home decor",
    "ecommerce"
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle
  },
  robots: {
    index: true,
    follow: true
  }
};

export function createPageMetadata({
  title,
  description,
  path = ""
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url
    },
    twitter: {
      title: `${title} | ${siteConfig.name}`,
      description
    }
  };
}
