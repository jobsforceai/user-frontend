"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function GalleryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Logo cinematic intro ── */
      gsap.from(logoRef.current, {
        scale: 0.3,
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        delay: 0.2,
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

      /* ── Scroll-driven glow ── */
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen overflow-hidden bg-bg"
    >
      {/* Radial gradient behind logo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center 50%, rgba(212,168,67,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Glow (appears on scroll) */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "min(70vw, 700px)",
          height: "min(70vw, 700px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 40%, transparent 70%)",
          opacity: 0,
        }}
      />

      {/* ── LOGO ── */}
      <div
        ref={logoRef}
        className="absolute inset-0 z-[5] flex items-center justify-center"
      >
        <Image
          src="/logo.png"
          alt="SG Gold"
          width={400}
          height={400}
          priority
          className="h-[35vh] w-[35vh] max-h-[400px] max-w-[400px] object-contain drop-shadow-2xl sm:h-[50vh] sm:w-[50vh]"
        />
      </div>

      {/* ── TOP HEADING ── */}
      <div
        ref={headingRef}
        className="absolute left-0 bottom-2 z-10 pointer-events-none"
      >
        <h1
          className="select-none font-black uppercase text-left"
          style={{
            color: "#f5f5f5",
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
      <div className="absolute bottom-2 right-0 z-10 flex flex-col items-center pointer-events-none">
        <p
          ref={subheadingRef}
          className="max-w-lg text-right font-semibold select-none"
          style={{
            color: "rgba(245,245,245,0.55)",
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
    </section>
  );
}
