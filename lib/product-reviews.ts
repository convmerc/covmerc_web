import { collection, getDocs, query, where } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";

export type ProductReview = {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

function formatReviewDate(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate().toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return "";
    }
  }
  return "";
}

function reviewTimestamp(value: unknown): number {
  if (value && typeof value === "object" && "toMillis" in value) {
    try {
      return (value as { toMillis: () => number }).toMillis();
    } catch {
      return 0;
    }
  }
  return 0;
}

export async function fetchProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const { db } = getFirebase();
    const reviewsQuery = query(
      collection(db, "productReviews"),
      where("productId", "==", productId)
    );
    const snapshot = await getDocs(reviewsQuery);

    const sortedDocs = [...snapshot.docs].sort(
      (a, b) =>
        reviewTimestamp(b.data().createdAt) - reviewTimestamp(a.data().createdAt)
    );

    return sortedDocs.slice(0, 12).map((entry) => {
      const data = entry.data() as Record<string, unknown>;
      return {
        id: entry.id,
        productId,
        authorName: typeof data.authorName === "string" ? data.authorName : "Customer",
        rating: typeof data.rating === "number" ? data.rating : Number(data.rating) || 5,
        comment: typeof data.comment === "string" ? data.comment : "",
        createdAt: formatReviewDate(data.createdAt)
      };
    });
  } catch {
    return [];
  }
}
