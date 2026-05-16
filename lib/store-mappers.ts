import type {
  CovmercAddress,
  CovmercCategory,
  CovmercOrderItem,
  CovmercPaymentMethod,
  CovmercPaymentStatus
} from "@/lib/covmerc-models";
import type {
  FurniOrder,
  FurniOrderStatus,
  FurniProduct,
  ProductCategory
} from "@/lib/furni-types";
import { PRODUCT_IMAGE_FALLBACK } from "@/lib/image-utils";

const legacyCategories: ProductCategory[] = ["Chairs", "Tables", "Sofas"];

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === "true" || value === 1;
}

export function parseFirestoreDate(value: unknown): Date | null {
  if (value == null) return null;

  if (typeof value === "object" && value !== null && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate();
    } catch {
      return null;
    }
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value);
  }

  if (typeof value === "string" && value.trim()) {
    const asInt = Number(value);
    if (Number.isFinite(asInt) && value.length >= 10) {
      return new Date(asInt);
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

function formatDisplayDate(value: unknown): string {
  const date = parseFirestoreDate(value);
  if (!date) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}

function firstStringFromArray(value: unknown): string {
  if (!Array.isArray(value)) return "";
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      return entry.trim();
    }
  }
  return "";
}

function pickProductImage(data: Record<string, unknown>): string {
  const processed = firstStringFromArray(data.processedImageUrls);
  if (processed) return processed;

  const fromArray = firstStringFromArray(data.imageUrls);
  if (fromArray) return fromArray;

  const direct = asString(data.imageUrl ?? data.image ?? data.photoUrl);
  return direct || PRODUCT_IMAGE_FALLBACK;
}

function parseCategories(value: unknown): CovmercCategory[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (typeof entry === "string") {
        return { name: entry };
      }
      if (entry && typeof entry === "object") {
        const record = entry as Record<string, unknown>;
        const name = asString(record.name);
        if (!name) return null;
        return {
          id: asString(record.id) || undefined,
          name
        };
      }
      return null;
    })
    .filter((entry): entry is CovmercCategory => Boolean(entry));
}

/** Maps Flutter category names like "Chair" to shop filter buckets. */
function normalizeLegacyCategory(name: string): ProductCategory {
  const lower = name.trim().toLowerCase();
  if (lower.startsWith("chair")) return "Chairs";
  if (lower.startsWith("table")) return "Tables";
  if (lower.startsWith("sofa")) return "Sofas";

  const exact = legacyCategories.find((entry) => entry.toLowerCase() === lower);
  return exact ?? "Chairs";
}

function categoryLabelFromProduct(data: Record<string, unknown>): ProductCategory {
  const categories = parseCategories(data.categories);
  const firstName = categories[0]?.name ?? asString(data.category ?? data.productCategory);
  if (!firstName) return "Chairs";
  return normalizeLegacyCategory(firstName);
}

/** Matches ProductModel.discountedPrice in Flutter. */
export function calculateDiscountedPrice(
  price: number,
  discount: number | undefined
): number {
  if (!discount || discount <= 0) return price;

  let discountValue = discount;
  if (discountValue > 1) {
    discountValue = discountValue / 100;
  }

  return price * (1 - discountValue);
}

export function isStorefrontProduct(data: Record<string, unknown>): boolean {
  const status = asString(data.status, "approved").toLowerCase();
  return status === "approved" || status === "active";
}

export function mapFirestoreProduct(
  id: string,
  data: Record<string, unknown>
): FurniProduct | null {
  const name = asString(data.name);
  if (!name) return null;

  const originalPrice = asNumber(data.price);
  const discount = asNumber(data.discount, 0);
  const salePrice = calculateDiscountedPrice(originalPrice, discount);
  const categories = parseCategories(data.categories);
  const categoryName = categories[0]?.name ?? categoryLabelFromProduct(data);

  return {
    id,
    vendorId: asString(data.userId) || undefined,
    name,
    category: categoryLabelFromProduct(data),
    categoryName,
    price: salePrice,
    originalPrice,
    discount,
    stock: asNumber(data.stock ?? data.inventory, 99),
    image: pickProductImage(data),
    imageUrls: Array.isArray(data.imageUrls)
      ? data.imageUrls.filter((entry): entry is string => typeof entry === "string")
      : data.imageUrl
        ? [asString(data.imageUrl)]
        : [],
    description: asString(data.description, name),
    shortDescription: asString(
      data.shortDescription ?? data.summary,
      asString(data.description, name).slice(0, 120)
    ),
    specs: {
      material: asString(data.material, "—"),
      dimensions: asString(data.dimensions, "—"),
      weight: asString(data.weight, "—"),
      finish: asString(data.finish, "—")
    },
    featured: asBoolean(data.featured ?? data.isFeatured),
    status: asString(data.status, "pending"),
    rating: asNumber(data.rating, 0)
  };
}

export function productToFirestore(
  product: Omit<FurniProduct, "id"> | FurniProduct,
  vendorUserId?: string
): Record<string, unknown> {
  const categoryName = product.categoryName ?? product.category;

  return {
    userId: vendorUserId ?? product.vendorId ?? "",
    name: product.name,
    price: product.originalPrice ?? product.price,
    discount: product.discount ?? 0,
    imageUrl: product.image,
    imageUrls: product.imageUrls?.length ? product.imageUrls : [product.image],
    categories: [{ name: categoryName }],
    description: product.description,
    rating: product.rating ?? 0,
    colors: [],
    status: product.status ?? "approved",
    stock: product.stock,
    featured: Boolean(product.featured),
    isFeatured: Boolean(product.featured),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

const orderStatusMap: Record<string, FurniOrderStatus> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned"
};

export function mapFirestoreOrderStatus(value: unknown): FurniOrderStatus {
  const raw = asString(value, "pending").toLowerCase();
  return orderStatusMap[raw] ?? "Pending";
}

export function furniOrderStatusToFirestore(status: FurniOrderStatus): string {
  return status.toLowerCase();
}

export function mapFirestoreOrder(
  id: string,
  data: Record<string, unknown>
): FurniOrder {
  const items = Array.isArray(data.items) ? data.items : [];
  const itemCount = items.reduce((sum, item) => {
    if (item && typeof item === "object") {
      return sum + asNumber((item as Record<string, unknown>).quantity, 1);
    }
    return sum + 1;
  }, 0);

  return {
    id,
    customer: asString(data.userName ?? data.customerName ?? data.customer, "Customer"),
    customerEmail: asString(data.userEmail),
    items: itemCount || asNumber(data.itemCount ?? data.items, 0),
    total: asNumber(data.totalAmount ?? data.total ?? data.subtotal),
    subtotal: asNumber(data.subtotal),
    deliveryFee: asNumber(data.deliveryFee, 0),
    status: mapFirestoreOrderStatus(data.status),
    paymentStatus: asString(data.paymentStatus, "pending"),
    paymentMethod: asString(data.paymentMethod, "cash"),
    createdAt: formatDisplayDate(data.createdAt),
    trackingNumber: asString(data.trackingNumber) || undefined
  };
}

export function mapPaymentMethodToCovmerc(method: string): CovmercPaymentMethod {
  const normalized = method.toLowerCase().replace(/\s+/g, "");
  if (normalized.includes("card")) return "card";
  if (normalized.includes("bank")) return "bankTransfer";
  if (normalized.includes("wallet")) return "wallet";
  return "cash";
}

export function shippingToDeliveryAddress(
  shipping: {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  },
  userId: string
): CovmercAddress {
  return {
    userId,
    fullName: shipping.fullName,
    phoneNumber: shipping.phone ?? "",
    addressLine1: shipping.address,
    city: shipping.city,
    state: shipping.city,
    postalCode: shipping.zipCode,
    country: shipping.country,
    addressType: "home",
    isDefault: false
  };
}

export function mapUserProfile(data: Record<string, unknown> | undefined) {
  if (!data) return null;

  return {
    uid: asString(data.uid),
    name: asString(data.name ?? data.displayName, "Customer"),
    email: asString(data.email),
    phone: asString(data.phone),
    userType: asString(data.userType, "customer"),
    isAdmin: asBoolean(data.isAdmin) || data.userType === "admin",
    vendorStatus: asString(data.vendorStatus) || undefined
  };
}

export type StoreOrderLineItem = CovmercOrderItem;

export function buildCovmercOrderItems(
  lineItems: Array<{
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    image?: string;
    vendorId?: string;
  }>
): CovmercOrderItem[] {
  return lineItems.map((item) => ({
    productId: item.productId,
    productName: item.name,
    productImage: item.image,
    price: item.unitPrice,
    quantity: item.quantity,
    total: item.unitPrice * item.quantity,
    vendorId: item.vendorId
  }));
}

export function buildPaymentStatus(paymentMethod: CovmercPaymentMethod): CovmercPaymentStatus {
  return paymentMethod === "cash" ? "pending" : "pending";
}
