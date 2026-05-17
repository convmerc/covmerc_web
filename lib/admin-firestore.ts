import type { User } from "firebase/auth";
import { getIdTokenResult } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  documentId,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  type DocumentData,
  type QueryConstraint,
  type QueryDocumentSnapshot
} from "firebase/firestore";
import {
  MANAGED_COLLECTIONS,
  MANAGED_COLLECTIONS_BY_ID,
  type JsonValue,
  type ManagedCollectionConfig
} from "@/lib/admin-collections";
import { getFirebase } from "@/lib/firebase";

type AdminAccessResult = {
  isAdmin: boolean;
  source?: "custom-claim" | "admins-collection" | "users-role-field" | "users-type-field";
};

export type CollectionRow = {
  id: string;
  data: Record<string, unknown>;
};

export type CollectionPage = {
  rows: CollectionRow[];
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  hasNextPage: boolean;
};

export type MetricResult = {
  id: string;
  label: string;
  value: number | null;
  status: "ok" | "error";
};

function isPrimitive(value: unknown): value is JsonValue {
  if (value === null) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every((item) => isPrimitive(item) && !Array.isArray(item));
  }

  const type = typeof value;
  return type === "string" || type === "number" || type === "boolean";
}

function sanitizeWritePayload(
  payload: Record<string, unknown>,
  config: ManagedCollectionConfig
) {
  const sanitized: Record<string, JsonValue> = {};

  for (const field of config.editableFields) {
    const candidate = payload[field];
    if (candidate !== undefined && isPrimitive(candidate)) {
      sanitized[field] = candidate;
    }
  }

  return sanitized;
}

function isClaimAdmin(claims: Record<string, unknown>) {
  if (claims.admin === true) {
    return true;
  }

  if (claims.role === "admin") {
    return true;
  }

  if (Array.isArray(claims.roles)) {
    return claims.roles.includes("admin");
  }

  return false;
}

export async function checkAdminAccess(user: User): Promise<AdminAccessResult> {
  const { db } = getFirebase();
  const idTokenResult = await getIdTokenResult(user);

  if (isClaimAdmin(idTokenResult.claims)) {
    return { isAdmin: true, source: "custom-claim" };
  }

  const adminDoc = await getDoc(doc(db, "admins", user.uid));
  if (adminDoc.exists()) {
    return { isAdmin: true, source: "admins-collection" };
  }

  const userDoc = await getDoc(doc(db, "users", user.uid));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    if (userData.isAdmin === true || userData.userType === "admin") {
      return { isAdmin: true, source: "users-type-field" };
    }
    const role = userData.role;
    const roles = userData.roles;
    if (role === "admin" || (Array.isArray(roles) && roles.includes("admin"))) {
      return { isAdmin: true, source: "users-role-field" };
    }
  }

  return { isAdmin: false };
}

export async function fetchAdminMetrics(): Promise<MetricResult[]> {
  const { db } = getFirebase();
  const metricTargets = MANAGED_COLLECTIONS.slice(0, 3);

  const results = await Promise.all(
    metricTargets.map(async (target) => {
      try {
        const snapshot = await getCountFromServer(
          collection(db, target.collectionPath)
        );

        return {
          id: target.id,
          label: `Total ${target.label.toLowerCase()}`,
          value: snapshot.data().count,
          status: "ok" as const
        };
      } catch {
        return {
          id: target.id,
          label: `Total ${target.label.toLowerCase()}`,
          value: null,
          status: "error" as const
        };
      }
    })
  );

  return results;
}

export async function readCollectionPage(
  collectionPath: string,
  pageSize: number,
  cursor: QueryDocumentSnapshot<DocumentData> | null
): Promise<CollectionPage> {
  const { db } = getFirebase();
  const collectionRef = collection(db, collectionPath);
  const constraints: QueryConstraint[] = [orderBy(documentId()), limit(pageSize + 1)];
  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  const pageQuery = query(collectionRef, ...constraints);
  const snapshot = await getDocs(pageQuery);
  const docs = snapshot.docs;
  const hasNextPage = docs.length > pageSize;
  const currentPageDocs = hasNextPage ? docs.slice(0, pageSize) : docs;
  const lastDoc =
    currentPageDocs.length > 0 ? currentPageDocs[currentPageDocs.length - 1] : null;

  return {
    rows: currentPageDocs.map((entry) => ({
      id: entry.id,
      data: entry.data()
    })),
    lastDoc,
    hasNextPage
  };
}

function getManagedCollection(collectionId: string) {
  const collectionConfig = MANAGED_COLLECTIONS_BY_ID[collectionId];

  if (!collectionConfig) {
    throw new Error(`Unknown collection id: ${collectionId}`);
  }

  return collectionConfig;
}

export async function safeCreateDocument(
  collectionId: string,
  payload: Record<string, unknown>,
  adminUid: string
) {
  const { db } = getFirebase();
  const collectionConfig = getManagedCollection(collectionId);

  if (collectionConfig.readOnly) {
    throw new Error(`${collectionConfig.label} is configured as read-only.`);
  }

  const safePayload = sanitizeWritePayload(payload, collectionConfig);
  if (Object.keys(safePayload).length === 0) {
    throw new Error("No allowed writable fields found in payload.");
  }

  await addDoc(collection(db, collectionConfig.collectionPath), {
    ...safePayload,
    createdByAdminUid: adminUid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function safeUpdateDocument(
  collectionId: string,
  documentIdValue: string,
  payload: Record<string, unknown>,
  adminUid: string
) {
  const { db } = getFirebase();
  const collectionConfig = getManagedCollection(collectionId);

  if (collectionConfig.readOnly) {
    throw new Error(`${collectionConfig.label} is configured as read-only.`);
  }

  const safePayload = sanitizeWritePayload(payload, collectionConfig);
  if (Object.keys(safePayload).length === 0) {
    throw new Error("No allowed writable fields found in payload.");
  }

  await updateDoc(doc(db, collectionConfig.collectionPath, documentIdValue), {
    ...safePayload,
    updatedAt: serverTimestamp(),
    updatedByAdminUid: adminUid
  });
}

/**
 * We archive records instead of hard-deleting to prevent accidental schema/data loss
 * across clients that still expect existing documents.
 */
export async function safeArchiveDocument(
  collectionId: string,
  documentIdValue: string,
  adminUid: string
) {
  const { db } = getFirebase();
  const collectionConfig = getManagedCollection(collectionId);

  if (collectionConfig.readOnly) {
    throw new Error(`${collectionConfig.label} is configured as read-only.`);
  }

  await updateDoc(doc(db, collectionConfig.collectionPath, documentIdValue), {
    isArchived: true,
    archivedAt: serverTimestamp(),
    archivedByAdminUid: adminUid,
    updatedAt: serverTimestamp()
  });
}
