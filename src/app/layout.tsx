import type { Metadata } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { SignInModal } from "@/components/auth/SignInModal";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockSense — Smarter Stock Decisions, Powered by AI",
  description:
    "Your intelligent companion for the Indian stock market. Analyse companies, simulate investments, and get AI-powered insights — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
          <SignInModal />
        </AuthProvider>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </body>
    </html>
  );
}
