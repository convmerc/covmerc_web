import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fetchProductsFromFirestore } from "@/lib/store-firestore";
import { createPageMetadata } from "@/lib/site-metadata";

type Props = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const products = await fetchProductsFromFirestore();
    const product = products.find((entry) => entry.id === id);

    if (!product) {
      return createPageMetadata({
        title: "Product",
        description: "Product details on Covmerc.",
        path: `/product/${id}`
      });
    }

    return createPageMetadata({
      title: product.name,
      description: product.shortDescription || product.description,
      path: `/product/${id}`,
      imageUrl: product.image
    });
  } catch {
    return createPageMetadata({
      title: "Product",
      description: "Product details on Covmerc.",
      path: `/product/${id}`
    });
  }
}

export default function ProductLayout({ children }: { children: ReactNode }) {
  return children;
}
