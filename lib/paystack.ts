export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    customer?: { email?: string };
  };
};

export function paystackSecretKey(): string | undefined {
  return process.env.PAYSTACK_SECRET_KEY;
}

export function paystackPublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
}

export function isPaystackConfigured(): boolean {
  return Boolean(paystackSecretKey() && paystackPublicKey());
}

/** Paystack expects amount in kobo (NGN × 100). */
export function toPaystackKobo(amountNgn: number): number {
  return Math.round(amountNgn * 100);
}
