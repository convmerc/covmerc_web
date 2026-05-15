import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  type Auth,
  GoogleAuthProvider,
  type UserCredential
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export type FirebaseServices = {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
};

let cached: FirebaseServices | null = null;

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function createFirebaseApp(): FirebaseServices {
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
    // Fail fast in development to catch misconfiguration.
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "Missing Firebase environment variables. Please set NEXT_PUBLIC_FIREBASE_* values in .env.local."
      );
    }
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app)
  };
}

export function getFirebase(): FirebaseServices {
  if (!cached) {
    cached = createFirebaseApp();
  }
  return cached;
}

export const firebaseAuth = () => getFirebase().auth;
export const firebaseDb = () => getFirebase().db;
export const firebaseStorage = () => getFirebase().storage;

export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle(): Promise<UserCredential> {
  const { auth } = getFirebase();
  const { signInWithPopup } = await import("firebase/auth");
  return signInWithPopup(auth, googleProvider);
}

