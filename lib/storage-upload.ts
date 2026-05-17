import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebase } from "@/lib/firebase";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type UploadProductImageInput = {
  file: File;
  ownerId: string;
  folderId: string;
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

export function validateProductImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Please upload a JPEG, PNG, WebP, or GIF image.";
  }
  if (file.size > MAX_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

export async function uploadProductImage({
  file,
  ownerId,
  folderId,
}: UploadProductImageInput): Promise<string> {
  const validationError = validateProductImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const { storage } = getFirebase();
  const safeName = sanitizeFilename(file.name || "image.jpg");
  const objectPath = `products/${ownerId}/${folderId}/${Date.now()}-${safeName}`;
  const objectRef = ref(storage, objectPath);

  await uploadBytes(objectRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedBy: ownerId,
    },
  });

  return getDownloadURL(objectRef);
}

export async function uploadProductImages(
  files: File[],
  ownerId: string,
  folderId: string,
): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadProductImage({ file, ownerId, folderId }));
  }
  return urls;
}
