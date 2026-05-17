import { ImageResponse } from "next/og";
import { CovmercOgImage, ogImageSize } from "@/lib/brand-og";
import { loadBrandLogoDataUrl } from "@/lib/load-brand-logo";

export const alt = "Covmerc — Modern furniture and interior studio";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoSrc = await loadBrandLogoDataUrl();
  return new ImageResponse(<CovmercOgImage logoSrc={logoSrc} />, { ...size });
}
