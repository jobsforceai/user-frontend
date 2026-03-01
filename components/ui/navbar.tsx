"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import gsap from "gsap";

interface NavbarProps {
  isLoggedIn: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY && y > 80) setHidden(true);
      else setHidden(false);
      lastY = y;

      // Update scroll progress bar
      if (progressRef.current) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? y / docHeight : 0;
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Navbar entrance animation */
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
      );
    }
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const navLinks = [
    { label: "About", id: "about" },
    { label: "Why Gold", id: "why-gold" },
    { label: "Market", id: "market" },
    { label: "Schemes", id: "schemes" },
  ];

  return (
    <>
      {/* Scroll progress bar */}
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ transform: "scaleX(0)" }}
      />

      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-700"
        style={{
          backgroundColor: scrolled ? "rgba(11,11,15,0.85)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(24px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(24px)" : "none",
          boxShadow: scrolled
            ? "0 1px 0 rgba(212,168,67,0.06), 0 4px 30px rgba(0,0,0,0.3)"
            : "none",
          transform: hidden && !mobileOpen ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        {/* Gold accent line at very top */}
        <div
          className="h-[1px] w-full transition-opacity duration-700"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.4) 50%, transparent 100%)",
            opacity: scrolled ? 1 : 0,
          }}
        />

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 lg:px-10">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SG Gold Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-cover rounded-sm transition-all duration-300 group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span
                className="text-[15px] font-bold tracking-tight leading-none transition-colors duration-500"
                style={{ color: scrolled ? "#f5f5f5" : "#f5f5f5" }}
              >
                SG Gold
              </span>
              <span
                className="text-[9px] font-medium uppercase tracking-[0.2em] leading-none mt-[2px] transition-colors duration-500"
                style={{ color: scrolled ? "rgba(212,168,67,0.6)" : "rgba(255,255,255,0.4)" }}
              >
                Digital Bullion
              </span>
            </div>
          </Link>

          {/* Center nav links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="relative px-4 py-2 text-[13px] font-medium tracking-wide transition-all duration-300 rounded-full group"
                style={{ color: "rgba(245,245,245,0.5)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#d4a843";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(245,245,245,0.5)";
                }}
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-0 group-hover:w-[60%] transition-all duration-300"
                  style={{ background: "#d4a843" }}
                />
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="magnetic-btn hidden md:inline-flex items-center gap-2 rounded-full px-6 py-2 text-[13px] font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                  color: "#0B0B0F",
                  boxShadow: "0 4px 20px rgba(212,168,67,0.3)",
                }}
              >
                Dashboard
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex px-4 py-2 text-[13px] font-medium transition-all duration-300 rounded-full"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a843")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(245,245,245,0.5)")}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="magnetic-btn hidden md:inline-flex items-center gap-2 rounded-full px-6 py-2 text-[13px] font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                    color: "#0B0B0F",
                    boxShadow: "0 4px 20px rgba(212,168,67,0.3)",
                  }}
                >
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full transition-colors"
              style={{ backgroundColor: mobileOpen ? "rgba(212,168,67,0.1)" : "transparent" }}
              aria-label="Menu"
            >
              <div className="w-[18px] flex flex-col gap-[5px]">
                <span
                  className="block h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#f5f5f5",
                    transform: mobileOpen ? "rotate(45deg) translate(2.3px, 2.3px)" : "none",
                  }}
                />
                <span
                  className="block h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#f5f5f5",
                    opacity: mobileOpen ? 0 : 1,
                    transform: mobileOpen ? "scaleX(0)" : "scaleX(1)",
                  }}
                />
                <span
                  className="block h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#f5f5f5",
                    transform: mobileOpen ? "rotate(-45deg) translate(2.3px, -2.3px)" : "none",
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile slide-down menu ── */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-500"
        style={{
          pointerEvents: mobileOpen ? "auto" : "none",
          opacity: mobileOpen ? 1 : 0,
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className="absolute top-0 left-0 right-0 pt-[72px] pb-8 px-6 transition-transform duration-500"
          style={{
            backgroundColor: "rgba(11,11,15,0.98)",
            backdropFilter: "blur(30px)",
            transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full text-left px-4 py-3.5 text-[15px] font-medium rounded-xl transition-all duration-300"
                style={{
                  color: "rgba(245,245,245,0.7)",
                  transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div
            className="h-[1px] my-4"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }}
          />

          <div className="flex flex-col gap-2 px-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold"
                style={{
                  background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                  color: "#0B0B0F",
                }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold"
                  style={{
                    background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                    color: "#0B0B0F",
                  }}
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-3 text-[14px] font-medium rounded-full"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
