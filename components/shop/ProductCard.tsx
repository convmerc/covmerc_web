"use client";

import Link from "next/link";
import { FurniImage } from "@/components/ui/FurniImage";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { formatNgn } from "@/lib/format-currency";
import type { FurniProduct } from "@/lib/furni-types";
import { WishlistButton } from "@/components/shop/WishlistButton";

type ProductCardProps = {
  product: FurniProduct;
  onAddToCart?: (productId: string) => void;
  layout?: "grid" | "compact";
};

function ProductRating({ rating }: { rating: number }) {
  if (rating <= 0) return null;

  const filled = Math.round(rating);
  return (
    <div
      className="flex items-center gap-1 text-xs text-furni-muted"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      <span className="flex text-furni-accent" aria-hidden>
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < filled ? "opacity-100" : "opacity-30"}>
            ★
          </span>
        ))}
      </span>
      <span className="tabular-nums">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ProductCard({
  product,
  onAddToCart,
  layout = "grid"
}: ProductCardProps) {
  const isCompact = layout === "compact";
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const hasDiscount = product.discount > 0 && product.originalPrice > product.price;
  const displayCategory = product.categoryName || product.category;

  return (
    <FurniCard
      interactive
      className="group flex h-full flex-col overflow-hidden !p-0"
    >
      <Link
        href={`/product/${product.id}`}
        className="relative block shrink-0 overflow-hidden"
      >
        <FurniImage
          src={product.image}
          alt={product.name}
          variant="card"
          imageClassName={`transition duration-500 ${
            outOfStock ? "opacity-70" : "group-hover:scale-[1.02]"
          }`}
        />

        {outOfStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-furni-primary/35">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-furni-primary">
              Out of stock
            </span>
          </div>
        ) : null}

        <div className="absolute left-2 top-2 flex flex-wrap gap-1 sm:left-3 sm:top-3">
          {product.featured ? (
            <span className="rounded-full bg-furni-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-furni-primary">
              Featured
            </span>
          ) : null}
          {hasDiscount ? (
            <span className="rounded-full bg-furni-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Sale
            </span>
          ) : null}
          {lowStock ? (
            <span className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-furni-ink ring-1 ring-furni-primary/10">
              {product.stock} left
            </span>
          ) : null}
        </div>

        <WishlistButton
          productId={product.id}
          className="absolute right-2 top-2 sm:right-3 sm:top-3"
          size="sm"
        />
      </Link>

      <div className={`flex flex-1 flex-col ${isCompact ? "p-3" : "p-4"}`}>
        <div className="flex-1 space-y-1.5">
          <p className="truncate text-[11px] font-medium uppercase tracking-wide text-furni-muted">
            {displayCategory}
          </p>

          <Link href={`/product/${product.id}`} className="block">
            <h3
              className={`line-clamp-2 font-semibold leading-snug text-furni-primary transition group-hover:text-furni-ink ${
                isCompact ? "text-sm" : "text-base sm:text-lg"
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {!isCompact && product.shortDescription ? (
            <p className="line-clamp-2 text-sm text-furni-muted">{product.shortDescription}</p>
          ) : null}

          {!isCompact ? <ProductRating rating={product.rating} /> : null}
        </div>

        <div className="mt-4 space-y-3 border-t border-furni-primary/10 pt-3">
          <div>
            <p className="text-lg font-semibold tabular-nums text-furni-ink">
              {formatNgn(product.price)}
            </p>
            {hasDiscount ? (
              <p className="text-xs text-furni-muted line-through">
                {formatNgn(product.originalPrice)}
              </p>
            ) : null}
          </div>

          <div className={`grid gap-2 ${onAddToCart ? "grid-cols-2" : "grid-cols-1"}`}>
            <Link href={`/product/${product.id}`} className="block">
              <FurniButton variant="outline" fullWidth className="text-xs sm:text-sm">
                View
              </FurniButton>
            </Link>
            {onAddToCart ? (
              <FurniButton
                variant="primary"
                fullWidth
                className="text-xs sm:text-sm"
                data-testid="product-add"
                disabled={outOfStock}
                onClick={() => onAddToCart(product.id)}
              >
                {outOfStock ? "Out" : "Add"}
              </FurniButton>
            ) : null}
          </div>
        </div>
      </div>
    </FurniCard>
  );
}
