"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// The Market Pulse centerpiece: a globe of particle-dots the user can nudge
// by dragging. Particle tinting is driven by REAL market breadth — the share
// of green vs red dots equals the live share of advancing vs declining NSE
// stocks passed in from the universe store.

const COUNT = 2600;
const RADIUS = 10.5;

const UP = new THREE.Color("#4ade80");
const DOWN = new THREE.Color("#f2795c");
const NEUTRAL = new THREE.Color("#8aa397");

function Globe({ upShare }: { upShare: number | null }) {
  const group = useRef<THREE.Group>(null);
  const geoRef = useRef<THREE.BufferGeometry>(null);
  const drag = useRef({ active: false, lastX: 0, lastY: 0, velX: 0, velY: 0 });

  // Fibonacci-sphere distribution — even, organic-looking dot coverage.
  const positions = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pos[i * 3] = Math.cos(theta) * r * RADIUS;
      pos[i * 3 + 1] = y * RADIUS;
      pos[i * 3 + 2] = Math.sin(theta) * r * RADIUS;
    }
    return pos;
  }, []);

  const colors = useMemo(() => new Float32Array(COUNT * 3), []);

  // Re-tint dots whenever real breadth changes: upShare of them green,
  // the mirrored share red, the rest neutral (no data yet ⇒ all neutral).
  useEffect(() => {
    const geo = geoRef.current;
    for (let i = 0; i < COUNT; i++) {
      // deterministic pseudo-random per dot so re-tints don't flicker wildly
      const h = ((i * 2654435761) >>> 0) / 4294967295;
      let c = NEUTRAL;
      if (upShare != null) {
        if (h < upShare * 0.92) c = UP;
        else if (h > 1 - (1 - upShare) * 0.92) c = DOWN;
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    if (geo?.attributes.color) geo.attributes.color.needsUpdate = true;
  }, [upShare, colors]);

  useFrame((_state, delta) => {
    const g = group.current;
    if (!g) return;
    const d = drag.current;
    // slow idle spin + drag inertia
    g.rotation.y += delta * 0.12 + d.velX;
    g.rotation.x = THREE.MathUtils.clamp(g.rotation.x + d.velY, -0.6, 0.6);
    d.velX *= 0.94;
    d.velY *= 0.94;
  });

  return (
    <group
      ref={group}
      onPointerDown={(e) => {
        drag.current.active = true;
        drag.current.lastX = e.clientX;
        drag.current.lastY = e.clientY;
      }}
      onPointerUp={() => (drag.current.active = false)}
      onPointerLeave={() => (drag.current.active = false)}
      onPointerMove={(e) => {
        const d = drag.current;
        if (!d.active) return;
        d.velX = (e.clientX - d.lastX) * 0.00035;
        d.velY = (e.clientY - d.lastY) * 0.00025;
        d.lastX = e.clientX;
        d.lastY = e.clientY;
      }}
    >
      <points>
        <bufferGeometry ref={geoRef}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <PointMaterial
          transparent
          vertexColors
          size={0.13}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
        />
      </points>
      {/* invisible sphere so pointer drag has something to hit */}
      <mesh visible={false}>
        <sphereGeometry args={[RADIUS + 1, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
    </group>
  );
}

export default function PulseGlobeCanvas({ upShare }: { upShare: number | null }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.75]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 26], fov: 50 }}
      style={{ position: "absolute", inset: 0, touchAction: "pan-y" }}
    >
      <Globe upShare={upShare} />
    </Canvas>
  );
}
