import { NextResponse } from "next/server";
import {
  isEmailConfigured,
  sendInternalOrderAlert,
  sendOrderConfirmationEmail
} from "@/lib/email";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: string;
    email?: string;
    customerName?: string;
    totalAmount?: number;
    paymentMethod?: string;
    isGuest?: boolean;
  };

  if (!body.orderId || !body.email || !body.customerName || body.totalAmount == null) {
    return NextResponse.json(
      { error: "orderId, email, customerName, and totalAmount are required." },
      { status: 400 }
    );
  }

  if (!isEmailConfigured()) {
    return NextResponse.json({
      sent: false,
      queued: true,
      message: "Email not configured. Order saved; notification queued in Firestore only."
    });
  }

  const input = {
    orderId: body.orderId,
    to: body.email,
    customerName: body.customerName,
    totalAmount: body.totalAmount,
    paymentMethod: body.paymentMethod ?? "unknown",
    isGuest: body.isGuest
  };

  const customerResult = await sendOrderConfirmationEmail(input);

  try {
    await sendInternalOrderAlert(input);
  } catch {
    // Non-blocking for internal alerts.
  }

  if (!customerResult.sent) {
    return NextResponse.json(
      { sent: false, error: customerResult.error ?? "Failed to send email." },
      { status: 502 }
    );
  }

  return NextResponse.json({ sent: true });
}
