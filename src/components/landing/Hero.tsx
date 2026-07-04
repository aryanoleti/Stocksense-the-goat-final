"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { AnimatedBackdrop } from "./AnimatedBackdrop";
import { HeroPreview } from "./HeroPreview";

export function Hero() {
  const { user, openSignIn } = useAuth();
  const reduce = useReducedMotion();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section className="relative isolate">
      <AnimatedBackdrop />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-(--color-brand-400)/12 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 pt-10 pb-20 sm:pt-16 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/85 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-(--color-brand-300)" />
              Built for Indian retail investors
            </motion.div>
            <motion.h1
              variants={item}
              className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl md:text-[64px] md:leading-[1.04]"
            >
              Smarter stock decisions,
              <span className="block text-(--color-brand-200)">powered by AI.</span>
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-[17px]"
            >
              Track live prices across 360+ Indian stocks and commodities, analyse companies,
              simulate trades with virtual money, and ask an AI assistant for a second opinion —
              all in one calm, beautiful product.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              {user ? (
                <Button href="/dashboard" size="lg" className="bg-white text-(--color-brand-900) hover:bg-white/90 shadow-none">
                  Open dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => openSignIn("signup")}
                    size="lg"
                    className="bg-white text-(--color-brand-900) hover:bg-white/90 shadow-none"
                  >
                    Get started — it&apos;s free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => openSignIn("signin")}
                    variant="ghost"
                    size="lg"
                    className="text-white hover:bg-white/10"
                  >
                    I already have an account
                  </Button>
                </>
              )}
            </motion.div>
            <motion.p variants={item} className="mt-5 text-[12.5px] text-white/55">
              No credit card. Virtual portfolio. Real market data.
            </motion.p>
            <motion.dl
              variants={item}
              className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6"
            >
              <Stat value="360+" label="Stocks & ETFs" />
              <Stat value="₹5L" label="Virtual cash" />
              <Stat value="Live" label="Market data" />
            </motion.dl>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={reduce ? "" : "animate-float-y"}>
              <HeroPreview />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-white/45">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight text-white tabular">{value}</dd>
    </div>
  );
}
