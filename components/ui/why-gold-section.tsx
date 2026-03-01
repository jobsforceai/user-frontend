"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Inflation Hedge",
    desc: "When currencies lose purchasing power, gold gains it. A proven store of value across centuries.",
    stat: "10%",
    statLabel: "Avg. Annual Return",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Global Asset",
    desc: "Recognized in every country, accepted in every economy. Gold needs no government backing.",
    stat: "197K",
    statLabel: "Tonnes Above Ground",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Physical Redemption",
    desc: "Your digital holdings can become physical coins and bars. Real metal, in your hands.",
    stat: "24K",
    statLabel: "Pure Gold Available",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
];

export function WhyGoldSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Section divider line draw ── */
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "center",
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 90%",
            },
          }
        );
      }

      /* ── Heading split entrance ── */
      const headingLines = headingRef.current?.querySelectorAll(".split-line-inner");
      if (headingLines) {
        gsap.fromTo(
          headingLines,
          { y: "110%", skewY: 3 },
          {
            y: "0%",
            skewY: 0,
            duration: 1.2,
            ease: "power4.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
            },
          }
        );
      }

      /* ── Cards 3D tilt-up entrance ── */
      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        gsap.fromTo(
          el,
          {
            y: 80,
            opacity: 0,
            rotateX: 15,
            scale: 0.95,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            delay: i * 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 50%",
            },
          }
        );

        /* ── Parallax on card ── */
        gsap.to(el, {
          y: -20 - i * 10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-gold"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0F" }}
    >
      {/* Section divider */}
      <div ref={dividerRef} className="section-divider" />

      {/* Subtle cross-hatch pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              rgba(212,168,67,0.012) 0px,
              rgba(212,168,67,0.012) 1px,
              transparent 1px,
              transparent 60px
            )
          `,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        {/* Heading */}
        <div ref={headingRef} className="mb-20 max-w-2xl">
          <p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.4em]"
            style={{ color: "#d4a843" }}
          >
            Why Gold
          </p>
          <h2
            className="font-black uppercase leading-[0.92]"
            style={{
              color: "#f5f5f5",
              fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            <span className="split-line">
              <span className="split-line-inner">Paper Fades.</span>
            </span>
            <span className="split-line">
              <span className="split-line-inner gold-text">Gold Endures.</span>
            </span>
          </h2>
          <p
            className="mt-6 max-w-md text-lg"
            style={{ color: "rgba(245,245,245,0.5)" }}
          >
            Currency inflates. Gold preserves.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-6 md:grid-cols-3" style={{ perspective: "1000px" }}>
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="glass-card group relative rounded-2xl p-8 border-glow cursor-default"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Icon */}
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110"
                style={{
                  background: "rgba(212,168,67,0.06)",
                  color: "#d4a843",
                  border: "1px solid rgba(212,168,67,0.1)",
                }}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3
                className="mb-3 text-lg font-bold"
                style={{ color: "#f5f5f5" }}
              >
                {card.title}
              </h3>

              {/* Description */}
              <p
                className="text-[15px] leading-relaxed mb-6"
                style={{ color: "rgba(245,245,245,0.5)" }}
              >
                {card.desc}
              </p>

              {/* Stat */}
              <div
                className="pt-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span
                  ref={(el) => { counterRefs.current[i] = el; }}
                  className="counter-value text-2xl font-black gold-text"
                >
                  {card.stat}
                </span>
                <span
                  className="ml-2 text-xs uppercase tracking-[0.15em]"
                  style={{ color: "rgba(245,245,245,0.35)" }}
                >
                  {card.statLabel}
                </span>
              </div>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(212,168,67,0.06) 0%, transparent 60%)",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
