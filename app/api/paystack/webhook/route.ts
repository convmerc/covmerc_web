import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { paystackSecretKey } from "@/lib/paystack";
import { markOrderPaidByPaystackReference } from "@/lib/store-firestore";

type PaystackWebhookEvent = {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    customer?: { email?: string };
  };
};

function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  const secret = paystackSecretKey();
  if (!secret || !signature) return false;

  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export async function POST(request: Request) {
  const secret = paystackSecretKey();
  if (!secret) {
    return NextResponse.json({ error: "Paystack not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let payload: PaystackWebhookEvent;
  try {
    payload = JSON.parse(rawBody) as PaystackWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (payload.event === "charge.success" && payload.data?.reference) {
    try {
      await markOrderPaidByPaystackReference(payload.data.reference);
    } catch (error) {
      console.error("Paystack webhook order update failed:", error);
    }
  }

  return NextResponse.json({ received: true });
}
