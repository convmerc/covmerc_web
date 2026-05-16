import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { initialProducts } from "@/lib/furni-data";
import {
  buildCovmercOrderItems,
  buildPaymentStatus,
  furniOrderStatusToFirestore,
  isStorefrontProduct,
  mapFirestoreOrder,
  mapFirestoreProduct,
  mapPaymentMethodToCovmerc,
  mapUserProfile,
  productToFirestore,
  shippingToDeliveryAddress
} from "@/lib/store-mappers";
import type {
  CartItem,
  CheckoutShipping,
  FurniOrder,
  FurniOrderStatus,
  FurniProduct
} from "@/lib/furni-types";

const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";
const USERS_COLLECTION = "users";
const CATEGORIES_COLLECTION = "categories";

function normalizeSeedProducts(products: FurniProduct[]): FurniProduct[] {
  return products.map((product) => ({
    ...product,
    categoryName: product.categoryName ?? product.category,
    originalPrice: product.originalPrice ?? product.price,
    discount: product.discount ?? 0,
    imageUrls: product.imageUrls?.length ? product.imageUrls : [product.image],
    status: product.status ?? "approved",
    rating: product.rating ?? 0
  }));
}

const seedProducts = normalizeSeedProducts(initialProducts);

function mapProductDocs(
  docs: Array<{ id: string; data: Record<string, unknown> }>,
  options: { includeUnapproved?: boolean }
): FurniProduct[] {
  return docs
    .filter((entry) => options.includeUnapproved || isStorefrontProduct(entry.data))
    .map((entry) => mapFirestoreProduct(entry.id, entry.data))
    .filter((entry): entry is FurniProduct => Boolean(entry));
}

export async function fetchProductsFromFirestore(options?: {
  includeUnapproved?: boolean;
}): Promise<FurniProduct[]> {
  const { db } = getFirebase();
  const snapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));

  if (snapshot.empty) {
    return seedProducts;
  }

  const products = mapProductDocs(
    snapshot.docs.map((entry) => ({
      id: entry.id,
      data: entry.data() as Record<string, unknown>
    })),
    options ?? {}
  );

  return products.length > 0 ? products : seedProducts;
}

export function subscribeToProducts(
  onData: (products: FurniProduct[]) => void,
  onError?: (error: Error) => void,
  options?: { includeUnapproved?: boolean }
): Unsubscribe {
  const { db } = getFirebase();

  return onSnapshot(
    collection(db, PRODUCTS_COLLECTION),
    (snapshot) => {
      if (snapshot.empty) {
        onData(seedProducts);
        return;
      }

      const products = mapProductDocs(
        snapshot.docs.map((entry) => ({
          id: entry.id,
          data: entry.data() as Record<string, unknown>
        })),
        options ?? {}
      );

      onData(products.length > 0 ? products : seedProducts);
    },
    (error) => onError?.(error)
  );
}

export async function createProductInFirestore(
  product: Omit<FurniProduct, "id">,
  vendorUserId?: string
): Promise<string> {
  const { db } = getFirebase();
  const ref = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...productToFirestore(product, vendorUserId),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return ref.id;
}

export async function updateProductInFirestore(
  id: string,
  product: Partial<FurniProduct>,
  vendorUserId?: string
): Promise<void> {
  const { db } = getFirebase();
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (product.name !== undefined) payload.name = product.name;
  if (product.category !== undefined || product.categoryName !== undefined) {
    const categoryName = product.categoryName ?? product.category;
    if (categoryName) {
      payload.categories = [{ name: categoryName }];
    }
  }
  if (product.originalPrice !== undefined) payload.price = product.originalPrice;
  if (product.price !== undefined && product.originalPrice === undefined) {
    payload.price = product.price;
  }
  if (product.discount !== undefined) payload.discount = product.discount;
  if (product.stock !== undefined) payload.stock = product.stock;
  if (product.image !== undefined) {
    payload.imageUrl = product.image;
    payload.imageUrls = product.imageUrls?.length ? product.imageUrls : [product.image];
  }
  if (product.description !== undefined) payload.description = product.description;
  if (product.status !== undefined) payload.status = product.status;
  if (product.featured !== undefined) {
    payload.featured = product.featured;
    payload.isFeatured = product.featured;
  }
  if (product.rating !== undefined) payload.rating = product.rating;
  if (vendorUserId) payload.userId = vendorUserId;
  if (product.vendorId) payload.userId = product.vendorId;

  await updateDoc(doc(db, PRODUCTS_COLLECTION, id), payload);
}

export async function deleteProductFromFirestore(id: string): Promise<void> {
  const { db } = getFirebase();
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
}

export async function fetchOrdersForUser(userId: string): Promise<FurniOrder[]> {
  const { db } = getFirebase();

  try {
    const ordersQuery = query(
      collection(db, ORDERS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(ordersQuery);
    return snapshot.docs.map((entry) =>
      mapFirestoreOrder(entry.id, entry.data() as Record<string, unknown>)
    );
  } catch {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    return snapshot.docs
      .filter((entry) => (entry.data() as Record<string, unknown>).userId === userId)
      .map((entry) =>
        mapFirestoreOrder(entry.id, entry.data() as Record<string, unknown>)
      );
  }
}

export async function fetchAllOrders(): Promise<FurniOrder[]> {
  const { db } = getFirebase();

  try {
    const snapshot = await getDocs(
      query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"))
    );
    return snapshot.docs.map((entry) =>
      mapFirestoreOrder(entry.id, entry.data() as Record<string, unknown>)
    );
  } catch {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    return snapshot.docs.map((entry) =>
      mapFirestoreOrder(entry.id, entry.data() as Record<string, unknown>)
    );
  }
}

export async function updateOrderStatusInFirestore(
  orderId: string,
  status: FurniOrderStatus
): Promise<void> {
  const { db } = getFirebase();
  const payload: Record<string, unknown> = {
    status: furniOrderStatusToFirestore(status),
    updatedAt: serverTimestamp()
  };

  if (status === "Delivered") {
    payload.deliveredAt = serverTimestamp();
  }
  if (status === "Shipped") {
    payload.shippedAt = serverTimestamp();
  }

  await updateDoc(doc(db, ORDERS_COLLECTION, orderId), payload);
}

export async function createOrderInFirestore(input: {
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  shipping: CheckoutShipping;
  paymentMethod: string;
  lineItems: ReturnType<typeof buildCovmercOrderItems>;
  subtotal: number;
  deliveryFee?: number;
  notes?: string;
  isGuest?: boolean;
  paystackReference?: string;
}): Promise<string> {
  const { db } = getFirebase();
  const paymentMethod = mapPaymentMethodToCovmerc(input.paymentMethod);
  const deliveryFee = input.deliveryFee ?? 0;
  const vendorIds = [
    ...new Set(
      input.lineItems
        .map((item) => item.vendorId)
        .filter((entry): entry is string => Boolean(entry))
    )
  ];

  const ref = await addDoc(collection(db, ORDERS_COLLECTION), {
    userId: input.userId,
    userEmail: input.userEmail,
    userName: input.userName,
    userPhone: input.userPhone ?? input.shipping.phone ?? "",
    items: input.lineItems,
    vendorIds,
    deliveryAddress: shippingToDeliveryAddress(input.shipping, input.userId),
    subtotal: input.subtotal,
    deliveryFee,
    totalAmount: input.subtotal + deliveryFee,
    status: "pending",
    paymentStatus: buildPaymentStatus(paymentMethod),
    paymentMethod,
    notes: input.notes ?? null,
    isGuest: Boolean(input.isGuest),
    paystackReference: input.paystackReference ?? null,
    source: "web_storefront",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return ref.id;
}

export { CATEGORIES_COLLECTION };

export async function getUserProfile(uid: string) {
  const { db } = getFirebase();
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snapshot.exists()) return null;
  return mapUserProfile(snapshot.data() as Record<string, unknown>);
}

export async function ensureUserProfile(input: {
  uid: string;
  name: string;
  email: string;
  phone?: string;
}): Promise<void> {
  const { db } = getFirebase();
  const ref = doc(db, USERS_COLLECTION, input.uid);
  const existing = await getDoc(ref);

  if (existing.exists()) {
    await updateDoc(ref, {
      name: input.name,
      email: input.email,
      ...(input.phone ? { phone: input.phone } : {}),
      updatedAt: serverTimestamp()
    });
    return;
  }

  await setDoc(ref, {
    uid: input.uid,
    name: input.name,
    email: input.email,
    phone: input.phone ?? "",
    userType: "customer",
    emailVerified: false,
    phoneVerified: false,
    isAdmin: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function buildOrderLineItems(cartItems: CartItem[], products: FurniProduct[]) {
  return buildCovmercOrderItems(
    cartItems
      .map((item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          image: product.image,
          vendorId: product.vendorId
        };
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
  );
}
