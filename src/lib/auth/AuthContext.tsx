"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeGoogleCredential } from "./jwt";
import type { AuthUser } from "./types";
import "./types";

const STORAGE_KEY = "stocksense.user.v1";
const SIGNIN_OPEN_EVENT = "stocksense:open-signin";

export type AuthContextValue = {
  user: AuthUser | null;
  clientId: string | undefined;
  ready: boolean; // GIS script loaded
  /** True once we've checked localStorage for an existing session. */
  hydrated: boolean;
  signOut: () => void;
  openSignIn: () => void;
  /** Internal — called by SignInModal when GIS returns a credential. */
  _setCredential: (credential: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    } finally {
      setHydrated(true);
    }
  }, []);

  // Wait for the GIS script to load
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.google?.accounts?.id) {
      setReady(true);
      return;
    }
    const id = setInterval(() => {
      if (window.google?.accounts?.id) {
        setReady(true);
        clearInterval(id);
      }
    }, 120);
    return () => clearInterval(id);
  }, []);

  const persist = useCallback((u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const signOut = useCallback(() => {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch {
        /* noop */
      }
    }
    persist(null);
    router.replace("/");
  }, [persist, router]);

  const _setCredential = useCallback(
    (credential: string) => {
      const decoded = decodeGoogleCredential(credential);
      if (!decoded) return false;
      persist(decoded);
      return true;
    },
    [persist],
  );

  const openSignIn = useCallback(() => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(SIGNIN_OPEN_EVENT));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, clientId, ready, hydrated, signOut, openSignIn, _setCredential }),
    [user, clientId, ready, hydrated, signOut, openSignIn, _setCredential],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const SIGNIN_OPEN_EVENT_NAME = SIGNIN_OPEN_EVENT;
