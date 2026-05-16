"use client";

import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniInput } from "@/components/ui/FurniInput";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { formatNgn } from "@/lib/format-currency";
import type { FurniProduct, ProductCategory } from "@/lib/furni-types";

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

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const defaultForm: ProductForm = {
  name: "",
  price: "",
  category: "Chairs",
  stock: "",
  image: "",
  shortDescription: "",
  description: "",
  material: "",
  dimensions: "",
  weight: "",
  finish: ""
};

function toProductPayload(form: ProductForm, status: string): Omit<FurniProduct, "id"> {
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
    imageUrls: [form.image],
    shortDescription: form.shortDescription,
    description: form.description,
    specs: {
      material: form.material,
      dimensions: form.dimensions,
      weight: form.weight,
      finish: form.finish
    },
    featured: false,
    status,
    rating: 0
  };
}

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "approved" || normalized === "active") {
    return "bg-furni-success/20 text-furni-success";
  }
  if (normalized === "pending") {
    return "bg-furni-warning/20 text-furni-warning";
  }
  if (normalized === "rejected") {
    return "bg-red-100 text-red-700";
  }
  return "bg-slate-100 text-slate-700";
}

export default function AdminProductsPage() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useFurniStore();
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const categoryOptions = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((entry) => entry.name);
    }
    return ["Chairs", "Tables", "Sofas"];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (statusFilter === "all") return true;
      return product.status.toLowerCase() === statusFilter;
    });
  }, [products, statusFilter]);

  const sortedProducts = useMemo(
    () => [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name)),
    [filteredProducts]
  );

  function resetForm() {
    setForm({ ...defaultForm, category: categoryOptions[0] ?? "Chairs" });
    setEditingProductId(null);
  }

  function populateForEdit(product: FurniProduct) {
    setEditingProductId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image,
      shortDescription: product.shortDescription,
      description: product.description,
      material: product.specs.material,
      dimensions: product.specs.dimensions,
      weight: product.specs.weight,
      finish: product.specs.finish
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      if (editingProductId) {
        const payload = toProductPayload(form, "approved");
        const { status, ...editable } = payload;
        void status;
        await updateProduct(editingProductId, editable);
      } else {
        await addProduct(toProductPayload(form, "pending"));
      }
      resetForm();
    } catch {
      window.alert("Unable to save product. Check Firebase rules and try again.");
    }
  }

  async function setProductStatus(productId: string, status: string) {
    try {
      await updateProduct(productId, { status });
    } catch {
      window.alert("Unable to update product status.");
    }
  }

  return (
    <AdminLayout
      title="Inventory Management"
      subtitle="Review pending listings, approve products for the storefront, and manage catalog data."
    >
      <FurniCard>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <h2 className="md:col-span-2 text-lg font-semibold text-furni-primary">
            {editingProductId ? "Edit Product" : "Add New Product"}
          </h2>

          <FurniInput
            required
            label="Name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <label className="flex flex-col gap-1.5 text-sm text-furni-muted">
            <span className="text-xs font-medium">Category</span>
            <select
              className="w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-sm text-furni-ink"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category: event.target.value
                }))
              }
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <FurniInput
            required
            type="number"
            label="Price (NGN)"
            min={1}
            value={form.price}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: event.target.value }))
            }
          />
          <FurniInput
            required
            type="number"
            label="Stock Level"
            min={0}
            value={form.stock}
            onChange={(event) =>
              setForm((current) => ({ ...current, stock: event.target.value }))
            }
          />
          <FurniInput
            required
            label="Image URL"
            className="md:col-span-2"
            value={form.image}
            onChange={(event) =>
              setForm((current) => ({ ...current, image: event.target.value }))
            }
          />
          <FurniInput
            required
            label="Short Description"
            className="md:col-span-2"
            value={form.shortDescription}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                shortDescription: event.target.value
              }))
            }
          />
          <FurniInput
            required
            label="Full Description"
            className="md:col-span-2"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
          />
          <FurniInput
            required
            label="Material"
            value={form.material}
            onChange={(event) =>
              setForm((current) => ({ ...current, material: event.target.value }))
            }
          />
          <FurniInput
            required
            label="Dimensions"
            value={form.dimensions}
            onChange={(event) =>
              setForm((current) => ({ ...current, dimensions: event.target.value }))
            }
          />
          <FurniInput
            required
            label="Weight"
            value={form.weight}
            onChange={(event) =>
              setForm((current) => ({ ...current, weight: event.target.value }))
            }
          />
          <FurniInput
            required
            label="Finish"
            value={form.finish}
            onChange={(event) =>
              setForm((current) => ({ ...current, finish: event.target.value }))
            }
          />

          <div className="md:col-span-2 flex flex-wrap gap-2">
            <FurniButton type="submit">
              {editingProductId ? "Update Product" : "Submit for review"}
            </FurniButton>
            {editingProductId ? (
              <FurniButton type="button" variant="outline" onClick={resetForm}>
                Cancel Edit
              </FurniButton>
            ) : null}
          </div>
        </form>
      </FurniCard>

      <FurniCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-furni-primary">Inventory Table</h2>
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize ${
                  statusFilter === filter
                    ? "bg-furni-primary text-white"
                    : "bg-furni-surface text-furni-primary ring-1 ring-furni-primary/15"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-furni-primary/10 text-left text-furni-muted">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Price</th>
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Stock</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 pr-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id} className="border-b border-furni-primary/5">
                  <td className="py-3 pr-4 font-medium text-furni-primary">{product.name}</td>
                  <td className="py-3 pr-4 text-furni-muted">{formatNgn(product.price)}</td>
                  <td className="py-3 pr-4 text-furni-muted">
                    {product.categoryName || product.category}
                  </td>
                  <td className="py-3 pr-4 text-furni-muted">{product.stock}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusBadgeClass(product.status)}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      {product.status.toLowerCase() === "pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => void setProductStatus(product.id, "approved")}
                            className="rounded-lg border border-furni-success/30 px-2 py-1 text-xs font-medium text-furni-success hover:bg-furni-success/10"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => void setProductStatus(product.id, "rejected")}
                            className="rounded-lg border border-furni-danger/25 px-2 py-1 text-xs font-medium text-furni-danger hover:bg-furni-danger/5"
                          >
                            Reject
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => populateForEdit(product)}
                        className="rounded-lg border border-furni-primary/20 px-2 py-1 text-xs font-medium text-furni-primary hover:bg-furni-primary/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void deleteProduct(product.id).catch(() => {
                            window.alert("Unable to delete product.");
                          });
                        }}
                        className="rounded-lg border border-furni-danger/25 px-2 py-1 text-xs font-medium text-furni-danger hover:bg-furni-danger/5"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </FurniCard>
    </AdminLayout>
  );
}
