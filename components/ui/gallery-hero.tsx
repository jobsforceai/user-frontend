"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SKETCHFAB_EMBED =
    "https://sketchfab.com/models/197701168a124b83a466cf96390935ed/embed" +
    "?autostart=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0" +
    "&ui_annotations=0&transparent=1&dnt=1&ui_ar=0&ui_help=0&ui_hint=0";

export function GalleryHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const modelWrapRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subheadingRef = useRef<HTMLParagraphElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);
    const [modelVisible, setModelVisible] = useState(false);

    /* Delay showing the iframe so the Sketchfab "click & hold" hint
       plays and auto-dismisses while the iframe is still invisible */
    useEffect(() => {
        const t = setTimeout(() => setModelVisible(true), 3500);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Fade-up entrance animations
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
            gsap.from(modelWrapRef.current, {
                scale: 0.92,
                opacity: 0,
                duration: 1.4,
                ease: "power3.out",
                delay: 0.1,
            });

            // Scroll-driven transition (glow + scale only)
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "40% top",
                    scrub: 1,
                    pin: false,
                },
            });

            // Glow around model
            tl.to(
                glowRef.current,
                {
                    opacity: 1,
                    scale: 1.1,
                    duration: 1,
                },
                0
            );

            // Slight scale on model
            tl.to(
                modelWrapRef.current,
                {
                    scale: 1.05,
                    duration: 1,
                },
                0
            );

            // Shadow softens
            tl.to(
                shadowRef.current,
                {
                    opacity: 0.35,
                    scaleX: 1.15,
                    duration: 1,
                },
                0
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden"
            style={{ backgroundColor: "#ffffff" }}
        >
            {/* Background */}
            <div
                className="absolute inset-0"
                style={{ backgroundColor: "#ffffff" }}
            />

            {/* Radial gradient behind model */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(circle at center 55%, rgba(0,0,0,0.05) 0%, transparent 60%)",
                }}
            />

            {/* Glow (hidden initially, appears on scroll) */}
            <div
                ref={glowRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] pointer-events-none"
                style={{
                    width: "min(70vw, 700px)",
                    height: "min(70vw, 700px)",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.05) 40%, transparent 70%)",
                    opacity: 0,
                    transform: "translate(-50%, -45%) scale(1)",
                }}
            />

            {/* ── TOP HEADING — centered above model ── */}
            <div
                ref={headingRef}
                className="absolute left-0 bottom-2 z-10 pointer-events-none"
            >
                <h1
                    className="select-none font-black uppercase text-left"
                    style={{
                        color: "#111111",
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

            {/* ── SUBHEADING — above bottom ── */}
            <div
                className="absolute bottom-2 right-0 z-10 flex flex-col items-center pointer-events-none"
            >
                <p
                    ref={subheadingRef}
                    className="max-w-lg text-right font-semibold select-none"
                    style={{
                        color: "#555555",
                        fontSize: "clamp(0.875rem, 1.5vw, 2.125rem)",
                        lineHeight: 1.6,
                        letterSpacing: "0.01em",
                    }}
                >
                    Invest in digital gold at live market prices.
                    <br />
                    Buy, save, and take delivery — all in one place.
                </p>

                {/* ── Accent line ── */}
            </div>

            {/* ── 3D MODEL (fullscreen) ── */}
            <div
                ref={modelWrapRef}
                className="absolute inset-0 z-[5]"
            >
                <div className="relative h-full w-full overflow-hidden">
                    <iframe
                        title="3D Atlas Model"
                        src="https://sketchfab.com/models/197701168a124b83a466cf96390935ed/embed?autostart=1&ui_controls=0&ui_infos=0&ui_stop=0&ui_watermark=0&ui_annotations=0&ui_hint=0&ui_settings=0&ui_vr=0&transparent=1&dnt=1"
                        className="pointer-events-none h-full w-full border-0"
                        style={{
                            border: "none",
                            background: "transparent",
                        }}
                        allow="autoplay; fullscreen; xr-spatial-tracking"
                        allowFullScreen
                    />
                </div>
            </div>

            {/* ── Shadow below model ── */}
            <div
                ref={shadowRef}
                className="absolute left-1/2 -translate-x-1/2 z-[4] pointer-events-none"
                style={{
                    bottom: "18%",
                    width: "min(50vw, 400px)",
                    height: "30px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(ellipse at center, rgba(0,0,0,0.18) 0%, transparent 70%)",
                    opacity: 0.2,
                }}
            />
        </section>
    );
}
