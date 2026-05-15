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

type AdminSessionValue = {
  isAdminAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
};

const AdminSessionContext = createContext<AdminSessionValue | null>(null);

const ADMIN_STORAGE_KEY = "furni-admin-auth";
const ADMIN_USERNAME = "owner@furni.com";
const ADMIN_PASSWORD = "Furni@2026";

export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsAdminAuthenticated(window.localStorage.getItem(ADMIN_STORAGE_KEY) === "true");
  }, []);

  const login = useCallback((username: string, password: string) => {
    const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (isValid) {
      setIsAdminAuthenticated(true);
      window.localStorage.setItem(ADMIN_STORAGE_KEY, "true");
    }
    return isValid;
  }, []);

  const logout = useCallback(() => {
    setIsAdminAuthenticated(false);
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      isAdminAuthenticated,
      login,
      logout
    }),
    [isAdminAuthenticated, login, logout]
  );

  return (
    <AdminSessionContext.Provider value={value}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
  const context = useContext(AdminSessionContext);
  if (!context) {
    throw new Error("useAdminSession must be used inside AdminSessionProvider.");
  }
  return context;
}

export const demoAdminCredentials = {
  username: ADMIN_USERNAME,
  password: ADMIN_PASSWORD
};
