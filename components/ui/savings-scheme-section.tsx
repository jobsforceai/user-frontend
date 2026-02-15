"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const slabs = [5000, 10000, 25000, 50000, 100000];
const formatINR = (n: number) => n.toLocaleString("en-IN");

export function SavingsSchemeSection({ authHref }: { authHref: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  const [monthly, setMonthly] = useState(10000);
  const [animatedBonus, setAnimatedBonus] = useState(20000);

  const bonus = monthly * 2;
  const total11 = monthly * 11;

  // Animate bonus number counting up
  useEffect(() => {
    const obj = { val: animatedBonus };
    gsap.to(obj, {
      val: bonus,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => setAnimatedBonus(Math.round(obj.val)),
    });
  }, [bonus]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.from(sliderRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const slabIndex = slabs.indexOf(monthly);
  const barCount = slabIndex + 1;

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value);
    setMonthly(slabs[idx]);
  }, []);

  return (
    <section
      id="schemes"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0F" }}
    >
      {/* Subtle top gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.15), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 py-24 md:px-8 md:py-36">
        {/* Heading */}
        <div ref={headingRef} className="mb-16 text-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: "#d4a843" }}
          >
            Savings Scheme
          </p>
          <h2
            className="font-black uppercase leading-[0.92]"
            style={{
              color: "#f5f5f5",
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Discipline Builds
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(135deg, #d4a843, #f0d78c, #b8860b)",
              }}
            >
              Wealth.
            </span>
          </h2>
          <p
            className="mx-auto mt-5 max-w-lg text-base"
            style={{ color: "rgba(245,245,245,0.6)" }}
          >
            Save for 11 months. Unlock your reward in month 12.
          </p>
        </div>

        {/* Interactive area */}
        <div ref={sliderRef} className="mx-auto max-w-2xl">
          {/* Slider */}
          <div className="mb-10">
            <p
              className="mb-3 text-center text-sm font-medium"
              style={{ color: "rgba(245,245,245,0.6)" }}
            >
              Monthly Amount
            </p>
            <p
              className="mb-6 text-center font-black"
              style={{
                color: "#d4a843",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              ₹{formatINR(monthly)}
            </p>
            <input
              type="range"
              min={0}
              max={slabs.length - 1}
              step={1}
              value={slabIndex}
              onChange={handleSlider}
              className="scheme-slider w-full"
            />
            <div className="mt-2 flex justify-between text-[11px] uppercase tracking-widest" style={{ color: "rgba(245,245,245,0.4)" }}>
              <span>₹5K</span>
              <span>₹10K</span>
              <span>₹25K</span>
              <span>₹50K</span>
              <span>₹1L</span>
            </div>
          </div>

          {/* Gold bars visual */}
          <div ref={barsRef} className="mb-10 flex items-end justify-center gap-2 h-32">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-sm transition-all duration-500"
                style={{
                  width: "clamp(24px, 5vw, 40px)",
                  height: i < barCount ? `${40 + i * 18}px` : "8px",
                  background: i < barCount
                    ? "linear-gradient(180deg, #f0d78c 0%, #d4a843 40%, #b8860b 100%)"
                    : "rgba(255,255,255,0.04)",
                  boxShadow: i < barCount ? "0 4px 20px rgba(212,168,67,0.15)" : "none",
                  opacity: i < barCount ? 1 : 0.3,
                }}
              />
            ))}
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 divide-x rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="text-center px-4">
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(245,245,245,0.5)" }}>
                11-Month Total
              </p>
              <p className="mt-2 text-xl font-bold" style={{ color: "#f5f5f5" }}>
                ₹{formatINR(total11)}
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(245,245,245,0.5)" }}>
                12th Month Bonus
              </p>
              <p
                className="mt-2 text-xl font-bold"
                style={{
                  backgroundImage: "linear-gradient(90deg, #34d399, #6ee7b7)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ₹{formatINR(animatedBonus)}
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "rgba(245,245,245,0.5)" }}>
                Multiplier
              </p>
              <p className="mt-2 text-xl font-bold" style={{ color: "#d4a843" }}>
                2.0x
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
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
              Start a Scheme
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
