"use client";

import Link from "next/link";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const quickLinks = [
    { label: "Buy Gold", href: "/buy" },
    { label: "Sell Gold", href: "/sell" },
    { label: "Savings Scheme", href: "/scheme/enroll" },
    { label: "Request Delivery", href: "/delivery" },
    { label: "Dashboard", href: "/dashboard" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#about" },
    { label: "Why Gold", href: "#why-gold" },
    { label: "Live Rates", href: "#market" },
    { label: "Business", href: "#business" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
  ];

  return (
    <footer
      ref={footerRef}
      style={{ backgroundColor: "#0B0B0F" }}
    >
      {/* Gold accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.08) 20%, #d4a843 50%, rgba(212,168,67,0.08) 80%, transparent 100%)",
        }}
      />

      <div ref={contentRef} className="mx-auto max-w-7xl px-5 md:px-8 lg:px-10">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-12 pt-16 pb-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden"
                style={{
                  boxShadow: "0 4px 20px rgba(212,168,67,0.2)",
                }}
              >
                <img src="/logo.png" alt="SG Gold" className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-[16px] font-bold tracking-tight leading-none"
                  style={{ color: "#f5f5f5" }}
                >
                  SG Gold
                </span>
                <span
                  className="text-[9px] font-medium uppercase tracking-[0.2em] leading-none mt-[3px]"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  Digital Bullion
                </span>
              </div>
            </div>

            <p
              className="mt-5 max-w-xs text-[14px] leading-relaxed"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Invest in digital gold at live market prices. Buy, save, and take
              delivery — all secured in insured vaults.
            </p>

            {/* Social icons */}
            <div className="mt-7 flex items-center gap-4">
              {[
                {
                  label: "Twitter",
                  path: "M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.32 3.91A12.16 12.16 0 013.16 4.86a4.28 4.28 0 001.33 5.72 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.27 4.27 0 01-1.93.07 4.29 4.29 0 004 2.98A8.59 8.59 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2l-.01-.56A8.72 8.72 0 0024 6.56a8.49 8.49 0 01-2.54.7z",
                },
                {
                  label: "Instagram",
                  path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.44.41.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.17.47.36 1.27.41 2.44.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.41 2.44a4.07 4.07 0 01-.98 1.51c-.46.46-.9.74-1.51.98-.47.17-1.27.36-2.44.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.44-.41a4.07 4.07 0 01-1.51-.98 4.07 4.07 0 01-.98-1.51c-.17-.47-.36-1.27-.41-2.44C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.41-2.44.24-.61.52-1.05.98-1.51a4.07 4.07 0 011.51-.98c.47-.17 1.27-.36 2.44-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.77 5.77 0 00-2.09 1.36A5.77 5.77 0 00.63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.36 2.09a5.77 5.77 0 002.09 1.36c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.77 5.77 0 002.09-1.36 5.77 5.77 0 001.36-2.09c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.77 5.77 0 00-1.36-2.09A5.77 5.77 0 0019.86.63C19.1.33 18.22.13 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z",
                },
                {
                  label: "LinkedIn",
                  path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05a3.74 3.74 0 013.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="group flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,168,67,0.4)";
                    e.currentTarget.style.backgroundColor = "rgba(212,168,67,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                    className="group-hover:text-[#d4a843] transition-colors duration-300"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a843")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[14px] transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a843")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Contact */}
          <div className="lg:col-span-2">
            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mb-5"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Legal
            </h4>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors duration-200"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a843")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4
              className="text-[11px] font-semibold uppercase tracking-[0.2em] mt-8 mb-3"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Contact
            </h4>
            <a
              href="mailto:support@sggold.in"
              className="text-[14px] transition-colors duration-200"
              style={{ color: "rgba(255,255,255,0.5)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d4a843")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >
              support@sggold.in
            </a>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-7 md:flex-row">
          <p
            className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            &copy; {new Date().getFullYear()} SG Gold. All rights reserved.
          </p>

          <div
            className="flex flex-wrap items-center gap-2 text-[11px]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <span>Prices sourced from global bullion markets</span>
            <span style={{ color: "rgba(255,255,255,0.1)" }}>•</span>
            <span>Secured with 256-bit encryption</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
