"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const bustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Gold accent line grows
      gsap.from(lineRef.current, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      // Text reveals line by line
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      });

      // Bust fade in + parallax
      gsap.from(bustRef.current, {
        opacity: 0,
        x: 60,
        duration: 1.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
      });

      gsap.to(bustRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addRef = (i: number) => (el: HTMLElement | null) => {
    textRefs.current[i] = el;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "#0B0B0F" }}
    >
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        <div className="grid items-center gap-10 sm:gap-16 lg:grid-cols-2">
          {/* Left — Text with gold accent line */}
          <div className="relative flex gap-6 md:gap-8">
            {/* Vertical gold line */}
            {/* <div
              ref={lineRef}
              className="hidden shrink-0 md:block"
              style={{
                width: "2px",
                background: "linear-gradient(180deg, #d4a843 0%, #b8860b 50%, rgba(212,168,67,0.1) 100%)",
                minHeight: "100%",
              }}
            /> */}

            <div className="space-y-8">
              {/* Headline */}
              <h2
                ref={addRef(0)}
                className="font-black uppercase leading-[0.95]"
                style={{
                  color: "#f5f5f5",
                  fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                Value Is Revealed
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #d4a843, #f0d78c, #b8860b)",
                  }}
                >
                  Under Pressure.
                </span>
              </h2>

              {/* Subheading */}
              <p
                ref={addRef(1)}
                className="max-w-md text-lg leading-relaxed"
                style={{ color: "rgba(245,245,245,0.65)" }}
              >
                Gold has endured empires, wars, currencies and time.
                We simply made it digital.
              </p>

              {/* Body paragraphs */}
              <div className="space-y-5">
                <p
                  ref={addRef(2)}
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ color: "rgba(245,245,245,0.6)" }}
                >
                  <span className="font-semibold" style={{ color: "#d4a843" }}>Discipline</span> —
                  Wealth is not built in a day. It is built in the daily act of choosing what endures
                  over what entertains.
                </p>
                <p
                  ref={addRef(3)}
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ color: "rgba(245,245,245,0.6)" }}
                >
                  <span className="font-semibold" style={{ color: "#d4a843" }}>Real Assets</span> —
                  In a world of infinite printing, gold remains finite. 197,576 tonnes above ground.
                  Not a token. Not a promise. Metal.
                </p>
                <p
                  ref={addRef(4)}
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ color: "rgba(245,245,245,0.6)" }}
                >
                  <span className="font-semibold" style={{ color: "#d4a843" }}>Long-Term Wealth</span> —
                  Gold has averaged 10% annual returns over the past 20 years. Quietly. Without noise.
                </p>
                <p
                  ref={addRef(5)}
                  className="max-w-md text-[15px] leading-relaxed"
                  style={{ color: "rgba(245,245,245,0.6)" }}
                >
                  <span className="font-semibold" style={{ color: "#d4a843" }}>Physical Redemption</span> —
                  Your digital gold can become a coin in your hand. Walk into any of our stores
                  and take it home.
                </p>
              </div>
            </div>
          </div>

          {/* Right — About image */}
          <div ref={bustRef} className="relative flex items-center justify-center">
            {/* Gold glow behind */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(212,168,67,0.1) 0%, transparent 65%)",
              }}
            />

            <div className="relative w-full max-w-md">
             

              <Image
                src="/about.png"
                alt="About SG Gold"
                width={400}
                height={500}
                className="w-full h-auto object-cover rounded-sm"
                style={{
                  filter: "brightness(0.9) contrast(1.05)",
                }}
                priority
              />

             
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
