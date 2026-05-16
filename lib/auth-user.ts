import type { User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { AuthUser } from "@/lib/auth-types";
import { checkAdminAccess } from "@/lib/admin-firestore";
import { getFirebase } from "@/lib/firebase";
import { mapUserProfile } from "@/lib/store-mappers";

export async function resolveAuthUser(firebaseUser: User): Promise<AuthUser> {
  const { db } = getFirebase();
  const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
  const profile = mapUserProfile(userSnap.data() as Record<string, unknown> | undefined);
  const adminAccess = await checkAdminAccess(firebaseUser);
  const isAdmin =
    adminAccess.isAdmin || profile?.isAdmin === true || profile?.userType === "admin";
  const isVendor =
    !isAdmin &&
    (profile?.userType === "vendor" ||
      profile?.vendorStatus === "approved" ||
      profile?.vendorStatus === "active");

  return {
    id: firebaseUser.uid,
    name:
      profile?.name ||
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Covmerc User",
    email: firebaseUser.email ?? profile?.email ?? "",
    userType: isAdmin ? "admin" : isVendor ? "vendor" : "customer"
  };
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
