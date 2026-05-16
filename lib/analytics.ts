"use client";

import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";
import { getFirebase, firebaseConfig } from "@/lib/firebase";

let analyticsInstance: Analytics | null = null;
let initPromise: Promise<Analytics | null> | null = null;

async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;
  if (!firebaseConfig.measurementId) return null;
  if (analyticsInstance) return analyticsInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const supported = await isSupported();
      if (!supported) return null;
      const { app } = getFirebase();
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    } catch {
      return null;
    }
  })();

  return initPromise;
}

export async function initAnalytics(): Promise<void> {
  await getAnalyticsInstance();
}

export async function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): Promise<void> {
  const analytics = await getAnalyticsInstance();
  if (!analytics) return;
  logEvent(analytics, eventName, params);
}

export function trackViewItem(product: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) {
  void trackEvent("view_item", {
    currency: "NGN",
    value: product.price,
    item_id: product.id,
    item_name: product.name,
    item_category: product.category ?? "furniture"
  });
}

export function trackAddToCart(product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) {
  void trackEvent("add_to_cart", {
    currency: "NGN",
    value: product.price * product.quantity,
    item_id: product.id,
    item_name: product.name,
    quantity: product.quantity
  });
}

export function trackPurchase(input: {
  orderId: string;
  value: number;
  paymentMethod: string;
}) {
  void trackEvent("purchase", {
    transaction_id: input.orderId,
    currency: "NGN",
    value: input.value,
    payment_type: input.paymentMethod
  });
}
