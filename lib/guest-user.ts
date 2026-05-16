/** Stable guest user id for Firestore orders (matches Flutter guest pattern). */
export function guestUserIdFromEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  const slug = normalized.replace(/[^a-z0-9]+/g, "_").slice(0, 48);
  return `guest_${slug || "checkout"}`;
}

export function isGuestUserId(userId: string): boolean {
  return userId.startsWith("guest_");
}
