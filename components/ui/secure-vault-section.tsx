"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "99.9% Pure Gold",
    desc: "Internationally certified, hallmarked purity.",
    path: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Insured Storage",
    desc: "Your holdings are fully insured against loss.",
    path: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    title: "Fully Redeemable",
    desc: "Convert to physical gold at any partnered store.",
    path: "M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9",
  },
  {
    title: "Transparent Pricing",
    desc: "Live rates, no hidden charges, clear breakdowns.",
    path: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  },
];

export function SecureVaultSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(SVGSVGElement | null)[]>([]);
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

      /* ── Vault image parallax + scale reveal ── */
      if (vaultRef.current) {
        gsap.fromTo(vaultRef.current,
          { opacity: 0, scale: 1.12, filter: "blur(8px)" },
          {
            opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 68%" },
          }
        );
        gsap.to(vaultRef.current, {
          y: -40,
          scrollTrigger: { trigger: vaultRef.current, start: "top 80%", end: "bottom 20%", scrub: 0.6 },
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

      /* ── Feature items stagger ── */
      const validFeatures = featureRefs.current.filter(Boolean) as HTMLDivElement[];
      gsap.fromTo(validFeatures,
        { x: 40, opacity: 0, filter: "blur(4px)" },
        {
          x: 0, opacity: 1, filter: "blur(0px)",
          duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
        }
      );

      /* ── Icon stroke draw ── */
      iconRefs.current.forEach((svg, i) => {
        if (!svg) return;
        const paths = svg.querySelectorAll("path");
        paths.forEach((p) => {
          const length = p.getTotalLength();
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(p, {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.out",
            delay: i * 0.15,
            scrollTrigger: { trigger: sectionRef.current, start: "top 55%" },
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0F" }}
    >
      <div ref={dividerRef} className="section-divider" />

      {/* Metal texture bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.01) 0%, transparent 50%),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.008) 0px,
              rgba(255,255,255,0.008) 1px,
              transparent 1px,
              transparent 3px
            )
          `,
        }}
      />

      {/* Spotlight */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "20%",
          top: "30%",
          width: "40%",
          height: "40%",
          background: "radial-gradient(circle, rgba(212,168,67,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — Vault illustration */}
          <div ref={vaultRef} className="flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <Image
                src="/vault2.png"
                alt="About SG Gold"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-2xl"
                style={{ filter: "brightness(0.9) contrast(1.05)" }}
                priority
              />
              {/* Gold glow behind image */}
              <div
                className="absolute -inset-8 -z-10 rounded-3xl"
                style={{
                  background: "radial-gradient(circle at center, rgba(212,168,67,0.05) 0%, transparent 60%)",
                }}
              />
            </div>
          </div>

          {/* Right — Content */}
          <div>
            <div ref={headingRef}>
              <p
                className="mb-5 text-xs font-semibold uppercase tracking-[0.4em]"
                style={{ color: "#d4a843" }}
              >
                Security
              </p>
              <h2
                className="font-black uppercase leading-[0.92]"
                style={{
                  color: "#f5f5f5",
                  fontSize: "clamp(2rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                <span className="split-line">
                  <span className="split-line-inner">Stored. Insured.</span>
                </span>
                <span className="split-line">
                  <span className="split-line-inner gold-text">Protected.</span>
                </span>
              </h2>
            </div>

            {/* Feature bullets */}
            <div className="mt-12 space-y-7">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  ref={(el) => { featureRefs.current[i] = el; }}
                  className="glass-card border-glow flex items-start gap-4 rounded-xl p-4"
                >
                  <div
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ background: "rgba(212,168,67,0.08)" }}
                  >
                    <svg
                      ref={(el) => { iconRefs.current[i] = el; }}
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="#d4a843"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.path} />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: "#f5f5f5" }}>
                      {f.title}
                    </h4>
                    <p className="mt-1 text-sm" style={{ color: "rgba(245,245,245,0.5)" }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
