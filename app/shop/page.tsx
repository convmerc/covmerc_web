"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { FurniImage } from "@/components/ui/FurniImage";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/TrustBar";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { shopCategories, shopHighlights } from "@/lib/catalog-content";
import type { ProductCategory } from "@/lib/furni-types";

type SortOption = "featured" | "price-low" | "price-high" | "name";

const legacyCategories: Array<ProductCategory | "All"> = ["All", "Chairs", "Tables", "Sofas"];

function matchesCategory(
  product: { category: ProductCategory; categoryName: string },
  active: ProductCategory | "All"
) {
  if (active === "All") return true;
  if (product.category === active) return true;
  return product.categoryName.toLowerCase().includes(active.toLowerCase().slice(0, -1));
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const { products, addToCart, storeLoading } = useFurniStore();
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "All">("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && legacyCategories.includes(category as ProductCategory | "All")) {
      setActiveCategory(category as ProductCategory | "All");
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let next = products.filter((product) => matchesCategory(product, activeCategory));

    const q = query.trim().toLowerCase();
    if (q) {
      next = next.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-low":
        next.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        next.sort((a, b) => b.price - a.price);
        break;
      case "name":
        next.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        next.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }

    return next;
  }, [products, activeCategory, sortBy, query]);

  const featuredProduct = products.find((p) => p.featured) ?? products[0];

  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />

      {/* Shop hero */}
      <section className="relative overflow-hidden bg-furni-primary text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(249,191,41,0.15),_transparent_55%)]" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.1fr,0.9fr] md:items-center md:px-6 lg:px-8 lg:py-16">
          <div className="relative z-10 animate-fade-up">
            <p className="text-xs uppercase tracking-[0.2em] text-furni-accent">Shop</p>
            <h1 className="mt-2 font-display text-4xl leading-tight md:text-5xl">
              Curated furniture for every room
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85">
              {products.length} pieces from verified makers—filter by category, compare specs,
              and order with delivery across Nigeria. Same inventory as the Covmerc app.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/75">
              <span>✓ Specs on every page</span>
              <span>✓ Secure checkout</span>
              <span>✓ Studio support</span>
            </div>
          </div>
          {featuredProduct ? (
            <Link
              href={`/product/${featuredProduct.id}`}
              className="relative z-10 block animate-fade-up"
            >
              <FurniCard className="overflow-hidden border-white/15 bg-white/10 p-0 backdrop-blur-sm">
                <FurniImage
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                  variant="hero"
                  className="max-h-[280px]"
                />
                <div className="p-4 text-white">
                  <p className="text-[10px] uppercase tracking-wide text-furni-accent">
                    Spotlight
                  </p>
                  <p className="mt-1 font-semibold">{featuredProduct.name}</p>
                  <p className="text-xs text-white/75">View details →</p>
                </div>
              </FurniCard>
            </Link>
          ) : null}
        </div>
      </section>

      <TrustBar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-10">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block">
            <FurniCard className="sticky top-24 space-y-6 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
                  Categories
                </p>
                <div className="mt-3 grid gap-1">
                  {legacyCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                        activeCategory === category
                          ? "bg-furni-primary font-medium text-white"
                          : "text-furni-muted hover:bg-furni-primary/5 hover:text-furni-primary"
                      }`}
                    >
                      {category}
                      {category !== "All" ? (
                        <span className="ml-1 text-xs opacity-70">
                          (
                          {products.filter((p) => matchesCategory(p, category)).length})
                        </span>
                      ) : (
                        <span className="ml-1 text-xs opacity-70">({products.length})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-furni-primary/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
                  Need help?
                </p>
                <p className="mt-2 text-xs leading-relaxed text-furni-muted">
                  Unsure about sizing or delivery? Our team responds within one business day.
                </p>
                <Link
                  href="/support"
                  className="mt-3 inline-block text-xs font-semibold text-furni-primary hover:underline"
                >
                  Visit help center →
                </Link>
              </div>
            </FurniCard>
          </aside>

          {/* Main catalog */}
          <div>
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <label htmlFor="shop-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="shop-search"
                  type="search"
                  placeholder="Search by name or material…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-furni-primary/20 bg-white py-2.5 pl-4 pr-4 text-sm outline-none ring-furni-primary/20 focus:border-furni-primary focus:ring-2"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-furni-muted">
                  <span className="font-semibold text-furni-primary">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>
                <label className="flex items-center gap-2 text-sm text-furni-muted">
                  Sort
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2 text-sm text-furni-ink"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </label>
              </div>
            </div>

            {/* Mobile category pills */}
            <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
              {legacyCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-furni-primary text-white"
                      : "bg-white text-furni-primary ring-1 ring-furni-primary/15"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Category spotlight cards — mobile / tablet */}
            {activeCategory === "All" && !query ? (
              <div className="mb-8 grid gap-3 sm:grid-cols-3 lg:hidden">
                {shopCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id as ProductCategory)}
                    className="overflow-hidden rounded-2xl text-left ring-1 ring-furni-primary/10"
                  >
                    <FurniImage src={cat.image} alt={cat.label} variant="card" />
                    <div className="bg-white px-3 py-2">
                      <p className="text-sm font-semibold text-furni-primary">{cat.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}

            {/* Product grid */}
            {storeLoading ? (
              <FurniCard className="py-16 text-center">
                <p className="text-sm text-furni-muted">Loading catalog…</p>
              </FurniCard>
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={(id) => addToCart(id, 1)}
                  />
                ))}
              </div>
            ) : (
              <FurniCard className="py-16 text-center">
                <p className="font-semibold text-furni-primary">No products found</p>
                <p className="mt-2 text-sm text-furni-muted">
                  Try a different category or clear your search.
                </p>
                <FurniButton
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Reset filters
                </FurniButton>
              </FurniCard>
            )}

            {/* Shop education */}
            <section className="mt-16 border-t border-furni-primary/10 pt-12">
              <SectionHeader
                eyebrow="Buying with confidence"
                title="More than a product grid"
                description="Covmerc is built for considered purchases—here is what you can expect on every listing."
              />
              <div className="grid gap-4 md:grid-cols-3">
                {shopHighlights.map((item, index) => (
                  <FurniCard key={item.title} className="p-5">
                    <span className="text-xs font-semibold text-furni-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-semibold text-furni-primary">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-furni-muted">{item.body}</p>
                  </FurniCard>
                ))}
              </div>
            </section>

            <FurniCard className="mt-8 flex flex-col items-start justify-between gap-4 bg-furni-primary p-8 text-white md:flex-row md:items-center">
              <div>
                <h2 className="font-display text-2xl">Not finding the right piece?</h2>
                <p className="mt-2 max-w-md text-sm text-white/80">
                  Tell us about your room and budget—we will suggest options from the catalog or
                  connect you with a maker.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/contact">
                  <FurniButton variant="accent">Get recommendations</FurniButton>
                </Link>
                <Link href="/blog">
                  <FurniButton variant="outline" className="border-white/40 text-white">
                    Read styling tips
                  </FurniButton>
                </Link>
              </div>
            </FurniCard>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ShopPageFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-24">
        <p className="text-sm text-furni-muted">Loading shop…</p>
      </main>
      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}
