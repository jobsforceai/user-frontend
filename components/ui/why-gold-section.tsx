"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Inflation Hedge",
    desc: "When currencies lose purchasing power, gold gains it. A proven store of value across centuries.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Global Asset",
    desc: "Recognized in every country, accepted in every economy. Gold needs no government backing.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Physical Redemption",
    desc: "Your digital holdings can become physical coins and bars. Real metal, in your hands.",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
];

export function WhyGoldSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background slow zoom
      gsap.to(bgRef.current, {
        scale: 1.08,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      // Gold highlight line across
      gsap.from(highlightRef.current, {
        scaleX: 0,
        transformOrigin: "left",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });

      // Heading entrance
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

      // Cards staggered fade up
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 60,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
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
      {/* Textured background with overlay */}
      <div ref={bgRef} className="absolute inset-0 z-0">
        {/* Dark patterned background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              repeating-linear-gradient(
                45deg,
                rgba(212,168,67,0.015) 0px,
                rgba(212,168,67,0.015) 1px,
                transparent 1px,
                transparent 40px
              )
            `,
          }}
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #0B0B0F 0%, rgba(11,11,15,0.92) 50%, #0B0B0F 100%)",
          }}
        />
      </div>

      {/* Gold highlight line */}
      <div
        ref={highlightRef}
        className="absolute z-10 pointer-events-none"
        style={{
          top: "38%",
          left: "0",
          right: "0",
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, #d4a843 20%, #f0d78c 50%, #d4a843 80%, transparent 100%)",
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        {/* Heading */}
        <div ref={headingRef} className="mb-20 max-w-2xl">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
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
            Paper Fades.
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #d4a843, #f0d78c, #b8860b)",
              }}
            >
              Gold Endures.
            </span>
          </h2>
          <p
            className="mt-6 max-w-md text-lg"
            style={{ color: "rgba(245,245,245,0.6)" }}
          >
            Currency inflates. Gold preserves.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <div
              key={card.title}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="group relative rounded-2xl p-8 transition-all duration-500"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                backdropFilter: "blur(20px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(212,168,67,0.3)";
                e.currentTarget.style.boxShadow = "0 0 40px rgba(212,168,67,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(212,168,67,0.08)",
                  color: "#d4a843",
                }}
              >
                {card.icon}
              </div>
              <h3
                className="mb-3 text-lg font-bold"
                style={{ color: "#f5f5f5" }}
              >
                {card.title}
              </h3>
              <p
                className="text-[15px] leading-relaxed"
                style={{ color: "rgba(245,245,245,0.6)" }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
