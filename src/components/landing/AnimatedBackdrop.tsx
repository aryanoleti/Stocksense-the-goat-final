"use client";

import { useEffect, useRef } from "react";

// An interactive particle-network canvas that sits behind the hero. Points
// drift slowly upward (a market that trends up), link to nearby neighbours,
// and lean toward the cursor — echoing igloo.inc's particle feel, themed for
// markets. Respects prefers-reduced-motion and cleans up on unmount.

type P = { x: number; y: number; vx: number; vy: number; r: number; up: boolean };

export function AnimatedBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Stable non-null captures so TS keeps the narrowing inside the closures below.
    const cvs: HTMLCanvasElement = canvas;
    const g: CanvasRenderingContext2D = ctx;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const parent = cvs.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = width * dpr;
      cvs.height = height * dpr;
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(90, Math.round((width * height) / 16000));
      particles = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.1 + Math.random() * 0.35),
        r: 1 + Math.random() * 2,
        up: Math.random() > 0.35,
      }));
    }

    const LINK_DIST = 130;

    function step() {
      g.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Cursor attraction (gentle)
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 200 * 200) {
            const f = 0.6 / Math.max(400, d2);
            p.vx += dx * f;
            p.vy += dy * f;
          }
        }

        // Damping + gentle upward bias so it keeps drifting
        p.vx *= 0.99;
        p.vy = p.vy * 0.99 - 0.002;

        // Wrap around edges
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
      }

      // Links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.28;
            g.strokeStyle = `rgba(140, 220, 180, ${alpha})`;
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
      }

      // Points
      for (const p of particles) {
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fillStyle = p.up ? "rgba(160, 235, 195, 0.85)" : "rgba(120, 200, 165, 0.55)";
        g.fill();
      }

      raf = requestAnimationFrame(step);
    }

    let raf = 0;
    function onMove(e: MouseEvent) {
      const rect = cvs.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    resize();
    if (reduced) {
      // Draw a single static frame
      step();
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(step);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseout", onLeave);
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
