"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  { slab: "₹25K", limit: "100g / Day", fee: "1.0% + GST", deposit: "₹25,000", tag: "Starter" },
  { slab: "₹50K", limit: "250g / Day", fee: "1.2% + GST", deposit: "₹50,000", tag: "Growth" },
  { slab: "₹2L", limit: "500g / Day", fee: "1.5% + GST", deposit: "₹2,00,000", tag: "Pro" },
  { slab: "₹5L+", limit: "Up to 1kg", fee: "Custom", deposit: "₹5,00,000+", tag: "Enterprise" },
];

export function BusinessSection({ authHref }: { authHref: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Section divider ── */
      if (dividerRef.current) {
        gsap.fromTo(dividerRef.current, { scaleX: 0 }, {
          scaleX: 1, transformOrigin: "center", duration: 1.5, ease: "power3.inOut",
          scrollTrigger: { trigger: dividerRef.current, start: "top 90%" },
        });
      }

      /* ── Heading split-line ── */
      const headingLines = headingRef.current?.querySelectorAll(".split-line-inner");
      if (headingLines) {
        gsap.fromTo(headingLines,
          { y: "110%", skewY: 3 },
          {
            y: "0%", skewY: 0, duration: 1.2, ease: "power4.out", stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
          }
        );
      }

      /* ── Cards 3D stagger ── */
      const validCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.fromTo(validCards,
        { y: 80, opacity: 0, rotateX: 12, scale: 0.92 },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1,
          duration: 1, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: sectionRef.current, start: "top 50%" },
        }
      );

      /* ── Per-card parallax ── */
      validCards.forEach((el, i) => {
        gsap.to(el, {
          y: -15 - i * 5,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.6,
          },
        });
      });

      /* ── CTA ── */
      gsap.fromTo(ctaRef.current,
        { y: 40, opacity: 0, filter: "blur(6px)" },
        {
          y: 0, opacity: 1, filter: "blur(0px)", duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ctaRef.current, start: "top 85%" },
        }
      );
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
      <div ref={dividerRef} className="section-divider" />

      {/* Floating gold particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              backgroundColor: "#d4a843",
              opacity: 0.12 + Math.random() * 0.12,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-particle ${8 + Math.random() * 12}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Radial glow */}
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

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        {/* Heading */}
        <div ref={headingRef} className="mb-20 text-center">
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.4em]"
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
            <span className="split-line" style={{ justifyContent: "center" }}>
              <span className="split-line-inner">For Those Who</span>
            </span>
            <span className="split-line" style={{ justifyContent: "center" }}>
              <span className="split-line-inner gold-text">Move Markets.</span>
            </span>
          </h2>
          <p
            className="mx-auto mt-6 max-w-md text-base"
            style={{ color: "rgba(245,245,245,0.5)" }}
          >
            Professional trading. Higher limits. Wholesale pricing.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: "1200px" }}>
          {tiers.map((tier, i) => (
            <div
              key={tier.slab}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="glass-card border-glow group relative rounded-2xl p-7 text-center"
            >
              {/* Tag badge */}
              <span
                className="mb-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{
                  background: "rgba(212,168,67,0.08)",
                  color: "#d4a843",
                  border: "1px solid rgba(212,168,67,0.15)",
                }}
              >
                {tier.tag}
              </span>

              {/* Shimmer number */}
              <p
                className="mt-2 font-black"
                style={{
                  fontSize: "2.8rem",
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
                className="mx-auto my-6 h-px w-12"
                style={{ background: "rgba(212,168,67,0.15)" }}
              />

              <p
                className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                style={{ color: "rgba(245,245,245,0.35)" }}
              >
                Daily Limit
              </p>
              <p className="mt-1.5 text-lg font-bold" style={{ color: "#f5f5f5" }}>
                {tier.limit}
              </p>

              <p className="mt-4 text-xs" style={{ color: "rgba(245,245,245,0.35)" }}>
                {tier.fee}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="mt-16 text-center">
          <Link
            href={authHref}
            className="magnetic-btn inline-flex items-center gap-3 rounded-xl px-10 py-4 text-sm font-bold transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #d4a843, #b8860b)",
              color: "#0B0B0F",
              boxShadow: "0 8px 32px rgba(212,168,67,0.2)",
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
