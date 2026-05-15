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
  initialBlogPosts,
  initialOrders,
  initialProducts
} from "@/lib/furni-data";
import type {
  CartItem,
  CheckoutShipping,
  FurniBlogPost,
  FurniOrder,
  FurniOrderStatus,
  FurniProduct
} from "@/lib/furni-types";

type FurniStoreContextValue = {
  products: FurniProduct[];
  blogPosts: FurniBlogPost[];
  orders: FurniOrder[];
  cartItems: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartItem: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  clearCart: () => void;
  addProduct: (product: Omit<FurniProduct, "id">) => void;
  updateProduct: (id: string, product: Partial<FurniProduct>) => void;
  deleteProduct: (id: string) => void;
  addBlogPost: (
    post: Pick<FurniBlogPost, "title" | "excerpt" | "content" | "category" | "coverImage">
  ) => void;
  updateOrderStatus: (orderId: string, status: FurniOrderStatus) => void;
  createOrder: (shipping: CheckoutShipping, paymentMethod: string) => string;
};

const FurniStoreContext = createContext<FurniStoreContextValue | null>(null);

const storageKeys = {
  products: "furni-products",
  blogPosts: "furni-blog-posts",
  orders: "furni-orders",
  cart: "furni-cart"
};

function fromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function FurniStoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<FurniProduct[]>([]);
  const [blogPosts, setBlogPosts] = useState<FurniBlogPost[]>([]);
  const [orders, setOrders] = useState<FurniOrder[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProducts(fromStorage(storageKeys.products, initialProducts));
    setBlogPosts(fromStorage(storageKeys.blogPosts, initialBlogPosts));
    setOrders(fromStorage(storageKeys.orders, initialOrders));
    setCartItems(fromStorage(storageKeys.cart, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKeys.products, JSON.stringify(products));
  }, [products, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKeys.blogPosts, JSON.stringify(blogPosts));
  }, [blogPosts, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKeys.orders, JSON.stringify(orders));
  }, [orders, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKeys.cart, JSON.stringify(cartItems));
  }, [cartItems, hydrated]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product) {
          return sum;
        }
        return sum + product.price * item.quantity;
      }, 0),
    [cartItems, products]
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

  const addProduct = useCallback((product: Omit<FurniProduct, "id">) => {
    const id = `${product.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;
    setProducts((current) => [{ id, ...product }, ...current]);
  }, []);

  const updateProduct = useCallback((id: string, nextValues: Partial<FurniProduct>) => {
    setProducts((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ...nextValues } : entry))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((current) => current.filter((entry) => entry.id !== id));
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
        author: "Furni Admin"
      };

      setBlogPosts((current) => [nextPost, ...current]);
    },
    []
  );

  const updateOrderStatus = useCallback((orderId: string, status: FurniOrderStatus) => {
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  }, []);

  const createOrder = useCallback(
    (shipping: CheckoutShipping, paymentMethod: string) => {
      const nextOrderId = `ORD-${1000 + orders.length + 1}`;
      const nextOrder: FurniOrder = {
        id: nextOrderId,
        customer: shipping.fullName,
        items: cartCount,
        total: cartSubtotal,
        status: "Pending",
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric"
        })
      };

      setOrders((current) => [nextOrder, ...current]);
      setCartItems([]);
      void paymentMethod;
      return nextOrderId;
    },
    [orders.length, cartCount, cartSubtotal]
  );

  const value = useMemo<FurniStoreContextValue>(
    () => ({
      products,
      blogPosts,
      orders,
      cartItems,
      cartCount,
      cartSubtotal,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlogPost,
      updateOrderStatus,
      createOrder
    }),
    [
      products,
      blogPosts,
      orders,
      cartItems,
      cartCount,
      cartSubtotal,
      addToCart,
      updateCartItem,
      removeCartItem,
      clearCart,
      addProduct,
      updateProduct,
      deleteProduct,
      addBlogPost,
      updateOrderStatus,
      createOrder
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
