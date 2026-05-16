/** Shown when a product image fails or is missing */
export const PRODUCT_IMAGE_FALLBACK = "/images/product-placeholder.svg";

/** Tiny gray blur shown while remote images load */
export const IMAGE_BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

export function isExternalImageSrc(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

export function isLocalImageSrc(src: string): boolean {
  return src.startsWith("/");
}

/** Normalize remote URLs; keep Unsplash width for reliable upstream fetches */
export function normalizeImageSrc(src: string): string {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) {
    return PRODUCT_IMAGE_FALLBACK;
  }

  if (!trimmed.includes("images.unsplash.com")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (!url.searchParams.has("w")) {
      url.searchParams.set("w", "1200");
    }
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("q", "80");
    return url.toString();
  } catch {
    return trimmed;
  }
}

/** Use native img loading for remote URLs (avoids Next optimizer timeouts on Unsplash) */
export function shouldBypassImageOptimizer(src: string): boolean {
  return isExternalImageSrc(src);
}
