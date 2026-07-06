"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { getChart } from "@/lib/api/yahoo";

// The hero particle field. Particles idle in slow Brownian motion, then
// coalesce into TODAY'S REAL Nifty 50 intraday curve once it loads — the
// "market structure" the brief asks for is the actual market, not a drawn
// shape. The cursor gently repels nearby particles.

const COUNT = 2200;
const CLOUD_SHARE = 0.32; // particles that stay ambient for depth
const FORM_SPEED = 2.2; // approach rate (per second) toward formation targets
const REPEL_RADIUS = 7;

function Particles() {
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const { viewport, pointer } = useThree();
  const [targets, setTargets] = useState<Float32Array | null>(null);

  const data = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const phase = new Float32Array(COUNT);
    const bright = new THREE.Color("#7ef0bb"); // emerald moment
    const dim = new THREE.Color("#b9cec2"); // neutral gray-green
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 74;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 38;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const c = Math.random() < 0.5 ? bright : dim;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      phase[i] = Math.random() * Math.PI * 2;
    }
    return { pos, col, phase };
  }, []);

  // Real market structure: today's Nifty 50 1D candles become the formation.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await getChart("NIFTY50", "1d", "5m");
      if (cancelled || !r || r.candles.length < 10) return;
      const c = r.candles;
      let min = Infinity;
      let max = -Infinity;
      for (const k of c) {
        if (k.price < min) min = k.price;
        if (k.price > max) max = k.price;
      }
      const span = Math.max(max - min, 1e-6);
      const t = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        if (i < COUNT * CLOUD_SHARE) {
          // ambient depth cloud
          t[i * 3] = (Math.random() - 0.5) * 76;
          t[i * 3 + 1] = (Math.random() - 0.5) * 40;
          t[i * 3 + 2] = -7 - Math.random() * 9;
        } else {
          const u = Math.random();
          const idx = Math.min(c.length - 1, Math.floor(u * (c.length - 1)));
          t[i * 3] = (u - 0.5) * 60 + (Math.random() - 0.5) * 1.4;
          t[i * 3 + 1] = ((c[idx].price - min) / span - 0.38) * 15 + (Math.random() - 0.5) * 1.1;
          t[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
        }
      }
      setTargets(t);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useFrame((state, delta) => {
    const geo = geoRef.current;
    if (!geo) return;
    const pos = geo.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    const k = Math.min(1, FORM_SPEED * delta);
    const px = pointer.x * (viewport.width / 2);
    const py = pointer.y * (viewport.height / 2);
    const r2 = REPEL_RADIUS * REPEL_RADIUS;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const ph = data.phase[i];
      // gentle Brownian shimmer, always on
      const wobX = Math.sin(t * 0.35 + ph) * 0.008;
      const wobY = Math.cos(t * 0.28 + ph * 1.7) * 0.008;

      if (targets) {
        pos[ix] += (targets[ix] - pos[ix]) * k + wobX;
        pos[ix + 1] += (targets[ix + 1] - pos[ix + 1]) * k + wobY;
        pos[ix + 2] += (targets[ix + 2] - pos[ix + 2]) * k;
      } else {
        pos[ix] += wobX * 6;
        pos[ix + 1] += wobY * 6;
      }

      // cursor repulsion (cheap 2D check — the field is mostly planar)
      const dx = pos[ix] - px;
      const dy = pos[ix + 1] - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < r2 && d2 > 0.001) {
        const d = Math.sqrt(d2);
        const f = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 8 * delta;
        pos[ix] += (dx / d) * f;
        pos[ix + 1] += (dy / d) * f;
      }
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={geoRef}>
        <bufferAttribute attach="attributes-position" args={[data.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[data.col, 3]} />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.14}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </points>
  );
}

export default function HeroParticlesCanvas() {
  return (
    <Canvas
      className="absolute inset-0"
      aria-hidden="true"
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 30], fov: 55 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
    >
      <Particles />
    </Canvas>
  );
}
