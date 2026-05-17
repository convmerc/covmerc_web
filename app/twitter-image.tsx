import { ImageResponse } from "next/og";
import { CovmercOgImage, ogImageSize } from "@/lib/brand-og";

export const alt = "Covmerc — Modern furniture and interior studio";
export const size = ogImageSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(<CovmercOgImage />, { ...size });
}
