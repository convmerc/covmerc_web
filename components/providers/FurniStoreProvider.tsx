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
import {
  buildOrderLineItems,
  createBlogPostInFirestore,
  createOrderInFirestore,
  createProductInFirestore,
  deleteProductFromFirestore,
  fetchAllOrders,
  fetchOrdersForUser,
  subscribeToBlogPosts,
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
import { trackAddToCart, trackPurchase } from "@/lib/analytics";
import {
  addProductToWishlist,
  removeProductFromWishlist,
  subscribeToWishlistProductIds
} from "@/lib/wishlist-firestore";

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
  wishlistProductIds: string[];
  wishlistLoading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<void>;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Omit<FurniProduct, "id">) => Promise<void>;
  updateProduct: (id: string, product: Partial<FurniProduct>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBlogPost: (
    post: Pick<FurniBlogPost, "title" | "excerpt" | "content" | "category" | "coverImage"> & {
      slug?: string;
      status?: FurniBlogPost["status"];
    }
  ) => Promise<void>;
  updateOrderStatus: (orderId: string, status: FurniOrderStatus) => Promise<void>;
  createOrder: (
    shipping: CheckoutShipping,
    paymentMethod: string,
    options?: { paystackReference?: string }
  ) => Promise<string>;
  refreshOrders: () => Promise<void>;
};

const FurniStoreContext = createContext<FurniStoreContextValue | null>(null);

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
  const [blogPosts, setBlogPosts] = useState<FurniBlogPost[]>([]);
  const [orders, setOrders] = useState<FurniOrder[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [cartHydrated, setCartHydrated] = useState(false);
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) {
      setWishlistProductIds([]);
      setWishlistLoading(false);
      return;
    }

    setWishlistLoading(true);
    const unsubscribe = subscribeToWishlistProductIds(
      currentUser.id,
      (ids) => {
        setWishlistProductIds(ids);
        setWishlistLoading(false);
      },
      () => setWishlistLoading(false)
    );

    return unsubscribe;
  }, [currentUser?.id]);

  useEffect(() => {
    const includeDrafts = currentUser?.userType === "admin";
    const unsubscribe = subscribeToBlogPosts(
      setBlogPosts,
      (error) => setStoreError(error.message),
      { includeDrafts }
    );
    return unsubscribe;
  }, [currentUser?.userType]);

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

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const product = products.find((entry) => entry.id === productId);
      if (product) {
        trackAddToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        });
      }

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
    },
    [products]
  );

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

  const isInWishlist = useCallback(
    (productId: string) => wishlistProductIds.includes(productId),
    [wishlistProductIds]
  );

  const toggleWishlist = useCallback(
    async (productId: string) => {
      if (!currentUser?.id) {
        throw new Error("Sign in to save items to your wishlist.");
      }

      if (wishlistProductIds.includes(productId)) {
        await removeProductFromWishlist(currentUser.id, productId);
      } else {
        await addProductToWishlist(currentUser.id, productId);
      }
    },
    [currentUser?.id, wishlistProductIds]
  );

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
    async (
      post: Pick<
        FurniBlogPost,
        "title" | "excerpt" | "content" | "category" | "coverImage"
      > & {
        slug?: string;
        status?: FurniBlogPost["status"];
      }
    ) => {
      await createBlogPostInFirestore({
        ...post,
        author: "Covmerc Admin"
      });
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

      trackPurchase({
        orderId,
        value: totalAmount,
        paymentMethod,
      });

      await queueOrderConfirmationEmail({
        orderId,
        email: shipping.email,
        customerName: shipping.fullName,
        totalAmount,
        paymentMethod,
        isGuest
      });

      try {
        await fetch("/api/orders/confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            email: shipping.email,
            customerName: shipping.fullName,
            totalAmount,
            paymentMethod,
            isGuest
          })
        });
      } catch {
        // Firestore queue remains the fallback when email API is unavailable.
      }

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
      wishlistProductIds,
      wishlistLoading,
      isInWishlist,
      toggleWishlist,
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
      wishlistProductIds,
      wishlistLoading,
      isInWishlist,
      toggleWishlist,
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
