"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Frame sequence config ── */
const FRAME_COUNT = 240;
const frameUrl = (i: number) =>
  `/bg/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

export function GalleryHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);

  /* ── Draw a frame on the canvas, covering it like object-fit:cover ── */
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }, []);

  useEffect(() => {
    /* ── Pre-load all frames ── */
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = frameUrl(i);
      img.onload = () => {
        if (i === 1) renderFrame(0);
      };
      images.push(img);
    }
    imagesRef.current = images;

    /* ── Resize handler ── */
    const handleResize = () => renderFrame(currentFrameRef.current);
    window.addEventListener("resize", handleResize);

    /* ── GSAP context ── */
    const ctx = gsap.context(() => {
      /* ── Cinematic staggered text reveal ── */
      const headingLines = headingRef.current?.querySelectorAll(".split-line-inner");
      if (headingLines) {
        gsap.fromTo(
          headingLines,
          { y: "110%", skewY: 5 },
          {
            y: "0%",
            skewY: 0,
            duration: 1.4,
            ease: "power4.out",
            stagger: 0.12,
            delay: 0.5,
          }
        );
      }

      /* Subheading blurred fade-in */
      gsap.fromTo(
        subheadingRef.current,
        { y: 40, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          delay: 1.2,
        }
      );

      /* Scroll indicator bounce */
      gsap.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, delay: 2 }
      );
      gsap.to(scrollIndicatorRef.current, {
        y: 8,
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2.5,
      });

      /* ── Scroll-driven frame sequence ── */
      const frameObj = { frame: 0 };

      gsap.to(frameObj, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.15,
        },
        onUpdate: () => {
          const idx = Math.round(frameObj.frame);
          if (idx !== currentFrameRef.current) {
            currentFrameRef.current = idx;
            renderFrame(idx);
          }
        },
      });

      /* ── Parallax text as you scroll ── */
      gsap.to(headingRef.current, {
        y: -120,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });

      gsap.to(subheadingRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "25% top",
          scrub: true,
        },
      });

      /* ── Overlay darken on scroll ── */
      gsap.to(overlayRef.current, {
        opacity: 0.7,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      /* Hide scroll indicator on scroll */
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "5% top",
          end: "10% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", handleResize);
    };
  }, [renderFrame]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-bg"
      style={{ height: "500vh" }}
    >
      {/* ── Pinned viewport wrapper ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* ── Canvas background ── */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full"
        />

        {/* Dynamic dark overlay */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
        />

        {/* Film grain overlay */}
        <div className="grain-overlay absolute inset-0 z-[2] pointer-events-none" />

        {/* ── Centered content ── */}
        <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center px-6">
          {/* ── HEADING with split-line reveal ── */}
          <div ref={headingRef} className="text-center">
            <h1
              className="select-none font-black uppercase"
              style={{
                color: "#f5f5f5",
                fontSize: "clamp(3rem, 9vw, 9rem)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
              }}
            >
              <span className="split-line">
                <span className="split-line-inner">Gold</span>
              </span>
              <span className="split-line">
                <span className="split-line-inner">Demands</span>
              </span>
              <span className="split-line">
                <span
                  className="split-line-inner gold-text"
                  style={{ display: "inline-block" }}
                >
                  Strength.
                </span>
              </span>
            </h1>
          </div>

          {/* ── SUBHEADING ── */}
          <p
            ref={subheadingRef}
            className="mt-6 max-w-lg text-center font-medium select-none"
            style={{
              color: "rgba(245,245,245,0.5)",
              fontSize: "clamp(0.875rem, 1.5vw, 1.25rem)",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
              opacity: 0,
            }}
          >
            Invest in digital gold at live market prices.
            <br />
            Buy, save, and take delivery — all in one place.
          </p>
        </div>

        {/* ── Scroll indicator ── */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[10] flex flex-col items-center gap-2"
          style={{ opacity: 0 }}
        >
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: "rgba(245,245,245,0.4)" }}
          >
            Scroll
          </span>
          <div
            className="h-10 w-[1px]"
            style={{
              background: "linear-gradient(180deg, rgba(212,168,67,0.6) 0%, transparent 100%)",
            }}
          />
        </div>

        {/* ── Vignette ── */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>
    </section>
  );
}
