"use client";

import { useEffect, useState } from "react";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniInput } from "@/components/ui/FurniInput";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import type { CovmercAddress } from "@/lib/marketplace-types";
import {
  deleteUserAddress,
  saveUserAddress,
  subscribeToUserAddresses
} from "@/lib/store-marketplace";

const emptyForm = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Nigeria",
  isDefault: false
};

export default function AccountAddressesPage() {
  const { currentUser } = useAuthSession();
  const [addresses, setAddresses] = useState<CovmercAddress[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    return subscribeToUserAddresses(currentUser.id, setAddresses);
  }, [currentUser]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function populateForm(address: CovmercAddress) {
    setEditingId(address.id);
    setForm({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? "",
      city: address.city,
      state: address.state ?? "",
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    try {
      await saveUserAddress(currentUser.id, form, editingId ?? undefined);
      resetForm();
    } catch {
      window.alert("Unable to save address.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.1fr]">
      <FurniCard>
        <h2 className="text-lg font-semibold text-furni-primary">Saved addresses</h2>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-furni-muted">No saved addresses yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {addresses.map((address) => (
              <li
                key={address.id}
                className="rounded-xl border border-furni-primary/10 p-3 text-sm"
              >
                <p className="font-medium text-furni-primary">
                  {address.fullName}
                  {address.isDefault ? (
                    <span className="ml-2 rounded-full bg-furni-accent/30 px-2 py-0.5 text-xs">
                      Default
                    </span>
                  ) : null}
                </p>
                <p className="mt-1 text-furni-muted">{address.addressLine1}</p>
                <p className="text-furni-muted">
                  {address.city}, {address.country} {address.postalCode}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => populateForm(address)}
                    className="text-xs font-medium text-furni-primary underline"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteUserAddress(address.id)}
                    className="text-xs font-medium text-furni-danger underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </FurniCard>

      <FurniCard>
        <h2 className="text-lg font-semibold text-furni-primary">
          {editingId ? "Edit address" : "Add address"}
        </h2>
        <form className="mt-4 grid gap-3" onSubmit={handleSubmit}>
          <FurniInput
            required
            label="Full name"
            value={form.fullName}
            onChange={(e) => setForm((c) => ({ ...c, fullName: e.target.value }))}
          />
          <FurniInput
            required
            type="tel"
            label="Phone"
            value={form.phoneNumber}
            onChange={(e) => setForm((c) => ({ ...c, phoneNumber: e.target.value }))}
          />
          <FurniInput
            required
            label="Address line 1"
            value={form.addressLine1}
            onChange={(e) => setForm((c) => ({ ...c, addressLine1: e.target.value }))}
          />
          <FurniInput
            label="Address line 2"
            value={form.addressLine2}
            onChange={(e) => setForm((c) => ({ ...c, addressLine2: e.target.value }))}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <FurniInput
              required
              label="City"
              value={form.city}
              onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
            />
            <FurniInput
              required
              label="Postal code"
              value={form.postalCode}
              onChange={(e) => setForm((c) => ({ ...c, postalCode: e.target.value }))}
            />
          </div>
          <FurniInput
            required
            label="Country"
            value={form.country}
            onChange={(e) => setForm((c) => ({ ...c, country: e.target.value }))}
          />
          <label className="flex items-center gap-2 text-sm text-furni-muted">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm((c) => ({ ...c, isDefault: e.target.checked }))}
            />
            Set as default address
          </label>
          <div className="flex gap-2">
            <FurniButton type="submit" variant="accent" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update" : "Save address"}
            </FurniButton>
            {editingId ? (
              <FurniButton type="button" variant="outline" onClick={resetForm}>
                Cancel
              </FurniButton>
            ) : null}
          </div>
        </form>
      </FurniCard>
    </div>
  );
}
