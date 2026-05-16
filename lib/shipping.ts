/** Flat delivery fee for web checkout (NGN). Lagos metro vs other states can be expanded later. */
const LAGOS_METRO_FEE = 5_000;
const DEFAULT_NATIONWIDE_FEE = 8_500;
const FREE_DELIVERY_THRESHOLD = 500_000;

export function calculateDeliveryFee(subtotal: number, city: string): number {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;

  const normalized = city.trim().toLowerCase();
  const isLagos =
    normalized.includes("lagos") ||
    normalized.includes("lekki") ||
    normalized.includes("ikeja") ||
    normalized.includes("vi");

  return isLagos ? LAGOS_METRO_FEE : DEFAULT_NATIONWIDE_FEE;
}

export function orderGrandTotal(subtotal: number, deliveryFee: number): number {
  return subtotal + deliveryFee;
}
