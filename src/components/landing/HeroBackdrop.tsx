"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { AnimatedBackdrop } from "./AnimatedBackdrop";

// The WebGL layer loads only when it will actually render — three.js never
// ships to reduced-motion users or devices without WebGL.
const HeroParticlesCanvas = dynamic(() => import("./three/HeroParticlesCanvas"), {
  ssr: false,
  loading: () => null,
});

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Picks the hero backdrop: the r3f particle field where possible, the
 * original CSS/2D-canvas AnimatedBackdrop as the graceful fallback
 * (reduced motion, no WebGL, or before mount).
 */
export function HeroBackdrop() {
  const reduce = useReducedMotion();
  const [use3d, setUse3d] = useState(false);

  useEffect(() => {
    if (!reduce && webglAvailable()) setUse3d(true);
  }, [reduce]);

  return use3d ? (
    <div className="absolute inset-0" aria-hidden="true">
      <HeroParticlesCanvas />
    </div>
  ) : (
    <AnimatedBackdrop />
  );
}
