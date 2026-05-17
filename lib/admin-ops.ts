import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type QueryConstraint
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";
import { shouldUseSeedFirestoreFallback } from "@/lib/firestore-fallback";
import type { AdminAnnouncement, AdminSupportTicket } from "@/lib/admin-types";
import { mapBusiness } from "@/lib/store-marketplace";
import type { CovmercBusiness, CovmercConversation } from "@/lib/marketplace-types";
import { parseFirestoreDate } from "@/lib/store-mappers";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function formatTimestamp(value: unknown): string {
  const date = parseFirestoreDate(value);
  if (!date) return "";
  return date.toLocaleString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function mapSupportTicket(id: string, data: Record<string, unknown>): AdminSupportTicket {
  return {
    id,
    status: asString(data.status, "open"),
    priority: asString(data.priority, "normal"),
    subject: asString(data.subject) || asString(data.title) || "Support request",
    message:
      asString(data.message) ||
      asString(data.body) ||
      asString(data.description) ||
      asString(data.details),
    userId: asString(data.userId) || asString(data.customerId),
    userEmail: asString(data.userEmail) || asString(data.email) || asString(data.customerEmail),
    userName:
      asString(data.userName) || asString(data.customerName) || asString(data.name),
    assignedAdminId: asString(data.assignedAdminId),
    adminNote: asString(data.adminNote) || asString(data.adminNotes),
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
    isArchived: data.isArchived === true
  };
}

function mapAnnouncement(id: string, data: Record<string, unknown>): AdminAnnouncement {
  return {
    id,
    title: asString(data.title),
    body: asString(data.body) || asString(data.message) || asString(data.content),
    status: asString(data.status, "draft"),
    audience: asString(data.audience, "all"),
    createdAt: formatTimestamp(data.createdAt),
    updatedAt: formatTimestamp(data.updatedAt),
    isArchived: data.isArchived === true
  };
}

function mapAdminConversation(id: string, data: Record<string, unknown>): CovmercConversation {
  return {
    id,
    customerId: asString(data.customerId),
    customerName: asString(data.customerName),
    customerEmail: asString(data.customerEmail),
    status: asString(data.status, "pending"),
    subject: asString(data.subject) || undefined,
    lastMessage: asString(data.lastMessage) || undefined,
    lastMessageAt: formatTimestamp(data.lastMessageAt ?? data.updatedAt),
    unreadCount: typeof data.unreadCount === "number" ? data.unreadCount : 0
  };
}

async function fetchCollectionDocs<T>(
  collectionPath: string,
  mapper: (id: string, data: Record<string, unknown>) => T,
  sort?: (a: T, b: T) => number
): Promise<T[]> {
  if (shouldUseSeedFirestoreFallback()) {
    return [];
  }

  const { db } = getFirebase();
  const constraints: QueryConstraint[] = [];

  try {
    constraints.push(orderBy("updatedAt", "desc"));
  } catch {
    // collection may lack index; fall back to unordered read
  }

  let snapshot;
  try {
    snapshot = await getDocs(
      constraints.length > 0
        ? query(collection(db, collectionPath), ...constraints)
        : query(collection(db, collectionPath))
    );
  } catch {
    snapshot = await getDocs(query(collection(db, collectionPath)));
  }

  const rows = snapshot.docs
    .map((entry) => mapper(entry.id, entry.data() as Record<string, unknown>))
    .filter((row) => {
      const archived = (row as { isArchived?: boolean }).isArchived;
      return !archived;
    });

  if (sort) {
    rows.sort(sort);
  }

  return rows;
}

export async function fetchSupportTickets(): Promise<AdminSupportTicket[]> {
  const rows = await fetchCollectionDocs("supportTickets", mapSupportTicket);
  return rows.sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
}

export async function fetchAnnouncements(): Promise<AdminAnnouncement[]> {
  const rows = await fetchCollectionDocs("announcements", mapAnnouncement);
  return rows.sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
}

export async function fetchAllBusinesses(): Promise<CovmercBusiness[]> {
  if (shouldUseSeedFirestoreFallback()) {
    return [];
  }

  const { db } = getFirebase();
  const snapshot = await getDocs(collection(db, "businesses"));
  return snapshot.docs
    .map((entry) => mapBusiness(entry.id, entry.data() as Record<string, unknown>))
    .sort((a, b) => a.businessName.localeCompare(b.businessName));
}

export async function fetchAdminConversations(): Promise<CovmercConversation[]> {
  const rows = await fetchCollectionDocs("conversations", mapAdminConversation);
  return rows.sort((a, b) => (b.lastMessageAt ?? "").localeCompare(a.lastMessageAt ?? ""));
}

export async function setVendorApproval(input: {
  businessId: string;
  userId: string;
  status: "approved" | "rejected" | "pending" | "suspended";
  adminUid: string;
}): Promise<void> {
  if (shouldUseSeedFirestoreFallback()) {
    return;
  }

  const { db } = getFirebase();
  const now = serverTimestamp();

  await updateDoc(doc(db, "businesses", input.businessId), {
    status: input.status,
    reviewedAt: now,
    reviewedByAdminUid: input.adminUid,
    updatedAt: now
  });

  const userPatch: Record<string, unknown> = {
    vendorStatus: input.status === "approved" ? "approved" : input.status,
    updatedAt: now
  };

  if (input.status === "approved") {
    userPatch.userType = "vendor";
  }

  await updateDoc(doc(db, "users", input.userId), userPatch);
}

export async function updateConversationStatus(
  conversationId: string,
  status: string
): Promise<void> {
  if (shouldUseSeedFirestoreFallback()) {
    return;
  }

  const { db } = getFirebase();
  await updateDoc(doc(db, "conversations", conversationId), {
    status,
    updatedAt: serverTimestamp()
  });
}
