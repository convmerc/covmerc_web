"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import {
  applyShopFilters,
  buildShopSearchParams,
  collectSpecOptions,
  defaultShopFilters,
  matchesCategory,
  parseShopSearchParams,
  shopPriceBounds,
  type ShopFilters,
  type ShopSortOption
} from "@/lib/shop-filters";

function ShopFiltersPanel({
  filters,
  onChange,
  filterCategories,
  products,
  priceBounds,
  materials,
  finishes,
  className = ""
}: {
  filters: ShopFilters;
  onChange: (patch: Partial<ShopFilters>) => void;
  filterCategories: string[];
  products: ReturnType<typeof useFurniStore>["products"];
  priceBounds: { min: number; max: number };
  materials: string[];
  finishes: string[];
  className?: string;
}) {
  return (
    <FurniCard className={`space-y-6 p-5 ${className}`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
          Categories
        </p>
        <div className="mt-3 grid gap-1">
          {filterCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onChange({ category })}
              className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                filters.category === category
                  ? "bg-furni-primary font-medium text-white"
                  : "text-furni-muted hover:bg-furni-primary/5 hover:text-furni-primary"
              }`}
            >
              {category}
              {category !== "All" ? (
                <span className="ml-1 text-xs opacity-70">
                  ({products.filter((p) => matchesCategory(p, category)).length})
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
          Price (₦)
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs text-furni-muted">
            Min
            <input
              type="number"
              min={0}
              placeholder={priceBounds.min > 0 ? String(priceBounds.min) : "0"}
              value={filters.minPrice ?? ""}
              onChange={(e) =>
                onChange({
                  minPrice: e.target.value === "" ? null : Number(e.target.value)
                })
              }
              className="covmerc-input py-2 text-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-furni-muted">
            Max
            <input
              type="number"
              min={0}
              placeholder={priceBounds.max > 0 ? String(priceBounds.max) : ""}
              value={filters.maxPrice ?? ""}
              onChange={(e) =>
                onChange({
                  maxPrice: e.target.value === "" ? null : Number(e.target.value)
                })
              }
              className="covmerc-input py-2 text-sm"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-furni-primary/10 pt-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-furni-ink">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="size-4 rounded border-furni-primary/30 text-furni-primary focus:ring-furni-primary/20"
          />
          In stock only
        </label>
      </div>

      {materials.length > 0 ? (
        <div className="border-t border-furni-primary/10 pt-5">
          <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
            Material
            <select
              value={filters.material}
              onChange={(e) => onChange({ material: e.target.value })}
              className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-furni-ink"
            >
              <option value="">Any</option>
              {materials.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {finishes.length > 0 ? (
        <div className="border-t border-furni-primary/10 pt-5">
          <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-furni-primary">
            Finish
            <select
              value={filters.finish}
              onChange={(e) => onChange({ finish: e.target.value })}
              className="rounded-xl border border-furni-primary/20 bg-white px-3 py-2 text-sm font-normal normal-case tracking-normal text-furni-ink"
            >
              <option value="">Any</option>
              {finishes.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <FurniButton
        variant="outline"
        className="w-full"
        onClick={() => onChange({ ...defaultShopFilters })}
      >
        Reset filters
      </FurniButton>
    </FurniCard>
  );
}

function ShopPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { products, categories, addToCart, storeLoading } = useFurniStore();
  const filterCategories = useMemo(() => shopFilterLabels(categories), [categories]);
  const [filters, setFilters] = useState<ShopFilters>(defaultShopFilters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setFilters(parseShopSearchParams(searchParams, filterCategories));
  }, [searchParams, filterCategories]);

  const updateFilters = useCallback(
    (patch: Partial<ShopFilters>) => {
      setFilters((current) => {
        const next = { ...current, ...patch };
        const qs = buildShopSearchParams(next);
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        return next;
      });
    },
    [pathname, router]
  );

  const priceBounds = useMemo(() => shopPriceBounds(products), [products]);
  const materials = useMemo(() => collectSpecOptions(products, "material"), [products]);
  const finishes = useMemo(() => collectSpecOptions(products, "finish"), [products]);

  const filteredProducts = useMemo(
    () => applyShopFilters(products, filters),
    [products, filters]
  );

  const featuredProduct = products.find((p) => p.featured) ?? products[0];
  const hasActiveFilters =
    filters.category !== "All" ||
    filters.minPrice != null ||
    filters.maxPrice != null ||
    filters.inStockOnly ||
    Boolean(filters.material) ||
    Boolean(filters.finish) ||
    Boolean(filters.query.trim());

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
          <aside className="hidden lg:block">
            <ShopFiltersPanel
              className="sticky top-24"
              filters={filters}
              onChange={updateFilters}
              filterCategories={filterCategories}
              products={products}
              priceBounds={priceBounds}
              materials={materials}
              finishes={finishes}
            />
            <div className="mt-4 rounded-2xl border border-furni-primary/10 bg-furni-surface/50 p-4 text-xs leading-relaxed text-furni-muted">
              <p className="font-semibold text-furni-primary">Need help?</p>
              <p className="mt-2">
                Unsure about sizing or delivery? Our team responds within one business day.
              </p>
              <Link
                href="/support"
                className="mt-3 inline-block font-semibold text-furni-primary hover:underline"
              >
                Visit help center →
              </Link>
            </div>
          </aside>

          <div>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <label htmlFor="shop-search" className="sr-only">
                  Search products
                </label>
                <input
                  id="shop-search"
                  type="search"
                  placeholder="Search by name or material…"
                  value={filters.query}
                  onChange={(e) => updateFilters({ query: e.target.value })}
                  className="covmerc-input py-2.5 pl-4 pr-4"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <FurniButton
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setMobileFiltersOpen((open) => !open)}
                >
                  {mobileFiltersOpen ? "Hide filters" : "Filters"}
                  {hasActiveFilters ? " ·" : ""}
                </FurniButton>
                <p className="text-sm text-furni-muted">
                  <span className="font-semibold text-furni-primary">
                    {filteredProducts.length}
                  </span>{" "}
                  {filteredProducts.length === 1 ? "product" : "products"}
                </p>
                <label className="flex items-center gap-2 text-sm text-furni-muted">
                  Sort
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      updateFilters({ sortBy: e.target.value as ShopSortOption })
                    }
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

            {mobileFiltersOpen ? (
              <div className="mb-6 lg:hidden">
                <ShopFiltersPanel
                  filters={filters}
                  onChange={(patch) => {
                    updateFilters(patch);
                  }}
                  filterCategories={filterCategories}
                  products={products}
                  priceBounds={priceBounds}
                  materials={materials}
                  finishes={finishes}
                />
              </div>
            ) : null}

            <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
              {filterCategories.map((category) => (
                <FilterPill
                  key={category}
                  label={category}
                  active={filters.category === category}
                  onClick={() => updateFilters({ category })}
                />
              ))}
            </div>

            {filters.inStockOnly || filters.material || filters.finish ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {filters.inStockOnly ? (
                  <FilterPill
                    label="In stock"
                    active
                    onClick={() => updateFilters({ inStockOnly: false })}
                  />
                ) : null}
                {filters.material ? (
                  <FilterPill
                    label={filters.material}
                    active
                    onClick={() => updateFilters({ material: "" })}
                  />
                ) : null}
                {filters.finish ? (
                  <FilterPill
                    label={filters.finish}
                    active
                    onClick={() => updateFilters({ finish: "" })}
                  />
                ) : null}
              </div>
            ) : null}

            {filters.category === "All" && !filters.query ? (
              <div className="mb-8 grid gap-3 sm:grid-cols-3 lg:hidden">
                {shopCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => updateFilters({ category: cat.id })}
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
                  onClick={() => updateFilters({ ...defaultShopFilters })}
                >
                  Reset filters
                </FurniButton>
              </EmptyState>
            )}

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
