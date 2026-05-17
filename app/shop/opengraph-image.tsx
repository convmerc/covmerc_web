import { ImageResponse } from "next/og";
import { CovmercOgImage, ogImageSize } from "@/lib/brand-og";

export const alt = "Shop Covmerc furniture collections";
export const size = ogImageSize;
export const contentType = "image/png";

export default function ShopOpenGraphImage() {
  return new ImageResponse(
    <CovmercOgImage
      eyebrow="Shop"
      title="Curated furniture for every room"
      subtitle="Browse chairs, tables, sofas and more — delivered across Nigeria."
    />,
    { ...size },
  );
}
