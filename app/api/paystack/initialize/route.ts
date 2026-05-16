import { NextResponse } from "next/server";
import {
  isPaystackConfigured,
  paystackSecretKey,
  toPaystackKobo,
  type PaystackInitializeResponse
} from "@/lib/paystack";

export async function POST(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json(
      { error: "Paystack is not configured. Set PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY." },
      { status: 503 }
    );
  }

  const body = (await request.json()) as {
    email?: string;
    amountNgn?: number;
    reference?: string;
    metadata?: Record<string, unknown>;
  };

  if (!body.email || !body.amountNgn || body.amountNgn <= 0) {
    return NextResponse.json({ error: "email and amountNgn are required." }, { status: 400 });
  }

  const reference = body.reference ?? `covmerc_${Date.now()}`;
  const callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL ??
    `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/checkout?paystack=verify`;

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paystackSecretKey()}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: body.email,
      amount: toPaystackKobo(body.amountNgn),
      reference,
      callback_url: callbackUrl,
      currency: "NGN",
      metadata: body.metadata ?? {}
    })
  });

  const payload = (await response.json()) as PaystackInitializeResponse;

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    return NextResponse.json(
      { error: payload.message ?? "Unable to initialize Paystack payment." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorizationUrl: payload.data.authorization_url,
    reference: payload.data.reference,
    accessCode: payload.data.access_code
  });
}
