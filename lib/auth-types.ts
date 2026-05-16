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
};
