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
import { slugifyBlogTitle, uniqueBlogSlug } from "@/lib/blog-utils";
import { shouldUseSeedFirestoreFallback } from "@/lib/firestore-fallback";
import { initialBlogPosts, initialProducts } from "@/lib/furni-data";
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
import { parseFirestoreDate } from "@/lib/store-mappers";
import type {
  CartItem,
  CheckoutShipping,
  FurniBlogPost,
  FurniBlogPostStatus,
  FurniOrder,
  FurniOrderStatus,
  FurniProduct
} from "@/lib/furni-types";

const PRODUCTS_COLLECTION = "products";
const BLOG_POSTS_COLLECTION = "blogPosts";
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
const seedBlogPosts = initialBlogPosts;

function formatBlogPublishedAt(value: unknown, fallback = ""): string {
  const date = parseFirestoreDate(value);
  if (date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  }
  return typeof value === "string" && value.trim() ? value : fallback;
}

function mapFirestoreBlogPost(
  id: string,
  data: Record<string, unknown>
): FurniBlogPost | null {
  const title = typeof data.title === "string" ? data.title.trim() : "";
  if (!title) return null;

  const slug =
    typeof data.slug === "string" && data.slug.trim()
      ? data.slug.trim()
      : slugifyBlogTitle(title) || id;

  const statusRaw = typeof data.status === "string" ? data.status : "published";
  const status: FurniBlogPostStatus =
    statusRaw === "draft" ? "draft" : "published";

  return {
    id,
    slug,
    title,
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    content: typeof data.content === "string" ? data.content : "",
    coverImage:
      typeof data.coverImage === "string"
        ? data.coverImage
        : typeof data.imageUrl === "string"
          ? data.imageUrl
          : "",
    category: typeof data.category === "string" ? data.category : "Design",
    publishedAt: formatBlogPublishedAt(
      data.publishedAt,
      formatBlogPublishedAt(data.createdAt, "")
    ),
    author:
      typeof data.author === "string" && data.author.trim()
        ? data.author
        : "Covmerc Editorial",
    status
  };
}

function mapBlogDocs(
  docs: Array<{ id: string; data: Record<string, unknown> }>,
  options?: { includeDrafts?: boolean }
): FurniBlogPost[] {
  const posts = docs
    .map((entry) => mapFirestoreBlogPost(entry.id, entry.data))
    .filter((entry): entry is FurniBlogPost => Boolean(entry))
    .filter((entry) => options?.includeDrafts || entry.status === "published");

  return posts.sort((a, b) => {
    const aTime = Date.parse(a.publishedAt);
    const bTime = Date.parse(b.publishedAt);
    if (Number.isFinite(aTime) && Number.isFinite(bTime)) {
      return bTime - aTime;
    }
    return b.title.localeCompare(a.title);
  });
}

export async function fetchBlogPostsFromFirestore(options?: {
  includeDrafts?: boolean;
}): Promise<FurniBlogPost[]> {
  if (shouldUseSeedFirestoreFallback()) {
    return options?.includeDrafts
      ? seedBlogPosts
      : seedBlogPosts.filter((post) => post.status === "published");
  }

  const { db } = getFirebase();
  const snapshot = await getDocs(collection(db, BLOG_POSTS_COLLECTION));

  if (snapshot.empty) {
    return seedBlogPosts;
  }

  const posts = mapBlogDocs(
    snapshot.docs.map((entry) => ({
      id: entry.id,
      data: entry.data() as Record<string, unknown>
    })),
    options
  );

  return posts.length > 0 ? posts : seedBlogPosts;
}

export async function fetchBlogPostBySlug(
  slug: string,
  options?: { includeDrafts?: boolean }
): Promise<FurniBlogPost | null> {
  const posts = await fetchBlogPostsFromFirestore(options);
  return (
    posts.find((post) => post.slug === slug || post.id === slug) ?? null
  );
}

export function subscribeToBlogPosts(
  onData: (posts: FurniBlogPost[]) => void,
  onError?: (error: Error) => void,
  options?: { includeDrafts?: boolean }
): Unsubscribe {
  if (shouldUseSeedFirestoreFallback()) {
    onData(
      options?.includeDrafts
        ? seedBlogPosts
        : seedBlogPosts.filter((post) => post.status === "published")
    );
    return () => {};
  }

  const { db } = getFirebase();

  return onSnapshot(
    collection(db, BLOG_POSTS_COLLECTION),
    (snapshot) => {
      if (snapshot.empty) {
        onData(seedBlogPosts);
        return;
      }

      const posts = mapBlogDocs(
        snapshot.docs.map((entry) => ({
          id: entry.id,
          data: entry.data() as Record<string, unknown>
        })),
        options
      );

      onData(posts.length > 0 ? posts : seedBlogPosts);
    },
    (error) => {
      if (shouldUseSeedFirestoreFallback()) {
        onData(seedBlogPosts);
        return;
      }
      onError?.(error);
    }
  );
}

export async function createBlogPostInFirestore(
  post: Pick<
    FurniBlogPost,
    "title" | "excerpt" | "content" | "category" | "coverImage"
  > & {
    author?: string;
    slug?: string;
    status?: FurniBlogPostStatus;
  }
): Promise<string> {
  const { db } = getFirebase();
  const existing = await fetchBlogPostsFromFirestore({ includeDrafts: true });
  const baseSlug = post.slug?.trim() || slugifyBlogTitle(post.title);
  const slug = uniqueBlogSlug(baseSlug || `post-${Date.now()}`, existing);
  const status = post.status ?? "published";

  const ref = await addDoc(collection(db, BLOG_POSTS_COLLECTION), {
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    category: post.category,
    author: post.author ?? "Covmerc Admin",
    slug,
    status,
    publishedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return ref.id;
}

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
  if (shouldUseSeedFirestoreFallback()) {
    return options?.includeUnapproved
      ? seedProducts
      : seedProducts.filter((product) =>
          isStorefrontProduct({ status: product.status ?? "approved" })
        );
  }

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
  if (shouldUseSeedFirestoreFallback()) {
    onData(
      options?.includeUnapproved
        ? seedProducts
        : seedProducts.filter((product) =>
            isStorefrontProduct({ status: product.status ?? "approved" })
          )
    );
    return () => {};
  }

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
    (error) => {
      if (shouldUseSeedFirestoreFallback()) {
        onData(seedProducts);
        return;
      }
      onError?.(error);
    }
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
  if (product.imageUrls !== undefined) {
    payload.imageUrls = product.imageUrls;
    if (product.imageUrls.length > 0) {
      payload.imageUrl = product.imageUrls[0];
    }
  } else if (product.image !== undefined) {
    payload.imageUrl = product.image;
    payload.imageUrls = product.image ? [product.image] : [];
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

export async function fetchOrderById(
  orderId: string,
  options?: { userId?: string; isAdmin?: boolean }
): Promise<FurniOrder | null> {
  const { db } = getFirebase();
  const snapshot = await getDoc(doc(db, ORDERS_COLLECTION, orderId));
  if (!snapshot.exists()) return null;

  const data = snapshot.data() as Record<string, unknown>;
  if (options?.userId && !options.isAdmin && data.userId !== options.userId) {
    return null;
  }

  return mapFirestoreOrder(snapshot.id, data, { includeLineItems: true });
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
    paymentStatus: input.paystackReference ? "paid" : buildPaymentStatus(paymentMethod),
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

export async function markOrderPaidByPaystackReference(reference: string): Promise<number> {
  const { db } = getFirebase();
  const ordersQuery = query(
    collection(db, ORDERS_COLLECTION),
    where("paystackReference", "==", reference)
  );
  const snapshot = await getDocs(ordersQuery);

  await Promise.all(
    snapshot.docs.map((entry) =>
      updateDoc(entry.ref, {
        paymentStatus: "paid",
        updatedAt: serverTimestamp()
      })
    )
  );

  return snapshot.size;
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
