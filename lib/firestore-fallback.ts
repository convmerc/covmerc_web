/** When true, use local seed data instead of Firestore (CI / Playwright E2E). */
export function shouldUseSeedFirestoreFallback(): boolean {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === "ci-placeholder" ||
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY === "ci-placeholder"
  );
}
