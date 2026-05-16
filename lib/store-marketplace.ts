import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { parseFirestoreDate } from "@/lib/store-mappers";
import type {
  CovmercAddress,
  CovmercBusiness,
  CovmercChatMessage,
  CovmercConversation,
} from "@/lib/marketplace-types";
import type { FurniOrder, FurniProduct } from "@/lib/furni-types";
import { mapFirestoreOrder, mapFirestoreProduct } from "@/lib/store-mappers";

const BUSINESSES_COLLECTION = "businesses";
const ADDRESSES_COLLECTION = "addresses";
const CONVERSATIONS_COLLECTION = "conversations";
const MESSAGES_COLLECTION = "messages";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function formatDate(value: unknown): string {
  const date = parseFirestoreDate(value);
  if (!date) return "";
  return date.toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function mapBusiness(
  id: string,
  data: Record<string, unknown>,
): CovmercBusiness {
  return {
    id,
    userId: asString(data.userId),
    businessName: asString(data.businessName),
    businessEmail: asString(data.businessEmail),
    businessPhone: asString(data.businessPhone),
    businessAddress: asString(data.businessAddress),
    businessDescription: asString(data.businessDescription),
    status: asString(data.status, "pending"),
  };
}

export function mapAddress(
  id: string,
  data: Record<string, unknown>,
): CovmercAddress {
  return {
    id,
    userId: asString(data.userId),
    fullName: asString(data.fullName),
    phoneNumber: asString(data.phoneNumber),
    addressLine1: asString(data.addressLine1),
    addressLine2: asString(data.addressLine2) || undefined,
    city: asString(data.city),
    state: asString(data.state) || undefined,
    postalCode: asString(data.postalCode),
    country: asString(data.country, "Nigeria"),
    landmark: asString(data.landmark) || undefined,
    addressType: asString(data.addressType, "home"),
    isDefault: data.isDefault === true,
  };
}

function mapConversation(
  id: string,
  data: Record<string, unknown>,
): CovmercConversation {
  return {
    id,
    customerId: asString(data.customerId),
    customerName: asString(data.customerName),
    customerEmail: asString(data.customerEmail),
    status: asString(data.status, "pending"),
    subject: asString(data.subject) || undefined,
    lastMessage: asString(data.lastMessage) || undefined,
    lastMessageAt: formatDate(data.lastMessageAt ?? data.updatedAt),
    unreadCount: typeof data.unreadCount === "number" ? data.unreadCount : 0,
  };
}

function mapMessage(
  id: string,
  data: Record<string, unknown>,
): CovmercChatMessage {
  return {
    id,
    conversationId: asString(data.conversationId),
    senderId: asString(data.senderId),
    senderName: asString(data.senderName),
    senderRole: asString(data.senderRole, "customer"),
    content: asString(data.content),
    timestamp: formatDate(data.timestamp),
    isRead: data.isRead === true,
  };
}

export async function fetchBusinessByUserId(
  userId: string,
): Promise<CovmercBusiness | null> {
  const { db } = getFirebase();
  const snapshot = await getDocs(
    query(collection(db, BUSINESSES_COLLECTION), where("userId", "==", userId)),
  );
  const docSnap = snapshot.docs[0];
  if (!docSnap) return null;
  return mapBusiness(docSnap.id, docSnap.data() as Record<string, unknown>);
}

export async function fetchVendorProducts(
  vendorId: string,
): Promise<FurniProduct[]> {
  const { db } = getFirebase();
  const snapshot = await getDocs(
    query(collection(db, "products"), where("userId", "==", vendorId)),
  );
  return snapshot.docs
    .map((entry) =>
      mapFirestoreProduct(entry.id, entry.data() as Record<string, unknown>),
    )
    .filter((entry): entry is FurniProduct => Boolean(entry));
}

export async function fetchVendorOrders(
  vendorId: string,
): Promise<FurniOrder[]> {
  const { db } = getFirebase();
  try {
    const snapshot = await getDocs(
      query(
        collection(db, "orders"),
        where("vendorIds", "array-contains", vendorId),
      ),
    );
    return snapshot.docs.map((entry) =>
      mapFirestoreOrder(entry.id, entry.data() as Record<string, unknown>),
    );
  } catch {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.docs
      .filter((entry) => {
        const data = entry.data() as Record<string, unknown>;
        const vendorIds = Array.isArray(data.vendorIds) ? data.vendorIds : [];
        return vendorIds.includes(vendorId);
      })
      .map((entry) =>
        mapFirestoreOrder(entry.id, entry.data() as Record<string, unknown>),
      );
  }
}

export function subscribeToUserAddresses(
  userId: string,
  onData: (addresses: CovmercAddress[]) => void,
): Unsubscribe {
  const { db } = getFirebase();
  return onSnapshot(
    query(collection(db, ADDRESSES_COLLECTION), where("userId", "==", userId)),
    (snapshot) => {
      const addresses = snapshot.docs
        .map((entry) =>
          mapAddress(entry.id, entry.data() as Record<string, unknown>),
        )
        .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
      onData(addresses);
    },
  );
}

export async function saveUserAddress(
  userId: string,
  input: Omit<CovmercAddress, "id" | "userId">,
  addressId?: string,
): Promise<string> {
  const { db } = getFirebase();

  if (input.isDefault) {
    const existing = await getDocs(
      query(
        collection(db, ADDRESSES_COLLECTION),
        where("userId", "==", userId),
      ),
    );
    await Promise.all(
      existing.docs.map((entry) =>
        updateDoc(entry.ref, {
          isDefault: false,
          updatedAt: serverTimestamp(),
        }),
      ),
    );
  }

  const payload = {
    userId,
    fullName: input.fullName,
    phoneNumber: input.phoneNumber,
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2 ?? "",
    city: input.city,
    state: input.state ?? input.city,
    postalCode: input.postalCode,
    country: input.country,
    landmark: input.landmark ?? "",
    addressType: input.addressType ?? "home",
    isDefault: input.isDefault,
    updatedAt: serverTimestamp(),
  };

  if (addressId) {
    await updateDoc(doc(db, ADDRESSES_COLLECTION, addressId), payload);
    return addressId;
  }

  const ref = await addDoc(collection(db, ADDRESSES_COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteUserAddress(addressId: string): Promise<void> {
  const { db } = getFirebase();
  await deleteDoc(doc(db, ADDRESSES_COLLECTION, addressId));
}

export function subscribeToCustomerConversations(
  customerId: string,
  onData: (conversations: CovmercConversation[]) => void,
): Unsubscribe {
  const { db } = getFirebase();
  return onSnapshot(
    query(
      collection(db, CONVERSATIONS_COLLECTION),
      where("customerId", "==", customerId),
    ),
    (snapshot) => {
      const conversations = snapshot.docs
        .map((entry) =>
          mapConversation(entry.id, entry.data() as Record<string, unknown>),
        )
        .sort((a, b) =>
          (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""),
        );
      onData(conversations);
    },
  );
}

export function subscribeToMessages(
  conversationId: string,
  onData: (messages: CovmercChatMessage[]) => void,
): Unsubscribe {
  const { db } = getFirebase();
  return onSnapshot(
    query(
      collection(db, MESSAGES_COLLECTION),
      where("conversationId", "==", conversationId),
    ),
    (snapshot) => {
      const messages = snapshot.docs
        .map((entry) =>
          mapMessage(entry.id, entry.data() as Record<string, unknown>),
        )
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
      onData(messages);
    },
  );
}

export async function createSupportConversation(input: {
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  initialMessage: string;
}): Promise<string> {
  const { db } = getFirebase();
  const now = serverTimestamp();

  const conversationRef = await addDoc(
    collection(db, CONVERSATIONS_COLLECTION),
    {
      customerId: input.customerId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      status: "pending",
      subject: input.subject,
      lastMessage: input.initialMessage,
      lastMessageAt: now,
      lastMessageSender: input.customerName,
      unreadCount: 0,
      createdAt: now,
      updatedAt: now,
    },
  );

  await addDoc(collection(db, MESSAGES_COLLECTION), {
    conversationId: conversationRef.id,
    senderId: input.customerId,
    senderName: input.customerName,
    senderEmail: input.customerEmail,
    senderRole: "customer",
    content: input.initialMessage,
    type: "text",
    timestamp: now,
    isRead: false,
  });

  return conversationRef.id;
}

export async function sendChatMessage(input: {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  content: string;
}): Promise<void> {
  const { db } = getFirebase();
  const now = serverTimestamp();

  await addDoc(collection(db, MESSAGES_COLLECTION), {
    conversationId: input.conversationId,
    senderId: input.senderId,
    senderName: input.senderName,
    senderEmail: input.senderEmail,
    senderRole: input.senderRole,
    content: input.content.trim(),
    type: "text",
    timestamp: now,
    isRead: false,
  });

  await updateDoc(doc(db, CONVERSATIONS_COLLECTION, input.conversationId), {
    lastMessage: input.content.trim(),
    lastMessageAt: now,
    lastMessageSender: input.senderName,
    updatedAt: now,
  });
}
