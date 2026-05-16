"use client";

import { useState } from "react";
import { FurniImage } from "@/components/ui/FurniImage";

type ProductGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const gallery = images.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSrc = gallery[activeIndex] ?? gallery[0];

  if (!activeSrc) return null;

  return (
    <div className="space-y-3">
      <FurniImage
        src={activeSrc}
        alt={alt}
        variant="detail"
        className="min-h-[340px] rounded-3xl"
        priority
      />
      {gallery.length > 1 ? (
        <div className="flex flex-wrap gap-2">
          {gallery.map((src, index) => (
            <button
              key={`${src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`overflow-hidden rounded-xl ring-2 transition ${
                index === activeIndex
                  ? "ring-furni-primary"
                  : "ring-transparent opacity-80 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <FurniImage
                src={src}
                alt=""
                variant="thumb"
                className="h-16 w-16 object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
