"use client";

import { useId, useState } from "react";
import { FurniImage } from "@/components/ui/FurniImage";
import { FurniInput } from "@/components/ui/FurniInput";
import { uploadProductImages, validateProductImageFile } from "@/lib/storage-upload";

type ProductImageUploadProps = {
  ownerId: string;
  folderId: string;
  imageUrls: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
};

export function ProductImageUpload({
  ownerId,
  folderId,
  imageUrls,
  onChange,
  maxImages = 6,
  label = "Product images",
}: ProductImageUploadProps) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList?.length) return;

    const files = Array.from(fileList);
    const remaining = maxImages - imageUrls.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${maxImages} images.`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    for (const file of toUpload) {
      const validationError = validateProductImageFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setUploading(true);
    setError("");
    try {
      const urls = await uploadProductImages(toUpload, ownerId, folderId);
      onChange([...imageUrls, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function removeAt(index: number) {
    onChange(imageUrls.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="text-sm font-medium text-furni-primary">
        {label}
      </label>
      <p className="text-xs text-furni-muted">
        Upload JPEG, PNG, or WebP (max 5 MB each). First image is the catalog cover.
      </p>

      {imageUrls.length > 0 ? (
        <ul className="flex flex-wrap gap-3">
          {imageUrls.map((url, index) => (
            <li key={`${url}-${index}`} className="relative">
              <FurniImage
                src={url}
                alt=""
                variant="thumb"
                className="h-20 w-20 rounded-xl ring-1 ring-furni-primary/15"
              />
              {index === 0 ? (
                <span className="absolute left-1 top-1 rounded bg-furni-primary px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Cover
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-furni-danger text-xs text-white"
                aria-label="Remove image"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={uploading || imageUrls.length >= maxImages}
          className="block w-full max-w-md text-sm text-furni-muted file:mr-3 file:rounded-lg file:border-0 file:bg-furni-primary file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-furni-primary/90"
          onChange={(event) => {
            void handleFilesSelected(event.target.files);
            event.target.value = "";
          }}
        />
        {uploading ? (
          <span className="text-xs text-furni-muted">Uploading…</span>
        ) : null}
      </div>

      {error ? <p className="text-sm text-furni-danger">{error}</p> : null}

      <FurniInput
        label="Or paste image URL"
        value={imageUrls[0] ?? ""}
        onChange={(event) => {
          const url = event.target.value.trim();
          if (!url) {
            // Clear only the cover slot; keep other uploaded images.
            onChange(imageUrls.slice(1));
            return;
          }
          onChange([url, ...imageUrls.slice(1)]);
        }}
      />
    </div>
  );
}
