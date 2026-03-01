"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const bustRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── Horizontal marquee headline ── */
      const headlineChars = headlineRef.current?.querySelectorAll(".char");
      if (headlineChars) {
        gsap.fromTo(
          headlineChars,
          { y: 80, opacity: 0, rotateX: -90 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.03,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );
      }

      /* ── Text reveals with stagger ── */
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 50, opacity: 0, filter: "blur(4px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
          }
        );
      });

      /* ── Image parallax + reveal ── */
      const bustEl = bustRef.current;
      if (bustEl) {
        gsap.fromTo(
          bustEl,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );

        gsap.to(bustEl, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }

      /* ── Section divider line draw ── */
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left",
            duration: 1.5,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: dividerRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addRef = (i: number) => (el: HTMLElement | null) => {
    textRefs.current[i] = el;
  };

  /* Split text into spans for char animation */
  const splitText = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char inline-block"
        style={{ perspective: "500px" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0F" }}
    >
      {/* Top section divider */}
      <div ref={dividerRef} className="section-divider" />

      <div className="mx-auto max-w-7xl px-5 py-28 md:px-8 md:py-40">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Left — Text */}
          <div className="space-y-10">
            {/* Eyebrow */}
            <p
              ref={addRef(0)}
              className="text-xs font-semibold uppercase tracking-[0.4em]"
              style={{ color: "#d4a843" }}
            >
              About SG Gold
            </p>

            {/* Headline with char animation */}
            <h2
              ref={headlineRef}
              className="font-black text-nowrap uppercase leading-[0.92]"
              style={{
                color: "#f5f5f5",
                fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.03em",
              }}
            >
              <span className="block">{splitText("Value Is Revealed")}</span>
              <span className="block">{splitText("Under Pressure.")}</span>
            </h2>

            {/* Subheading */}
            <p
              ref={addRef(1)}
              className="max-w-md text-lg leading-relaxed"
              style={{ color: "rgba(245,245,245,0.6)" }}
            >
              Gold has endured empires, wars, currencies and time.
              We simply made it digital.
            </p>

            {/* Body paragraphs — glass card style */}
            <div className="space-y-4">
              {[
                { label: "Discipline", text: "Wealth is not built in a day. It is built in the daily act of choosing what endures over what entertains." },
                { label: "Real Assets", text: "In a world of infinite printing, gold remains finite. 197,576 tonnes above ground. Not a token. Not a promise. Metal." },
                { label: "Long-Term Wealth", text: "Gold has averaged 10% annual returns over the past 20 years. Quietly. Without noise." },
                { label: "Physical Redemption", text: "Your digital gold can become a coin in your hand. Walk into any of our stores and take it home." },
              ].map((item, i) => (
                <div
                  key={item.label}
                  ref={addRef(i + 2)}
                  className="glass-card rounded-xl p-5 border-glow"
                >
                  <p className="text-[15px] leading-relaxed" style={{ color: "rgba(245,245,245,0.6)" }}>
                    <span className="font-semibold" style={{ color: "#d4a843" }}>{item.label}</span>
                    {" — "}{item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Image with reveal mask */}
          <div ref={bustRef} className="relative flex items-center justify-center">
            {/* Gold glow behind */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,168,67,0.08) 0%, transparent 65%)",
              }}
            />

            <div className="relative w-full max-w-md overflow-hidden rounded-2xl">
              <Image
                src="/about.png"
                alt="About SG Gold"
                width={400}
                height={500}
                className="w-full h-auto object-cover"
                style={{
                  filter: "brightness(0.85) contrast(1.08)",
                }}
                priority
              />

              {/* Gradient overlay on image bottom */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, #0B0B0F 0%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
