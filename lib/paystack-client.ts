/** Client-safe Paystack helpers (public key only). */
export function isPaystackEnabledClient(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim());
}
