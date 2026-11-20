"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * HyperDrive Neural Nexus & Kinetic Light Field
 * Ultra-high-performance, GPU-accelerated Apple-grade ambient tech background.
 *
 * Architecture:
 * - 100% GPU-composited CSS transforms (translate3d, scale) on dedicated layers.
 * - Hardware-accelerated SVG fiber conduits with CSS stroke-dashoffset animations.
 * - Zero heavy canvas loops or shadowBlur filters — eliminated main-thread blocking.
 * - IntersectionObserver auto-sleep: fully pauses all rendering when out of viewport.
 * - Throttled RAF pointer tracking for frictionless, lag-free cursor interaction.
 */
export const TechBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  // Performance: Auto-sleep when hero section is not visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Lag-free pointer tracking using CSS Custom Properties (Desktop only)
  useEffect(() => {
    if (shouldReduceMotion || !isVisible) return;
    const el = containerRef.current;
    if (!el) return;

    // Only enable on fine pointer (mouse/trackpad), skip touch
    if (window.matchMedia && !window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    let rafId: number | null = null;
    let targetX = -1000;
    let targetY = -1000;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          el.style.setProperty("--mouse-x", `${targetX}px`);
          el.style.setProperty("--mouse-y", `${targetY}px`);
          el.style.setProperty("--mouse-opacity", "1");
          rafId = null;
        });
      }
    };

    const handlePointerLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      el.style.setProperty("--mouse-opacity", "0");
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, [isVisible, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        contain: "paint layout",
        // Default cursor flare position
        ["--mouse-x" as any]: "-1000px",
        ["--mouse-y" as any]: "-1000px",
        ["--mouse-opacity" as any]: "0",
      }}
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${
        !isVisible ? "opacity-0" : "opacity-100 transition-opacity duration-700"
      }`}
    >
      {/* ============================================================== */}
      {/* 1. KINETIC CHROMATIC AURORA PLASMAS (GPU Compositor Thread)   */}
      {/* ============================================================== */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ animationPlayState: isVisible ? "running" : "paused" }}
      >
        {/* Primary Crimson Flare */}
        <div
          className="absolute -top-[15%] left-[20%] w-[320px] sm:w-[750px] md:w-[900px] h-[300px] sm:h-[600px] rounded-full blur-[60px] sm:blur-[140px] pointer-events-none opacity-50 dark:opacity-40 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(220,38,38,0.45) 0%, rgba(234,88,12,0.2) 50%, transparent 75%)",
            animation: shouldReduceMotion
              ? "none"
              : "auroraShift1 22s ease-in-out infinite alternate",
            animationPlayState: isVisible ? "running" : "paused",
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Solar Amber Orbit */}
        <div
          className="absolute top-[25%] -right-[10%] w-[280px] sm:w-[650px] h-[280px] sm:h-[650px] rounded-full blur-[50px] sm:blur-[130px] pointer-events-none opacity-40 dark:opacity-30 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(234,88,12,0.4) 0%, rgba(245,158,11,0.18) 50%, transparent 75%)",
            animation: shouldReduceMotion
              ? "none"
              : "auroraShift2 26s ease-in-out infinite alternate",
            animationPlayState: isVisible ? "running" : "paused",
            transform: "translate3d(0,0,0)",
          }}
        />

        {/* Deep Ruby Resonance Core */}
        <div
          className="hidden sm:block absolute top-[40%] -left-[10%] w-[380px] sm:w-[580px] h-[380px] sm:h-[580px] rounded-full blur-[90px] sm:blur-[130px] pointer-events-none opacity-45 dark:opacity-25 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(225,29,72,0.35) 0%, rgba(220,38,38,0.15) 50%, transparent 75%)",
            animation: shouldReduceMotion
              ? "none"
              : "auroraShift3 18s ease-in-out infinite alternate",
            animationPlayState: isVisible ? "running" : "paused",
            transform: "translate3d(0,0,0)",
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* 2. HIGH-TECH VECTOR MATRIX & ARCHITECTURAL GRID (Pure SVG)      */}
      {/* ============================================================== */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-70 dark:opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Micro Engineering Grid Pattern (48px) */}
          <pattern
            id="hp-tech-grid"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            {/* Grid Lines */}
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="currentColor"
              className="text-neutral-400/20 dark:text-neutral-700/25"
              strokeWidth="0.8"
            />
            {/* Intersection Crosshair */}
            <path
              d="M 22 24 L 26 24 M 24 22 L 24 26"
              fill="none"
              stroke="currentColor"
              className="text-primary/30 dark:text-primary/40"
              strokeWidth="1"
            />
          </pattern>

          {/* Precision Dot Cluster Pattern (96px) */}
          <pattern
            id="hp-dot-nodes"
            width="96"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="48"
              cy="48"
              r="1.2"
              fill="currentColor"
              className="text-primary/50 dark:text-accent-orange/45"
            />
          </pattern>

          {/* Radial mask for gentle center/bottom vignette */}
          <radialGradient
            id="hp-grid-vignette"
            cx="50%"
            cy="40%"
            r="65%"
            fx="50%"
            fy="40%"
          >
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
          </radialGradient>

          <mask id="hp-grid-mask">
            <rect
              width="100%"
              height="100%"
              fill="url(#hp-grid-vignette)"
            />
          </mask>

          {/* Animated Conduit Gradients */}
          <linearGradient id="streamGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DC2626" stopOpacity="0" />
            <stop offset="40%" stopColor="#DC2626" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#EA580C" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FEF08A" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="streamGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#EA580C" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF453A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Layer with Vignette Mask */}
        <rect
          width="100%"
          height="100%"
          fill="url(#hp-tech-grid)"
          mask="url(#hp-grid-mask)"
        />
        <rect
          width="100%"
          height="100%"
          fill="url(#hp-dot-nodes)"
          mask="url(#hp-grid-mask)"
        />

        {/* Optical Fiber Conduits (Smooth, GPU-accelerated CSS dashoffset - Desktop/Tablet) */}
        {!shouldReduceMotion && (
          <g
            mask="url(#hp-grid-mask)"
            className="hidden sm:block opacity-75 dark:opacity-85"
            style={{ animationPlayState: isVisible ? "running" : "paused" }}
          >
            {/* Conduit 1: Upper Wave Line */}
            <path
              d="M -100,160 Q 300,120 700,200 T 1600,180 T 2400,220"
              fill="none"
              stroke="url(#streamGrad1)"
              strokeWidth="1.5"
              strokeDasharray="140 380"
              className="hp-conduit-stream-1"
            />

            {/* Conduit 2: Mid Dynamic Line */}
            <path
              d="M -100,340 C 280,410 650,260 1150,330 S 1800,410 2400,320"
              fill="none"
              stroke="url(#streamGrad2)"
              strokeWidth="2"
              strokeDasharray="220 540"
              className="hp-conduit-stream-2"
            />

            {/* Conduit 3: Lower Subtle Pulse Line */}
            <path
              d="M -100,520 Q 400,580 950,490 T 1900,540 T 2600,490"
              fill="none"
              stroke="url(#streamGrad1)"
              strokeWidth="1.2"
              strokeDasharray="90 320"
              className="hp-conduit-stream-3"
            />
          </g>
        )}
      </svg>

      {/* ============================================================== */}
      {/* 3. HARDWARE-ACCELERATED CURSOR FLARE (Desktop Pointer Only)     */}
      {/* ============================================================== */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none transition-opacity duration-300 will-change-transform"
        style={{
          opacity: "var(--mouse-opacity)",
          background: `radial-gradient(550px circle at var(--mouse-x) var(--mouse-y), rgba(234, 88, 12, 0.12), rgba(220, 38, 38, 0.04) 40%, transparent 70%)`,
        }}
      />

      {/* ============================================================== */}
      {/* 4. HIGH-TECH GEOMETRIC HUD CORNER ACCENTS (Ultra Lightweight)   */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-between absolute top-6 left-8 right-8 text-[10px] font-mono tracking-widest text-text-muted/40 uppercase pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-ping" />
          <span>HP.CORE // NEURAL_MESH_V4</span>
        </div>
        <div className="flex items-center gap-4">
          <span>LATENCY // ZERO_LAG</span>
          <span>DISPATCH // READY</span>
        </div>
      </div>

      {/* Bottom Soft Fade for Perfect Typography Legibility */}
      <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-48 bg-gradient-to-t from-bg via-bg/70 to-transparent pointer-events-none" />
    </div>
  );
};

export default TechBackground;
