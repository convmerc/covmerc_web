import { formatNgn } from "@/lib/format-currency";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

type OrderConfirmationInput = {
  to: string;
  customerName: string;
  orderId: string;
  totalAmount: number;
  paymentMethod: string;
  isGuest?: boolean;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendOrderConfirmationEmail(
  input: OrderConfirmationInput
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, error: "RESEND_API_KEY is not configured." };
  }

  const from = process.env.ORDER_EMAIL_FROM?.trim() ?? "Covmerc <orders@covmerc.com>";
  const total = formatNgn(input.totalAmount);
  const guestNote = input.isGuest
    ? "<p style=\"color:#666;font-size:14px\">You checked out as a guest. Sign up with this email to track future orders.</p>"
    : "<p style=\"color:#666;font-size:14px\">View your order history in your Covmerc account.</p>";

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
      <h1 style="color:#2d4a3e;font-size:22px">Thank you for your order</h1>
      <p>Hi ${escapeHtml(input.customerName)},</p>
      <p>We received your Covmerc order <strong>${escapeHtml(input.orderId)}</strong>.</p>
      <p><strong>Total:</strong> ${total}<br/><strong>Payment:</strong> ${escapeHtml(input.paymentMethod)}</p>
      ${guestNote}
      <p style="margin-top:24px;font-size:14px;color:#666">Questions? Contact our support team.</p>
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: `Order confirmed — ${input.orderId}`,
      html
    })
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    return { sent: false, error: body.message ?? `Resend error (${response.status})` };
  }

  return { sent: true };
}

export async function sendInternalOrderAlert(input: OrderConfirmationInput): Promise<void> {
  const notifyTo = process.env.ORDER_NOTIFICATIONS_TO?.trim();
  if (!notifyTo || !isEmailConfigured()) return;

  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.ORDER_EMAIL_FROM?.trim() ?? "Covmerc <orders@covmerc.com>";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [notifyTo],
      subject: `New web order — ${input.orderId}`,
      html: `<p>New order from ${escapeHtml(input.customerName)} (${escapeHtml(input.to)}) — ${formatNgn(input.totalAmount)} via ${escapeHtml(input.paymentMethod)}.</p>`
    })
  });
}
