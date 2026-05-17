import { ImageResponse } from "next/og";
import { CovmercOgImage, ogImageSize } from "@/lib/brand-og";
import { loadBrandLogoDataUrl } from "@/lib/load-brand-logo";

export const alt = "Shop Covmerc furniture collections";
export const size = ogImageSize;
export const contentType = "image/png";

export default async function ShopOpenGraphImage() {
  const logoSrc = await loadBrandLogoDataUrl();
  return new ImageResponse(
    <CovmercOgImage
      logoSrc={logoSrc}
      eyebrow="Shop"
      title="Curated furniture for every room"
      subtitle="Browse chairs, tables, sofas and more — delivered across Nigeria."
    />,
    { ...size },
  );
}
