import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AuthUser } from "@/lib/auth-types";
import { checkAdminAccess } from "@/lib/admin-firestore";
import { withTimeout } from "@/lib/async-timeout";
import { getFirebase } from "@/lib/firebase";
import { mapUserProfile } from "@/lib/store-mappers";
import { isAdminProfile, isVendorProfile, normalizeUserType } from "@/lib/user-role";

const PROFILE_TIMEOUT_MS = 8_000;
const ADMIN_CHECK_TIMEOUT_MS = 5_000;

export function fallbackAuthUser(firebaseUser: User): AuthUser {
  return {
    id: firebaseUser.uid,
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Covmerc User",
    email: firebaseUser.email ?? "",
    userType: "customer"
  };
}

export async function resolveAuthUser(firebaseUser: User): Promise<AuthUser> {
  const { db } = getFirebase();
  const userSnap = await withTimeout(
    getDoc(doc(db, "users", firebaseUser.uid)),
    PROFILE_TIMEOUT_MS,
    null
  );

  const profile = mapUserProfile(
    userSnap?.data() as Record<string, unknown> | undefined
  );

  let isAdmin = isAdminProfile(profile);

  if (!isAdmin) {
    const adminAccess = await withTimeout(
      checkAdminAccess(firebaseUser),
      ADMIN_CHECK_TIMEOUT_MS,
      { isAdmin: false as const }
    );
    isAdmin = adminAccess.isAdmin;
  }

  const isVendor = !isAdmin && isVendorProfile(profile);

  return {
    id: firebaseUser.uid,
    name:
      profile?.name ||
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Covmerc User",
    email: firebaseUser.email ?? profile?.email ?? "",
    userType: normalizeUserType(profile?.userType, isAdmin),
    vendorStatus: profile?.vendorStatus ?? null
  };
}

/** Resolves profile with timeouts; never rejects — uses Firebase basics on failure. */
export async function resolveAuthUserSafe(firebaseUser: User): Promise<AuthUser> {
  try {
    return await resolveAuthUser(firebaseUser);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Covmerc] resolveAuthUser failed, using fallback session:", error);
    }
    return fallbackAuthUser(firebaseUser);
  }
}

export async function ensureUserDocument(
  firebaseUser: User,
  options?: { name?: string }
) {
  const { db } = getFirebase();
  const userRef = doc(db, "users", firebaseUser.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    return;
  }

  const name =
    options?.name?.trim() ||
    firebaseUser.displayName ||
    firebaseUser.email?.split("@")[0] ||
    "Covmerc User";

  await setDoc(userRef, {
    uid: firebaseUser.uid,
    name,
    email: firebaseUser.email ?? "",
    userType: "customer",
    emailVerified: firebaseUser.emailVerified,
    phoneVerified: false,
    isAdmin: false,
    vendorStatus: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}
