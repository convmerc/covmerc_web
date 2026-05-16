"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import type { FurniProduct, ProductCategory } from "@/lib/furni-types";
import { createProductInFirestore } from "@/lib/store-firestore";

type ProductForm = {
  name: string;
  price: string;
  category: ProductCategory;
  stock: string;
  image: string;
  shortDescription: string;
  description: string;
  material: string;
  dimensions: string;
  weight: string;
  finish: string;
};

const defaultForm: ProductForm = {
  name: "",
  price: "",
  category: "Chairs",
  stock: "1",
  image: "",
  shortDescription: "",
  description: "",
  material: "",
  dimensions: "",
  weight: "",
  finish: "",
};

function toProductPayload(form: ProductForm): Omit<FurniProduct, "id"> {
  const originalPrice = Number(form.price);
  return {
    name: form.name,
    category: form.category,
    categoryName: form.category,
    price: originalPrice,
    originalPrice,
    discount: 0,
    stock: Number(form.stock),
    image: form.image,
    imageUrls: form.image ? [form.image] : [],
    shortDescription: form.shortDescription,
    description: form.description,
    specs: {
      material: form.material,
      dimensions: form.dimensions,
      weight: form.weight,
      finish: form.finish,
    },
    featured: false,
    status: "pending",
    rating: 0,
  };
}

export default function VendorNewProductPage() {
  const router = useRouter();
  const { currentUser } = useAuthSession();
  const { categories } = useFurniStore();
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) return categories.map((c) => c.name);
    return ["Chairs", "Tables", "Sofas"];
  }, [categories]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser?.id) return;

    setSaving(true);
    setError("");
    try {
      await createProductInFirestore(toProductPayload(form), currentUser.id);
      router.push("/vendor/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save product.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/vendor/products"
        className="text-sm font-medium text-furni-primary hover:underline"
      >
        ← Back to products
      </Link>

      <FurniCard>
        <h2 className="font-display text-xl text-furni-primary">List a new product</h2>
        <p className="mt-2 text-sm text-furni-muted">
          New listings are submitted as <strong>pending</strong> until Covmerc approves them for
          the storefront.
        </p>

        <form className="mt-6 grid gap-3" onSubmit={handleSubmit}>
          <FurniInput
            required
            label="Product name"
            value={form.name}
            onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FurniInput
              required
              type="number"
              min="0"
              label="Price (NGN)"
              value={form.price}
              onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))}
            />
            <FurniInput
              required
              type="number"
              min="0"
              label="Stock"
              value={form.stock}
              onChange={(e) => setForm((c) => ({ ...c, stock: e.target.value }))}
            />
          </div>
          <label className="text-sm text-furni-muted">
            Category
            <select
              value={form.category}
              onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-furni-ink"
            >
              {categoryOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <FurniInput
            required
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm((c) => ({ ...c, image: e.target.value }))}
          />
          <FurniInput
            label="Short description"
            value={form.shortDescription}
            onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))}
          />
          <label className="text-sm text-furni-muted">
            Full description
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-furni-ink"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <FurniInput
              label="Material"
              value={form.material}
              onChange={(e) => setForm((c) => ({ ...c, material: e.target.value }))}
            />
            <FurniInput
              label="Dimensions"
              value={form.dimensions}
              onChange={(e) => setForm((c) => ({ ...c, dimensions: e.target.value }))}
            />
            <FurniInput
              label="Weight"
              value={form.weight}
              onChange={(e) => setForm((c) => ({ ...c, weight: e.target.value }))}
            />
            <FurniInput
              label="Finish"
              value={form.finish}
              onChange={(e) => setForm((c) => ({ ...c, finish: e.target.value }))}
            />
          </div>
          {error ? <p className="text-sm text-furni-danger">{error}</p> : null}
          <FurniButton type="submit" variant="accent" disabled={saving}>
            {saving ? "Submitting…" : "Submit for approval"}
          </FurniButton>
        </form>
      </FurniCard>
    </div>
  );
}
