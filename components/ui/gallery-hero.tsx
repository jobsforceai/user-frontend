"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Model3DViewer, type ModelState } from "./model-3d-viewer";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   ✏️  MODEL ANIMATION CONFIG — tweak these values freely
   ═══════════════════════════════════════════════════════════════ */
const MODEL_INTRO = {
  duration: 2.8,            // seconds for the cinematic intro
  ease: "power3.out" as const,
  delay: 0.4,               // delay after model loads

  /* Starting pose */
  from: {
    rotationY: Math.PI * 2,   // rotated away from camera
    scale: 0.2,                  // small
    positionX: 0,
    positionY: -3,
    positionZ: 0,
  },

  /* ✏️  Final resting pose — change these to reposition the model */
  to: {
    rotationY: Math.PI * 3.4,          // facing the camera
    scale: 0.55,                 // final size
    positionX: 0,                // shift left/right
    positionY: -3,             // shift up/down
    positionZ: 0,                // shift forward/back
  },
};


/* ── GSAP-driven loading overlay ── */
function LoadingOverlay({ visible }: { visible: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  /* Looping animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Spinning ring */
      gsap.to(ringRef.current, {
        rotation: 360,
        duration: 1.2,
        ease: "none",
        repeat: -1,
      });

      /* Pulsing inner glow */
      gsap.to(pulseRef.current, {
        scale: 1.4,
        opacity: 0.6,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });

      /* Text breathing */
      gsap.to(textRef.current, {
        opacity: 0.3,
        duration: 0.9,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, []);

  /* Fade-out transition when loading finishes */
  useEffect(() => {
    if (!visible && overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
        onComplete: () => {
          if (overlayRef.current) overlayRef.current.style.pointerEvents = "none";
        },
      });
    }
  }, [visible]);

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 z-20 flex flex-col items-center justify-center"
      style={{ backgroundColor: "#ffffff" }}
    >
      <div className="relative flex items-center justify-center">
        <div
          ref={ringRef}
          className="h-16 w-16 rounded-full"
          style={{
            border: "2px solid rgba(212,168,67,0.15)",
            borderTopColor: "#d4a843",
          }}
        />
        <div
          ref={pulseRef}
          className="absolute h-10 w-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,168,67,0.25) 0%, transparent 70%)",
          }}
        />
      </div>
      <p
        ref={textRef}
        className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em]"
        style={{ color: "#d4a843" }}
      >
        Loading
      </p>
    </div>
  );
}

export function GalleryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  /* Mutable model state — GSAP tweens these values, useFrame reads them */
  const modelStateRef = useRef<ModelState>({ ...MODEL_INTRO.from });

  const handleModelLoaded = useCallback(() => {
    setTimeout(() => setLoading(false), 400);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Cinematic model intro: GSAP tweens stateRef directly ── */
      gsap.to(modelStateRef.current, {
        ...MODEL_INTRO.to,
        duration: MODEL_INTRO.duration,
        ease: MODEL_INTRO.ease,
        delay: MODEL_INTRO.delay,
      });

      /* ── Text fade-ups ── */
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(subheadingRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
      });


      /* ── Scroll-driven section animation ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "40% top",
          scrub: 1,
          pin: false,
        },
      });

      tl.to(glowRef.current, { opacity: 1, scale: 1.1, duration: 1 }, 0);
      tl.to(shadowRef.current, { opacity: 0.35, scaleX: 1.15, duration: 1 }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ backgroundColor: "#ffffff" }}
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#ffffff" }} />

      {/* Radial gradient behind model */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center 55%, rgba(0,0,0,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Glow (hidden initially, appears on scroll) */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] pointer-events-none"
        style={{
          width: "min(70vw, 700px)",
          height: "min(70vw, 700px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 40%, transparent 70%)",
          opacity: 0,
          transform: "translate(-50%, -45%) scale(1)",
        }}
      />

      {/* ── TOP HEADING ── */}
      <div
        ref={headingRef}
        className="absolute left-0 bottom-2 z-10 pointer-events-none px-4 sm:px-6 md:px-8"
      >
        <h1
          className="select-none font-black uppercase text-left"
          style={{
            color: "#111111",
            fontSize: "clamp(2.5rem, 7vw, 7rem)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          <span>Gold</span>
          <br />
          <span>Demands</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #d4a843 0%, #b8860b 50%, #d4a843 100%)",
            }}
          >
            Strength.
          </span>
        </h1>
      </div>

      {/* ── SUBHEADING ── */}
      <div className="absolute bottom-2 right-0 z-10 flex flex-col items-center pointer-events-none px-4 sm:px-6 md:px-8">
        <p
          ref={subheadingRef}
          className="max-w-lg text-right font-semibold select-none"
          style={{
            color: "#555555",
            fontSize: "clamp(0.875rem, 1.5vw, 2.125rem)",
            lineHeight: 1.6,
            letterSpacing: "0.01em",
          }}
        >
          Invest in digital gold at live market prices.
          <br />
          Buy, save, and take delivery — all in one place.
        </p>
      </div>

      {/* ── Loading overlay ── */}
      <LoadingOverlay visible={loading} />

      {/* ── 3D MODEL VIEWER ── */}
      <div className="absolute h-full w-full inset-0 z-[5]">
        <Model3DViewer
          stateRef={modelStateRef}
          onLoaded={handleModelLoaded}
        />
      </div>

      {/* ── Shadow below model ── */}
      <div
        ref={shadowRef}
        className="absolute left-1/2 -translate-x-1/2 z-[4] pointer-events-none"
        style={{
          bottom: "18%",
          width: "min(50vw, 400px)",
          height: "30px",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)",
          opacity: 0.2,
        }}
      />
    </section>
  );
}
