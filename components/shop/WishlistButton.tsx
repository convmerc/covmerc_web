"use client";

import { useState } from "react";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";

type WishlistButtonProps = {
  productId: string;
  className?: string;
  size?: "sm" | "md";
};

export function WishlistButton({
  productId,
  className = "",
  size = "md"
}: WishlistButtonProps) {
  const { currentUser } = useAuthSession();
  const { isInWishlist, toggleWishlist } = useFurniStore();
  const [pending, setPending] = useState(false);

  if (!currentUser) return null;

  const saved = isInWishlist(productId);
  const iconSize = size === "sm" ? 16 : 18;

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;

    setPending(true);
    try {
      await toggleWishlist(productId);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={saved}
      disabled={pending}
      onClick={handleClick}
      className={`inline-flex items-center justify-center rounded-full bg-white/95 p-2 text-furni-primary shadow-sm ring-1 ring-furni-primary/10 transition hover:bg-white disabled:opacity-60 ${className}`}
    >
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}
