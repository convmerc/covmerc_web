import type { FurniProduct } from "@/lib/furni-types";

export type ShopSortOption = "featured" | "price-low" | "price-high" | "name";

export type ShopFilters = {
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  material: string;
  finish: string;
  query: string;
  sortBy: ShopSortOption;
};

export const defaultShopFilters: ShopFilters = {
  category: "All",
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  material: "",
  finish: "",
  query: "",
  sortBy: "featured"
};

export function matchesCategory(
  product: { category: string; categoryName: string },
  active: string
) {
  if (active === "All") return true;
  if (product.category === active) return true;
  return product.categoryName.toLowerCase().includes(active.toLowerCase().slice(0, -1));
}

export function parseShopSearchParams(
  searchParams: URLSearchParams,
  validCategories: string[]
): ShopFilters {
  const category = searchParams.get("category");
  const minRaw = searchParams.get("min");
  const maxRaw = searchParams.get("max");
  const material = searchParams.get("material") ?? "";
  const finish = searchParams.get("finish") ?? "";
  const sortRaw = searchParams.get("sort");

  const minPrice =
    minRaw != null && minRaw !== "" && Number.isFinite(Number(minRaw))
      ? Number(minRaw)
      : null;
  const maxPrice =
    maxRaw != null && maxRaw !== "" && Number.isFinite(Number(maxRaw))
      ? Number(maxRaw)
      : null;

  const sortBy: ShopSortOption =
    sortRaw === "price-low" ||
    sortRaw === "price-high" ||
    sortRaw === "name" ||
    sortRaw === "featured"
      ? sortRaw
      : "featured";

  return {
    category:
      category && validCategories.includes(category) ? category : "All",
    minPrice,
    maxPrice,
    inStockOnly: searchParams.get("inStock") === "1",
    material,
    finish,
    query: searchParams.get("q") ?? "",
    sortBy
  };
}

export function buildShopSearchParams(filters: ShopFilters): string {
  const params = new URLSearchParams();

  if (filters.category !== "All") {
    params.set("category", filters.category);
  }
  if (filters.minPrice != null && filters.minPrice > 0) {
    params.set("min", String(Math.round(filters.minPrice)));
  }
  if (filters.maxPrice != null && filters.maxPrice > 0) {
    params.set("max", String(Math.round(filters.maxPrice)));
  }
  if (filters.inStockOnly) {
    params.set("inStock", "1");
  }
  if (filters.material) {
    params.set("material", filters.material);
  }
  if (filters.finish) {
    params.set("finish", filters.finish);
  }
  if (filters.query.trim()) {
    params.set("q", filters.query.trim());
  }
  if (filters.sortBy !== "featured") {
    params.set("sort", filters.sortBy);
  }

  return params.toString();
}

export function collectSpecOptions(
  products: FurniProduct[],
  field: "material" | "finish"
): string[] {
  const values = new Set<string>();
  for (const product of products) {
    const value = product.specs[field]?.trim();
    if (value) values.add(value);
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export function applyShopFilters(
  products: FurniProduct[],
  filters: ShopFilters
): FurniProduct[] {
  let next = products.filter((product) =>
    matchesCategory(product, filters.category)
  );

  if (filters.inStockOnly) {
    next = next.filter((product) => product.stock > 0);
  }

  if (filters.minPrice != null) {
    next = next.filter((product) => product.price >= filters.minPrice!);
  }

  if (filters.maxPrice != null) {
    next = next.filter((product) => product.price <= filters.maxPrice!);
  }

  if (filters.material) {
    next = next.filter(
      (product) =>
        product.specs.material.toLowerCase() === filters.material.toLowerCase()
    );
  }

  if (filters.finish) {
    next = next.filter(
      (product) =>
        product.specs.finish.toLowerCase() === filters.finish.toLowerCase()
    );
  }

  const q = filters.query.trim().toLowerCase();
  if (q) {
    next = next.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.specs.material.toLowerCase().includes(q) ||
        p.specs.finish.toLowerCase().includes(q)
    );
  }

  switch (filters.sortBy) {
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
      next.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
      );
  }

  return next;
}

export function shopPriceBounds(products: FurniProduct[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }
  const prices = products.map((product) => product.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}
