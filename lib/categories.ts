import { collection, getDocs } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { normalizeLegacyCategory } from "@/lib/store-mappers";
import type { FurniProduct } from "@/lib/furni-types";

export type StoreCategory = {
  id: string;
  name: string;
  slug: string;
};

const CATEGORIES_COLLECTION = "categories";
const FALLBACK_CATEGORIES = ["Chairs", "Tables", "Sofas"];

function slugify(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function uniqueNames(names: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const name of names) {
    const trimmed = name.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result.sort((a, b) => a.localeCompare(b));
}

export function deriveCategoriesFromProducts(products: FurniProduct[]): StoreCategory[] {
  const names = uniqueNames(
    products.flatMap((product) => {
      const label = product.categoryName || product.category;
      return [normalizeLegacyCategory(label), label];
    })
  );

  const resolved = names.length > 0 ? names : FALLBACK_CATEGORIES;

  return resolved.map((name) => ({
    id: slugify(name),
    name,
    slug: slugify(name)
  }));
}

export async function fetchCategoriesFromFirestore(
  products: FurniProduct[]
): Promise<StoreCategory[]> {
  try {
    const { db } = getFirebase();
    const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));

    if (!snapshot.empty) {
      const fromFirestore = snapshot.docs
        .map((entry) => {
          const data = entry.data() as Record<string, unknown>;
          const name =
            typeof data.name === "string" ? data.name : typeof data.title === "string" ? data.title : "";
          if (!name) return null;
          const normalized = normalizeLegacyCategory(name);
          return {
            id: entry.id,
            name: normalized,
            slug: slugify(normalized)
          } satisfies StoreCategory;
        })
        .filter((entry): entry is StoreCategory => Boolean(entry));

      if (fromFirestore.length > 0) {
        return fromFirestore;
      }
    }
  } catch {
    // Fall through to product-derived categories.
  }

  return deriveCategoriesFromProducts(products);
}

export function shopFilterLabels(categories: StoreCategory[]): string[] {
  return ["All", ...categories.map((entry) => entry.name)];
}
