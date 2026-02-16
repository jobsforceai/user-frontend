"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface NavbarProps {
  isLoggedIn: boolean;
}

export function Navbar({ isLoggedIn }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY && y > 80) setHidden(true);   // scrolling down
      else setHidden(false);                        // scrolling up
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

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
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.92)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(20px)" : "none",
          boxShadow: scrolled
            ? "0 1px 0 rgba(0,0,0,0.04), 0 4px 20px rgba(0,0,0,0.03)"
            : "none",
          transform: hidden && !mobileOpen ? "translateY(-100%)" : "translateY(0)",
        }}
      >
        {/* Gold accent line at very top */}
        <div
          className="h-[1px] w-full transition-opacity duration-500"
          style={{
            background: "linear-gradient(90deg, transparent 0%, #d4a843 50%, transparent 100%)",
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
              className="w-8 h-8 object-cover rounded-sm group-hover:brightness-110 transition-all duration-200"
            />
            <div className="flex flex-col">
              <span
                className="text-[15px] font-bold tracking-tight leading-none"
                style={{ color: "#111" }}
              >
                SG Gold
              </span>
              <span
                className="text-[9px] font-medium uppercase tracking-[0.2em] leading-none mt-[2px]"
                style={{ color: "#999" }}
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
                className="relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors duration-200 rounded-full"
                style={{ color: "#555" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#111";
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#555";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-2 rounded-full px-6 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                  boxShadow: "0 2px 12px rgba(212,168,67,0.25)",
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
                  className="hidden md:inline-flex px-4 py-2 text-[13px] font-medium transition-colors duration-200 rounded-full"
                  style={{ color: "#555" }}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex items-center gap-2 rounded-full px-6 py-2 text-[13px] font-semibold text-white transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                    boxShadow: "0 2px 12px rgba(212,168,67,0.25)",
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
              style={{ backgroundColor: mobileOpen ? "rgba(0,0,0,0.06)" : "transparent" }}
              aria-label="Menu"
            >
              <div className="w-[18px] flex flex-col gap-[5px]">
                <span
                  className="block h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#111",
                    transform: mobileOpen ? "rotate(45deg) translate(2.3px, 2.3px)" : "none",
                  }}
                />
                <span
                  className="block h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#111",
                    opacity: mobileOpen ? 0 : 1,
                    transform: mobileOpen ? "scaleX(0)" : "scaleX(1)",
                  }}
                />
                <span
                  className="block h-[1.5px] rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#111",
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
        className="fixed inset-0 z-40 md:hidden transition-all duration-400"
        style={{
          pointerEvents: mobileOpen ? "auto" : "none",
          opacity: mobileOpen ? 1 : 0,
        }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className="absolute top-0 left-0 right-0 pt-[72px] pb-8 px-6 transition-transform duration-400"
          style={{
            backgroundColor: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(30px)",
            transform: mobileOpen ? "translateY(0)" : "translateY(-100%)",
          }}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="w-full text-left px-4 py-3.5 text-[15px] font-medium rounded-xl transition-colors"
                style={{ color: "#222" }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div
            className="h-[1px] my-4"
            style={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)" }}
          />

          <div className="flex flex-col gap-2 px-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                }}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full py-3 text-[14px] font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                  }}
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center py-3 text-[14px] font-medium rounded-full"
                  style={{ color: "#555" }}
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
