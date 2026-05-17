/** When true, Firestore listeners fall back to local seed data (CI / E2E). */
export function shouldUseSeedFirestoreFallback(): boolean {
  return process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "ci-placeholder";
}
