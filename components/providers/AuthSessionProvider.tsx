"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type UserType = "customer" | "admin";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  userType: UserType;
};

type PersistedUserRecord = {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  password: string;
};

type AuthSessionValue = {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => { success: boolean; message?: string; user?: AuthUser };
  register: (
    name: string,
    email: string,
    password: string
  ) => { success: boolean; message?: string };
  logout: () => void;
};

const demoUsers: PersistedUserRecord[] = [
  {
    id: "usr-admin",
    name: "Covmerc Owner",
    email: "owner@covmerc.com",
    password: "Covmerc@2026",
    userType: "admin"
  },
  {
    id: "usr-customer",
    name: "Covmerc Shopper",
    email: "shopper@covmerc.com",
    password: "Covmerc@2026",
    userType: "customer"
  }
];

const sessionStorageKeys = {
  users: "covmerc-auth-users",
  sessionEmail: "covmerc-auth-session-email"
};

const AuthSessionContext = createContext<AuthSessionValue | null>(null);

function toPublicUser(record: PersistedUserRecord): AuthUser {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    userType: record.userType
  };
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<PersistedUserRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawUsers = window.localStorage.getItem(sessionStorageKeys.users);
    const parsedUsers = rawUsers
      ? (JSON.parse(rawUsers) as PersistedUserRecord[])
      : demoUsers;

    const sessionEmail = window.localStorage.getItem(sessionStorageKeys.sessionEmail);
    const sessionRecord = parsedUsers.find((entry) => entry.email === sessionEmail);

    setUsers(parsedUsers);
    setCurrentUser(sessionRecord ? toPublicUser(sessionRecord) : null);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(sessionStorageKeys.users, JSON.stringify(users));
  }, [users, hydrated]);

  const login = useCallback(
    (email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      const userRecord = users.find((entry) => entry.email === normalizedEmail);

      if (!userRecord || userRecord.password !== password) {
        return { success: false, message: "Invalid email or password." };
      }

      const publicUser = toPublicUser(userRecord);
      setCurrentUser(publicUser);
      window.localStorage.setItem(sessionStorageKeys.sessionEmail, userRecord.email);
      return { success: true, user: publicUser };
    },
    [users]
  );

  const register = useCallback(
    (name: string, email: string, password: string) => {
      const normalizedEmail = email.trim().toLowerCase();
      if (users.some((entry) => entry.email === normalizedEmail)) {
        return { success: false, message: "An account with this email already exists." };
      }

      const nextRecord: PersistedUserRecord = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        userType: "customer"
      };

      const nextUsers = [...users, nextRecord];
      setUsers(nextUsers);
      setCurrentUser(toPublicUser(nextRecord));
      window.localStorage.setItem(sessionStorageKeys.sessionEmail, normalizedEmail);
      return { success: true };
    },
    [users]
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    window.localStorage.removeItem(sessionStorageKeys.sessionEmail);
  }, []);

  const value = useMemo<AuthSessionValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      register,
      logout
    }),
    [currentUser, login, logout, register]
  );

  return (
    <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used inside AuthSessionProvider.");
  }
  return context;
}

export const demoAuthAccounts = demoUsers.map((entry) => ({
  name: entry.name,
  email: entry.email,
  password: entry.password,
  userType: entry.userType
}));
