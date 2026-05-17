export type UserType = "customer" | "admin" | "vendor";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  userType: UserType;
};

export type AuthResult = {
  success: boolean;
  message?: string;
  user?: AuthUser;
  /** Google sign-in started a full-page redirect (no user yet). */
  redirecting?: boolean;
};
