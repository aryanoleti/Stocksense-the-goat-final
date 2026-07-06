"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Signed-in users never see the marketing page — they're bounced straight to
 * the dashboard (replace, not push, so Back can't land them here either).
 */
export function LandingRedirect() {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user) router.replace("/dashboard");
  }, [hydrated, user, router]);

  return null;
}
