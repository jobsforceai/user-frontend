"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  { slab: "₹25K", limit: "100g / Day", fee: "1.0% + GST", deposit: "₹25,000" },
  { slab: "₹50K", limit: "250g / Day", fee: "1.2% + GST", deposit: "₹50,000" },
  { slab: "₹2L", limit: "500g / Day", fee: "1.5% + GST", deposit: "₹2,00,000" },
  { slab: "₹5L+", limit: "Up to 1kg", fee: "Custom", deposit: "₹5,00,000+" },
];

export function BusinessSection({ authHref }: { authHref: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.from(headingRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
      });

      // Cards staggered
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: "power3.out",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
          },
        });
      });

      // CTA
      gsap.from(ctaRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ctaRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="business"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0F" }}
    >
      {/* Floating gold particles (CSS-only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              backgroundColor: "#d4a843",
              opacity: 0.15 + Math.random() * 0.15,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle large bust glow in background */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: "-10%",
          top: "10%",
          width: "50%",
          height: "80%",
          background: "radial-gradient(ellipse at center, rgba(212,168,67,0.03) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 text-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#d4a843" }}
          >
            For Business
          </p>
          <h2
            className="font-black uppercase leading-[0.92]"
            style={{
              color: "#f5f5f5",
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              letterSpacing: "-0.03em",
            }}
          >
            For Those Who
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #d4a843, #f0d78c, #b8860b)",
              }}
            >
              Move Markets.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-md text-base"
            style={{ color: "rgba(245,245,245,0.6)" }}
          >
            Professional trading. Higher limits. Wholesale pricing.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier, i) => (
            <div
              key={tier.slab}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative rounded-2xl p-4 sm:p-6 text-center transition-all duration-500"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,168,67,0.35)";
                e.currentTarget.style.boxShadow = "0 0 50px rgba(212,168,67,0.08)";
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: "rgba(245,245,245,0.5)" }}
              >
                Deposit Tier
              </p>

              {/* Shimmer number */}
              <p
                className="mt-4 font-black"
                style={{
                  fontSize: "2.5rem",
                  lineHeight: 1,
                  backgroundImage: "linear-gradient(90deg, #d4a843 0%, #f0d78c 30%, #d4a843 60%, #f0d78c 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "shimmer 3s ease-in-out infinite",
                }}
              >
                {tier.slab}
              </p>

              <div
                className="mx-auto my-5 h-px w-12"
                style={{ background: "rgba(212,168,67,0.2)" }}
              />

              <p
                className="text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "rgba(245,245,245,0.45)" }}
              >
                Daily Limit
              </p>
              <p
                className="mt-1.5 text-lg font-bold"
                style={{ color: "#f5f5f5" }}
              >
                {tier.limit}
              </p>

              <p
                className="mt-4 text-xs"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                {tier.fee}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-14 text-center">
          <Link
            href={authHref}
            className="inline-flex items-center gap-3 rounded-xl px-10 py-4 text-sm font-bold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d4a843, #b8860b)",
              color: "#0B0B0F",
              boxShadow: "0 8px 32px rgba(212,168,67,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 48px rgba(212,168,67,0.35)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(212,168,67,0.2)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Request Business Account
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
