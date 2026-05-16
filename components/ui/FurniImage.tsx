"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  IMAGE_BLUR_DATA_URL,
  normalizeImageSrc,
  PRODUCT_IMAGE_FALLBACK,
  shouldBypassImageOptimizer
} from "@/lib/image-utils";

export type FurniImageVariant = "hero" | "card" | "detail" | "thumb" | "inline";

const variantConfig: Record<
  FurniImageVariant,
  { aspect: string; sizes: string; quality: number }
> = {
  hero: {
    aspect: "aspect-[4/3] md:aspect-[3/2]",
    sizes: "(max-width: 768px) 100vw, 50vw",
    quality: 88
  },
  card: {
    aspect: "aspect-[4/3]",
    sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
    quality: 82
  },
  detail: {
    aspect: "aspect-[5/4] lg:aspect-[4/3]",
    sizes: "(max-width: 1024px) 100vw, 55vw",
    quality: 90
  },
  thumb: {
    aspect: "aspect-[4/3]",
    sizes: "120px",
    quality: 75
  },
  inline: {
    aspect: "aspect-[3/4]",
    sizes: "(max-width: 768px) 50vw, 25vw",
    quality: 82
  }
};

type FurniImageProps = {
  src: string;
  alt: string;
  variant?: FurniImageVariant;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
};

export function FurniImage({
  src,
  alt,
  variant = "card",
  priority = false,
  className = "",
  imageClassName = ""
}: FurniImageProps) {
  const config = variantConfig[variant];
  const normalizedSrc = normalizeImageSrc(src);
  const [activeSrc, setActiveSrc] = useState(normalizedSrc);
  const unoptimized = shouldBypassImageOptimizer(activeSrc);

  useEffect(() => {
    setActiveSrc(normalizedSrc);
  }, [normalizedSrc]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-furni-primary/5 ${config.aspect} ${className}`}
    >
      <Image
        src={activeSrc}
        alt={alt}
        fill
        sizes={config.sizes}
        quality={config.quality}
        priority={priority}
        unoptimized={unoptimized}
        placeholder={unoptimized ? "empty" : "blur"}
        blurDataURL={IMAGE_BLUR_DATA_URL}
        className={`object-cover ${imageClassName}`}
        onError={() => {
          if (activeSrc !== PRODUCT_IMAGE_FALLBACK) {
            setActiveSrc(PRODUCT_IMAGE_FALLBACK);
          }
        }}
      />
    </div>
  );
}
