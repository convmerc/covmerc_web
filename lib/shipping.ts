/** Flat delivery fee for web checkout (NGN). Ibadan metro vs other destinations. */
const IBADAN_METRO_FEE = 5_000;
const DEFAULT_NATIONWIDE_FEE = 8_500;
const FREE_DELIVERY_THRESHOLD = 500_000;

export function calculateDeliveryFee(subtotal: number, city: string): number {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;

  const normalized = city.trim().toLowerCase();
  const isIbadanMetro =
    normalized.includes("ibadan") ||
    normalized.includes("bodija") ||
    normalized.includes("challenge") ||
    normalized.includes("ring road") ||
    normalized.includes("ui") ||
    normalized === "ib";

  return isIbadanMetro ? IBADAN_METRO_FEE : DEFAULT_NATIONWIDE_FEE;
}

export function orderGrandTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}
