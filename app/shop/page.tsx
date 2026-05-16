"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { FilterPill } from "@/components/ui/FilterPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { formatNgn } from "@/lib/format-currency";
import { FurniImage } from "@/components/ui/FurniImage";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/shop/ProductCard";
import { TrustBar } from "@/components/shop/TrustBar";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { shopCategories, shopHighlights } from "@/lib/catalog-content";
import { shopFilterLabels } from "@/lib/categories";

type SortOption = "featured" | "price-low" | "price-high" | "name";

function matchesCategory(
  product: { category: string; categoryName: string },
  active: string
) {
  if (active === "All") return true;
  if (product.category === active) return true;
  return product.categoryName.toLowerCase().includes(active.toLowerCase().slice(0, -1));
}

function ShopPageContent() {
  const searchParams = useSearchParams();
  const { products, categories, addToCart, storeLoading } = useFurniStore();
  const filterCategories = useMemo(() => shopFilterLabels(categories), [categories]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const category = searchParams.get("category");
    if (category && filterCategories.includes(category)) {
      setActiveCategory(category);
    }
  }, [searchParams, filterCategories]);

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
    <MarketingShell
      flush
      hero={
        <>
          <MarketingHero
            eyebrow="Shop"
            title="Curated furniture for every room"
            description={`${products.length} pieces from verified makers—filter by category, compare specs, and order with delivery across Nigeria.`}
            aside={
              featuredProduct ? (
                <Link href={`/product/${featuredProduct.id}`} className="block">
                  <FurniCard
                    interactive={false}
                    className="overflow-hidden border-white/15 bg-white/10 p-0 backdrop-blur-sm"
                  >
                    <FurniImage
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      variant="hero"
                      className="max-h-[280px]"
                    />
                    <div className="p-4 text-white">
                      <p className="covmerc-eyebrow-light">Spotlight</p>
                      <p className="mt-1 font-semibold">{featuredProduct.name}</p>
                      <p className="mt-1 text-sm text-furni-accent">
                        {formatNgn(featuredProduct.price)}
                      </p>
                      <p className="mt-1 text-xs text-white/75">View details →</p>
                    </div>
                  </FurniCard>
                </Link>
              ) : undefined
            }
          >
            <div className="flex flex-wrap gap-4 text-sm text-white/75">
              <span>✓ Specs on every page</span>
              <span>✓ Secure checkout</span>
              <span>✓ Studio support</span>
            </div>
          </MarketingHero>
          <TrustBar />
        </>
      }
    >
      <div className="covmerc-container py-10">
        <div className="lg:grid lg:grid-cols-[240px,1fr] lg:gap-10">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block">
            <FurniCard className="sticky top-24 space-y-6 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
                  Categories
                </p>
                <div className="mt-3 grid gap-1">
                  {filterCategories.map((category) => (
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
                  className="covmerc-input py-2.5 pl-4 pr-4"
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
              {filterCategories.map((category) => (
                <FilterPill
                  key={category}
                  label={category}
                  active={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                />
              ))}
            </div>

            {/* Category spotlight cards — mobile / tablet */}
            {activeCategory === "All" && !query ? (
              <div className="mb-8 grid gap-3 sm:grid-cols-3 lg:hidden">
                {shopCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
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
              <LoadingState variant="grid" message="Loading catalog…" />
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
              <EmptyState
                icon="search"
                title="No products found"
                description="Try a different category or clear your search—we are always adding new pieces."
              >
                <FurniButton
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Reset filters
                </FurniButton>
              </EmptyState>
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

            <CtaBanner
              className="mt-8"
              variant="primary"
              eyebrow="Personal guidance"
              title="Not finding the right piece?"
              description="Tell us about your room and budget—we will suggest options from the catalog or connect you with a maker."
              primary={{ href: "/contact", label: "Get recommendations" }}
              secondary={{ href: "/blog", label: "Read styling tips" }}
            />
          </div>
        </div>
      </div>
    </MarketingShell>
  );
}

function ShopPageFallback() {
  return (
    <MarketingShell>
      <LoadingState message="Loading shop…" />
    </MarketingShell>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageFallback />}>
      <ShopPageContent />
    </Suspense>
  );
}
