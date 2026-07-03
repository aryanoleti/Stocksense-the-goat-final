"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Gates its children behind sign-in. Unauthenticated visitors are bounced
 * back to the landing page with the sign-in modal opened, rather than ever
 * rendering real market data.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, hydrated, openSignIn } = useAuth();
  const router = useRouter();
  const bounced = useRef(false);

  useEffect(() => {
    if (hydrated && !user && !bounced.current) {
      bounced.current = true;
      openSignIn();
      router.replace("/");
    }
  }, [hydrated, user, openSignIn, router]);

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-(--color-bg)">
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-(--color-brand-500) animate-pulse-dot" />
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
