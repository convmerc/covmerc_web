"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { initialBlogPosts } from "@/lib/furni-data";
import {
  buildOrderLineItems,
  createOrderInFirestore,
  createProductInFirestore,
  deleteProductFromFirestore,
  fetchAllOrders,
  fetchOrdersForUser,
  subscribeToProducts,
  updateOrderStatusInFirestore,
  updateProductInFirestore
} from "@/lib/store-firestore";
import { fetchCategoriesFromFirestore, type StoreCategory } from "@/lib/categories";
import { guestUserIdFromEmail } from "@/lib/guest-user";
import { queueOrderConfirmationEmail } from "@/lib/order-notifications";
import { calculateDeliveryFee, orderGrandTotal } from "@/lib/shipping";
import type {
  CartItem,
  CheckoutShipping,
  FurniBlogPost,
  FurniOrder,
  FurniOrderStatus,
  FurniProduct
} from "@/lib/furni-types";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";

type FurniStoreContextValue = {
  products: FurniProduct[];
  categories: StoreCategory[];
  blogPosts: FurniBlogPost[];
  orders: FurniOrder[];
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  estimateDeliveryFee: (city: string) => number;
  storeLoading: boolean;
  storeError: string | null;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Omit<FurniProduct, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<FurniProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBlogPost: (
    post: Pick<FurniBlogPost, "title" | "excerpt" | "content" | "category" | "coverImage">
  ) => void;
  updateOrderStatus: (orderId: string, status: FurniOrderStatus) => Promise<void>;
  createOrder: (
    shipping: CheckoutShipping,
    paymentMethod: string,
    options?: { paystackReference?: string }
  ) => Promise<string>;
  refreshOrders: () => Promise<void>;
};

const FurniStoreContext = createContext<FurniStoreContextValue | null>(null);

const blogStorageKey = "furni-blog-posts";

function cartStorageKey(userId: string | null) {
  return userId ? `covmerc-cart-${userId}` : "covmerc-cart-guest";
}

function readCart(key: string): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(key: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

function mergeCartItems(primary: CartItem[], secondary: CartItem[]): CartItem[] {
  const merged = [...primary];

  for (const item of secondary) {
    const existing = merged.find((entry) => entry.productId === item.productId);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      merged.push({ ...item });
    }
  }

  return merged;
}

export function FurniStoreProvider({ children }: { children: ReactNode }) {
  const { currentUser, authLoading } = useAuthSession();
  const [products, setProducts] = useState<FurniProduct[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [blogPosts, setBlogPosts] = useState<FurniBlogPost[]>(initialBlogPosts);
  const [orders, setOrders] = useState<FurniOrder[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [cartHydrated, setCartHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(blogStorageKey);
    if (raw) {
      try {
        setBlogPosts(JSON.parse(raw) as FurniBlogPost[]);
      } catch {
        setBlogPosts(initialBlogPosts);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(blogStorageKey, JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    setStoreLoading(true);
    setStoreError(null);

    const includeUnapproved = currentUser?.userType === "admin";

    const unsubscribe = subscribeToProducts(
      (nextProducts) => {
        setProducts(nextProducts);
        setStoreLoading(false);
      },
      (error) => {
        setStoreError(error.message);
        setStoreLoading(false);
      },
      { includeUnapproved }
    );

    return unsubscribe;
  }, [currentUser?.userType]);

  useEffect(() => {
    void fetchCategoriesFromFirestore(products).then(setCategories);
  }, [products]);

  const refreshOrders = useCallback(async () => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    try {
      const nextOrders =
        currentUser.userType === "admin"
          ? await fetchAllOrders()
          : await fetchOrdersForUser(currentUser.id);
      setOrders(nextOrders);
    } catch (error) {
      setStoreError(
        error instanceof Error ? error.message : "Unable to load orders."
      );
    }
  }, [currentUser]);

  useEffect(() => {
    if (authLoading) return;
    void refreshOrders();
  }, [authLoading, refreshOrders]);

  useEffect(() => {
    if (authLoading) return;

    const userKey = cartStorageKey(currentUser?.id ?? null);
    const guestKey = cartStorageKey(null);
    const guestCart = readCart(guestKey);

    if (currentUser && guestCart.length > 0) {
      const userCart = readCart(userKey);
      const merged = mergeCartItems(userCart, guestCart);
      writeCart(userKey, merged);
      window.localStorage.removeItem(guestKey);
      setCartItems(merged);
    } else {
      setCartItems(readCart(userKey));
    }

    setCartHydrated(true);
  }, [authLoading, currentUser]);

  useEffect(() => {
    if (!cartHydrated || authLoading) return;
    writeCart(cartStorageKey(currentUser?.id ?? null), cartItems);
  }, [cartItems, cartHydrated, authLoading, currentUser?.id]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) return sum;
        return sum + product.price * item.quantity;
      }, 0),
    [cartItems, products]
  );

  const estimateDeliveryFee = useCallback(
    (city: string) => calculateDeliveryFee(cartSubtotal, city),
    [cartSubtotal]
  );

  const addToCart = useCallback((productId: string, quantity = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...current, { productId, quantity }];
    });
  }, []);

  const updateCartItem = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((current) =>
        current.filter((item) => item.productId !== productId)
      );
      return;
    }

    setCartItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeCartItem = useCallback((productId: string) => {
    setCartItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const addProduct = useCallback(async (product: Omit<FurniProduct, "id">) => {
    await createProductInFirestore(product);
  }, []);

  const updateProduct = useCallback(async (id: string, nextValues: Partial<FurniProduct>) => {
    await updateProductInFirestore(id, nextValues);
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await deleteProductFromFirestore(id);
    setCartItems((current) => current.filter((entry) => entry.productId !== id));
  }, []);

  const addBlogPost = useCallback(
    (
      post: Pick<
        FurniBlogPost,
        "title" | "excerpt" | "content" | "category" | "coverImage"
      >
    ) => {
      const nextPost: FurniBlogPost = {
        id: `${post.title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
        ...post,
        publishedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        }),
        author: "Covmerc Admin"
      };

      setBlogPosts((current) => [nextPost, ...current]);
    },
    []
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: FurniOrderStatus) => {
      await updateOrderStatusInFirestore(orderId, status);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order))
      );
    },
    []
  );

  const createOrder = useCallback(
    async (
      shipping: CheckoutShipping,
      paymentMethod: string,
      options?: { paystackReference?: string }
    ) => {
      const lineItems = buildOrderLineItems(cartItems, products);
      if (lineItems.length === 0) {
        throw new Error("Your cart is empty.");
      }

      const isGuest = !currentUser;
      const userId = currentUser?.id ?? guestUserIdFromEmail(shipping.email);
      const deliveryFee = calculateDeliveryFee(cartSubtotal, shipping.city);
      const totalAmount = orderGrandTotal(cartSubtotal, deliveryFee);

      const orderId = await createOrderInFirestore({
        userId,
        userEmail: shipping.email,
        userName: shipping.fullName,
        userPhone: shipping.phone,
        shipping,
        paymentMethod,
        lineItems,
        subtotal: cartSubtotal,
        deliveryFee,
        isGuest,
        paystackReference: options?.paystackReference
      });

      await queueOrderConfirmationEmail({
        orderId,
        email: shipping.email,
        customerName: shipping.fullName,
        totalAmount,
        paymentMethod,
        isGuest
      });

      setCartItems([]);
      if (!isGuest) {
        await refreshOrders();
      }
      return orderId;
    },
    [cartItems, cartSubtotal, currentUser, products, refreshOrders]
  );

  const value = useMemo<FurniStoreContextValue>(
    () => ({
      products,
      categories,
      blogPosts,
      orders,
      cartItems,
      cartCount,
      cartSubtotal,
      estimateDeliveryFee,
      storeLoading,
      storeError,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlogPost,
      updateOrderStatus,
      createOrder,
      refreshOrders
    }),
    [
      products,
      categories,
      blogPosts,
      orders,
      cartItems,
      cartCount,
      cartSubtotal,
      estimateDeliveryFee,
      storeLoading,
      storeError,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlogPost,
      updateOrderStatus,
      createOrder,
      refreshOrders
    ]
  );

  return (
    <FurniStoreContext.Provider value={value}>{children}</FurniStoreContext.Provider>
  );
}

export function useFurniStore() {
  const context = useContext(FurniStoreContext);
  if (!context) {
    throw new Error("useFurniStore must be used inside FurniStoreProvider.");
  }
  return context;
}
