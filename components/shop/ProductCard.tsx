"use client";

import Link from "next/link";
import { FurniImage } from "@/components/ui/FurniImage";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { formatNgn } from "@/lib/format-currency";
import type { FurniProduct } from "@/lib/furni-types";

type ProductCardProps = {
  product: FurniProduct;
  onAddToCart?: (productId: string) => void;
  layout?: "grid" | "compact";
};

export function ProductCard({
  product,
  onAddToCart,
  layout = "grid"
}: ProductCardProps) {
  const hasDiscount = product.discount > 0 && product.originalPrice > product.price;
  const displayCategory = product.categoryName || product.category;

  return (
    <FurniCard className="group overflow-hidden p-0">
      <Link href={`/product/${product.id}`} className="relative block">
        <FurniImage
          src={product.image}
          alt={product.name}
          variant="card"
          imageClassName="transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {product.featured ? (
            <span className="rounded-full bg-furni-accent px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-furni-primary">
              Featured
            </span>
          ) : null}
          {hasDiscount ? (
            <span className="rounded-full bg-furni-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Sale
            </span>
          ) : null}
          {product.stock <= 3 && product.stock > 0 ? (
            <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-furni-ink">
              {product.stock} left
            </span>
          ) : null}
        </div>
      </Link>

      <div className={`space-y-2 ${layout === "compact" ? "p-3" : "p-4"}`}>
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-furni-muted">
          {displayCategory}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-furni-primary transition group-hover:text-furni-ink">
            {product.name}
          </h3>
        </Link>
        {layout === "grid" ? (
          <p className="line-clamp-2 text-sm text-furni-muted">{product.shortDescription}</p>
        ) : null}

        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-lg font-semibold text-furni-ink">{formatNgn(product.price)}</p>
            {hasDiscount ? (
              <p className="text-xs text-furni-muted line-through">
                {formatNgn(product.originalPrice)}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Link href={`/product/${product.id}`}>
              <FurniButton variant="outline" className="px-2.5 py-1.5 text-xs">
                View
              </FurniButton>
            </Link>
            {onAddToCart ? (
              <FurniButton
                variant="primary"
                className="px-2.5 py-1.5 text-xs"
                onClick={() => onAddToCart(product.id)}
                disabled={product.stock <= 0}
              >
                {product.stock <= 0 ? "Out" : "Add"}
              </FurniButton>
            ) : null}
          </div>
        </div>
      </div>
    </FurniCard>
  );
}
