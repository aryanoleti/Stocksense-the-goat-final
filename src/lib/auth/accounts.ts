"use client";

// Client-side account store for email/password sign-in.
//
// IMPORTANT: this is a static site with no backend, so "accounts" live in the
// browser's localStorage. Passwords are salted + SHA-256 hashed (never stored
// in plain text), but this is demo-grade auth — it does not sync across
// devices and is not a substitute for real server-side authentication. It's
// consistent with the rest of the app, which keeps portfolio/watchlist/etc.
// entirely in localStorage.

import type { AuthUser, OnboardingProfile } from "./types";

const ACCOUNTS_KEY = "stocksense.accounts.v1";

export type StoredAccount = {
  email: string; // normalised (lowercased, trimmed)
  name: string;
  salt: string; // hex
  hash: string; // hex SHA-256(salt + password)
  profile: OnboardingProfile;
  createdAt: number;
};

function loadAccounts(): Record<string, StoredAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredAccount>) : {};
  } catch {
    return {};
  }
}

function saveAccounts(accounts: Record<string, StoredAccount>) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    /* noop */
  }
}

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

async function hashPassword(password: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

const EMAIL_RX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function accountExists(email: string): boolean {
  return !!loadAccounts()[normaliseEmail(email)];
}

function toAuthUser(account: StoredAccount): AuthUser {
  return {
    sub: `pw:${account.email}`,
    email: account.email,
    name: account.name,
    picture: "",
    provider: "password",
    profile: account.profile,
  };
}

export type AccountResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string; noAccount?: boolean };

export async function registerAccount(
  rawEmail: string,
  name: string,
  password: string,
  profile: OnboardingProfile,
): Promise<AccountResult> {
  const email = normaliseEmail(rawEmail);
  if (!EMAIL_RX.test(email)) return { ok: false, error: "Enter a valid email address." };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters." };

  const accounts = loadAccounts();
  if (accounts[email]) {
    return { ok: false, error: "An account with this email already exists — sign in instead." };
  }

  const salt = randomSalt();
  const hash = await hashPassword(password, salt);
  const account: StoredAccount = {
    email,
    name: name.trim() || email.split("@")[0],
    salt,
    hash,
    profile,
    createdAt: Date.now(),
  };
  accounts[email] = account;
  saveAccounts(accounts);
  return { ok: true, user: toAuthUser(account) };
}

export async function signInWithPassword(rawEmail: string, password: string): Promise<AccountResult> {
  const email = normaliseEmail(rawEmail);
  const account = loadAccounts()[email];
  if (!account) {
    return {
      ok: false,
      error: "No account found for that email. Get started to create one first.",
      noAccount: true,
    };
  }
  const hash = await hashPassword(password, account.salt);
  if (hash !== account.hash) return { ok: false, error: "Incorrect password. Please try again." };
  return { ok: true, user: toAuthUser(account) };
}
