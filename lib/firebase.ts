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

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

/** Redirect URI Google OAuth must allow for Firebase popup/redirect sign-in. */
export function getFirebaseAuthHandlerUrl(authDomain = resolveFirebaseAuthDomain()): string {
  return `https://${authDomain}/__/auth/handler`;
}

export function resolveFirebaseAuthDomain(): string {
  const fromEnv = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim();
  if (fromEnv) {
    return fromEnv.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
  if (projectId) {
    return `${projectId}.firebaseapp.com`;
  }
  return "";
}

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: resolveFirebaseAuthDomain(),
  projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

function warnFirebaseAuthDomainMismatch() {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return;
  }

  const authDomain = firebaseConfig.authDomain;
  const expected = projectId ? `${projectId}.firebaseapp.com` : "";

  if (!authDomain) {
    console.warn(
      "[Covmerc] Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN. Google sign-in may fail with redirect_uri_mismatch."
    );
    return;
  }

  if (expected && authDomain !== expected && !authDomain.endsWith(".web.app")) {
    console.error(
      `[Covmerc] AUTH_DOMAIN mismatch: env has "${authDomain}" but PROJECT_ID expects "${expected}". ` +
        `Google sign-in will fail with redirect_uri_mismatch. Update .env.local and restart the dev server.`
    );
    console.info(
      `[Covmerc] Register this redirect URI in Google Cloud OAuth (Web client): ${getFirebaseAuthHandlerUrl(expected)}`
    );
  }
}

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
    warnFirebaseAuthDomainMismatch();
  }
  return cached;
}

export const firebaseAuth = () => getFirebase().auth;
export const firebaseDb = () => getFirebase().db;
export const firebaseStorage = () => getFirebase().storage;

export const googleProvider = new GoogleAuthProvider();

