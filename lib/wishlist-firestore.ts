import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe
} from "firebase/firestore";
import { getFirebase } from "@/lib/firebase";

const WISHLISTS_COLLECTION = "wishlists";
const ITEMS_SUBCOLLECTION = "items";

export function subscribeToWishlistProductIds(
  userId: string,
  onData: (productIds: string[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const { db } = getFirebase();
  const itemsRef = collection(
    db,
    WISHLISTS_COLLECTION,
    userId,
    ITEMS_SUBCOLLECTION
  );

  return onSnapshot(
    itemsRef,
    (snapshot) => {
      onData(snapshot.docs.map((entry) => entry.id));
    },
    (error) => onError?.(error)
  );
}

export async function addProductToWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const { db } = getFirebase();
  await setDoc(
    doc(db, WISHLISTS_COLLECTION, userId, ITEMS_SUBCOLLECTION, productId),
    {
      productId,
      createdAt: serverTimestamp()
    }
  );
}

export async function removeProductFromWishlist(
  userId: string,
  productId: string
): Promise<void> {
  const { db } = getFirebase();
  await deleteDoc(
    doc(db, WISHLISTS_COLLECTION, userId, ITEMS_SUBCOLLECTION, productId)
  );
}
