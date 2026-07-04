import { MarketingNav } from "@/components/layout/MarketingNav";
import { Hero } from "@/components/landing/Hero";
import { TickerStrip } from "@/components/landing/TickerStrip";
import { Features } from "@/components/landing/Features";
import { FAQ } from "@/components/landing/FAQ";
import { CtaBanner } from "@/components/landing/CtaBanner";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="bg-(--color-bg)">
      <div className="gradient-brand-soft relative overflow-hidden">
        <div className="absolute inset-0 grid-mask pointer-events-none" />
        <div className="relative">
          <MarketingNav />
          <Hero />
        </div>
      </div>
      <TickerStrip />
      <Features />
      <FAQ />
      <CtaBanner />
      <Footer />
    </main>
  );
}
