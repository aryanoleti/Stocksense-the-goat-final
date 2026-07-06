import { MarketingNav } from "@/components/layout/MarketingNav";
import { LandingRedirect } from "@/components/landing/LandingRedirect";
import { Hero } from "@/components/landing/Hero";
import { TickerStrip } from "@/components/landing/TickerStrip";
import { Features } from "@/components/landing/Features";
import { MarketPulse } from "@/components/landing/MarketPulse";
import { FAQ } from "@/components/landing/FAQ";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-(--color-bg)">
      <LandingRedirect />
      <div className="gradient-brand-soft relative overflow-hidden">
        <div className="absolute inset-0 grid-mask pointer-events-none" />
        <div className="relative">
          <MarketingNav />
          <Hero />
        </div>
      </div>
      <TickerStrip />
      <Features />
      <MarketPulse />
      <FAQ />
      <CtaBanner />
      <Footer />
    </main>
  );
}
