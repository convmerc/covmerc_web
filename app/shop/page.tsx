"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import type { ProductCategory } from "@/lib/furni-types";

type SortOption = "featured" | "price-low" | "price-high" | "name";

const categories: Array<ProductCategory | "All"> = ["All", "Chairs", "Tables", "Sofas"];

export default function ShopPage() {
  const { products, addToCart } = useFurniStore();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All">("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const filteredProducts = useMemo(() => {
    let nextProducts = [...products];

    if (activeCategory !== "All") {
      nextProducts = nextProducts.filter(
        (product) => product.category === activeCategory
      );
    }

    switch (sortBy) {
      case "price-low":
        nextProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        nextProducts.sort((a, b) => b.price - a.price);
        break;
      case "name":
        nextProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        nextProducts.sort((a, b) =>
          Number(Boolean(b.featured)) - Number(Boolean(a.featured))
        );
    }

    return nextProducts;
  }, [products, activeCategory, sortBy]);

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-furni-muted">Shop</p>
            <h1 className="mt-1 text-4xl font-semibold text-furni-primary">
              Product Listing
            </h1>
          </div>
          <label className="text-sm text-furni-muted">
            Sort by{" "}
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="ml-2 rounded-xl border border-furni-primary/20 bg-white px-3 py-2 text-furni-ink"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </header>

        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory === category ? "bg-furni-primary text-white" : "bg-white text-furni-primary ring-1 ring-furni-primary/15 hover:bg-furni-primary/5"}`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <FurniCard key={product.id} className="overflow-hidden p-0">
              <Link href={`/product/${product.id}`}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={640}
                  height={480}
                  className="h-56 w-full object-cover"
                />
              </Link>
              <div className="space-y-2 p-4">
                <p className="text-xs uppercase tracking-wide text-furni-muted">
                  {product.category}
                </p>
                <h2 className="text-xl font-semibold text-furni-primary">{product.name}</h2>
                <p className="text-sm text-furni-muted">{product.shortDescription}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xl font-semibold text-furni-ink">${product.price}</p>
                  <div className="flex items-center gap-2">
                    <Link href={`/product/${product.id}`}>
                      <FurniButton variant="outline" className="px-3 py-1.5 text-xs">
                        Details
                      </FurniButton>
                    </Link>
                    <FurniButton
                      variant="primary"
                      className="px-3 py-1.5 text-xs"
                      onClick={() => addToCart(product.id, 1)}
                    >
                      Add
                    </FurniButton>
                  </div>
                </div>
              </div>
            </FurniCard>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
