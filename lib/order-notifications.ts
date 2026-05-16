import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";

const ORDER_NOTIFICATIONS_COLLECTION = "webOrderNotifications";

export async function queueOrderConfirmationEmail(input: {
  orderId: string;
  email: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  isGuest?: boolean;
}): Promise<void> {
  const { db } = getFirebase();

  await addDoc(collection(db, ORDER_NOTIFICATIONS_COLLECTION), {
    type: "order_confirmation",
    orderId: input.orderId,
    to: input.email,
    customerName: input.customerName,
    totalAmount: input.totalAmount,
    paymentMethod: input.paymentMethod,
    isGuest: Boolean(input.isGuest),
    status: "pending",
    source: "web_storefront",
    createdAt: serverTimestamp()
  });
}
