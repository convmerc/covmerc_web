import { NextResponse } from "next/server";
import { isPaystackConfigured, paystackSecretKey, type PaystackVerifyResponse } from "@/lib/paystack";

export async function GET(request: Request) {
  if (!isPaystackConfigured()) {
    return NextResponse.json({ error: "Paystack is not configured." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json({ error: "reference is required." }, { status: 400 });
  }

  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${paystackSecretKey()}`
      }
    }
  );

  const payload = (await response.json()) as PaystackVerifyResponse;

  if (!response.ok || !payload.status) {
    return NextResponse.json(
      { error: payload.message ?? "Unable to verify payment." },
      { status: 502 }
    );
  }

  const paid = payload.data?.status === "success";

  return NextResponse.json({
    paid,
    reference: payload.data?.reference ?? reference,
    amountNgn: payload.data?.amount ? payload.data.amount / 100 : 0,
    currency: payload.data?.currency ?? "NGN"
  });
}
