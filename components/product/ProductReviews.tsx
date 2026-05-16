"use client";

import { useEffect, useState } from "react";
import { FurniCard } from "@/components/ui/FurniCard";
import { fetchProductReviews, type ProductReview } from "@/lib/product-reviews";

type Props = {
  productId: string;
  fallbackRating?: number;
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-furni-accent" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(Math.min(5, Math.max(0, Math.round(rating))))}
      <span className="text-furni-muted/40">{"★".repeat(5 - Math.min(5, Math.max(0, Math.round(rating))))}</span>
    </span>
  );
}

export function ProductReviews({ productId, fallbackRating = 0 }: Props) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchProductReviews(productId).then((entries) => {
      setReviews(entries);
      setLoading(false);
    });
  }, [productId]);

  if (loading) {
    return (
      <FurniCard>
        <p className="text-sm text-furni-muted">Loading reviews…</p>
      </FurniCard>
    );
  }

  if (reviews.length === 0) {
    if (fallbackRating > 0) {
      return (
        <FurniCard>
          <h2 className="text-lg font-semibold text-furni-primary">Customer rating</h2>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={fallbackRating} />
            <span className="text-sm text-furni-muted">{fallbackRating.toFixed(1)} / 5</span>
          </div>
          <p className="mt-2 text-sm text-furni-muted">Be the first to leave a detailed review.</p>
        </FurniCard>
      );
    }
    return null;
  }

  const average =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl text-furni-primary">Customer reviews</h2>
        <div className="mt-2 flex items-center gap-2">
          <Stars rating={average} />
          <span className="text-sm text-furni-muted">
            {average.toFixed(1)} · {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {reviews.map((review) => (
          <FurniCard key={review.id}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-furni-primary">{review.authorName}</p>
              {review.createdAt ? (
                <p className="text-xs text-furni-muted">{review.createdAt}</p>
              ) : null}
            </div>
            <div className="mt-1">
              <Stars rating={review.rating} />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-furni-muted">{review.comment}</p>
          </FurniCard>
        ))}
      </div>
    </section>
  );
}
