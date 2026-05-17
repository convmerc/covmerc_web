export const CHECKOUT_PATH = "/checkout";

export function checkoutLoginPath(): string {
  return `/auth/login?next=${encodeURIComponent(CHECKOUT_PATH)}`;
}

export function checkoutHref(isAuthenticated: boolean): string {
  return isAuthenticated ? CHECKOUT_PATH : checkoutLoginPath();
}
