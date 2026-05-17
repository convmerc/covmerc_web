/** Canonical public site URL (must not be localhost in production builds). */

const FIREBASE_HOSTING_URL = "https://convmerc-baeef.web.app";

function isLocalUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Resolves the site URL used in metadata, OG tags, and auth emails.
 * Falls back to Firebase Hosting when env still points at localhost during deploy.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (configured && !isLocalUrl(configured)) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    return FIREBASE_HOSTING_URL;
  }

  return configured || "http://localhost:3000";
}
