import type { AuthUser } from "./types";

type GoogleIdTokenPayload = {
  iss: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  given_name?: string;
  family_name?: string;
  picture: string;
  exp: number;
};

export function decodeGoogleCredential(credential: string): AuthUser | null {
  try {
    const payloadB64 = credential.split(".")[1];
    if (!payloadB64) return null;
    const normalized = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = atob(padded);
    const payload = JSON.parse(json) as GoogleIdTokenPayload;
    if (!payload.sub || !payload.email) return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name ?? payload.email.split("@")[0],
      picture: payload.picture ?? "",
      givenName: payload.given_name,
    };
  } catch {
    return null;
  }
}
