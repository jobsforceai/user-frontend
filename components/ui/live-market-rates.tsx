"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { HistoricalChart } from "@/components/ui/historical-chart";
import { formatCurrency } from "@/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Currency, Metal, Range } from "@/actions/assets";
import { getLivePrices } from "@/actions/assets";

gsap.registerPlugin(ScrollTrigger);

// Custom hook to track previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const ranges: Array<{ key: Range; label: string }> = [
  { key: "1D", label: "Today" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "1Y", label: "1Y" },
  { key: "5Y", label: "5Y" },
];

interface LiveMarketRatesProps {
  metal: Metal;
  currency: Currency;
  range: Range;
  purity: string;
  purityFactor: number;
  goldPerGram: number;
  silverPerGram: number;
  isGoldUp: boolean;
  isSilverUp: boolean;
  goldChangePercent: number;
  silverChangePercent: number;
  accentColor: string;
  convertedHistoryData: Array<{ time: string; price: number }>;
  buyHref: string;
  sellHref: string;
}

export function LiveMarketRates({
  metal,
  currency,
  range,
  purity,
  purityFactor,
  goldPerGram: initialGoldPerGram,
  silverPerGram: initialSilverPerGram,
  isGoldUp,
  isSilverUp,
  goldChangePercent,
  silverChangePercent,
  accentColor,
  convertedHistoryData,
  buyHref,
  sellHref,
}: LiveMarketRatesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const pricesRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Live price state
  const [goldPerGram, setGoldPerGram] = useState(initialGoldPerGram);
  const [silverPerGram, setSilverPerGram] = useState(initialSilverPerGram);
  const [liveGoldChange, setLiveGoldChange] = useState(0);
  const [liveSilverChange, setLiveSilverChange] = useState(0);

  // Track previous prices for color transitions
  const prevGoldPrice = usePrevious(goldPerGram);
  const prevSilverPrice = usePrevious(silverPerGram);

  // Determine color based on price change
  const goldPriceColor = prevGoldPrice !== undefined && goldPerGram > prevGoldPrice
    ? "#10b981" // green
    : prevGoldPrice !== undefined && goldPerGram < prevGoldPrice
    ? "#ef4444" // red
    : "#d4a843"; // default gold

  const silverPriceColor = prevSilverPrice !== undefined && silverPerGram > prevSilverPrice
    ? "#10b981" // green
    : prevSilverPrice !== undefined && silverPerGram < prevSilverPrice
    ? "#ef4444" // red
    : "#9ca3af"; // default silver

  // Live price updates
  useEffect(() => {
    const updatePrices = async () => {
      try {
        const livePrices = await getLivePrices(currency, goldPerGram, silverPerGram);
        setGoldPerGram(livePrices.goldPerGram);
        setSilverPerGram(livePrices.silverPerGram);
        setLiveGoldChange(livePrices.goldChange);
        setLiveSilverChange(livePrices.silverChange);
      } catch (error) {
        console.error("Failed to update live prices:", error);
      }
    };

    // Update prices every 3 seconds
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, [currency, goldPerGram, silverPerGram]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 40, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      });
      gsap.from(pricesRef.current, {
        y: 30, opacity: 0, duration: 0.9, delay: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      });
      gsap.from(chartRef.current, {
        y: 30, opacity: 0, duration: 0.9, delay: 0.3, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const goldPrice = goldPerGram * purityFactor;
  const silverPrice = silverPerGram;
  
  // Calculate cumulative change
  const isLiveGoldUp = liveGoldChange >= 0;
  const isLiveSilverUp = liveSilverChange >= 0;

  return (
    <section id="market" ref={sectionRef} style={{ backgroundColor: "#0B0B0F" }}>
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">

        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            {/* <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> */}
            <span
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "#d4a843" }}
            >
              Live Prices
            </span>
          </div>
          <h2
            className="font-black uppercase leading-[0.92]"
            style={{
              color: "#f5f5f5",
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Track.{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #d4a843, #f0d78c, #b8860b)" }}
            >
              Trade.
            </span>
          </h2>
        </div>

        {/* ── Side-by-side price blocks ── */}
        <div
          ref={pricesRef}
          className="mb-14 grid gap-px md:grid-cols-2"
          style={{ background: "rgba(255,255,255,0.04)", borderRadius: "20px", overflow: "hidden" }}
        >
          {/* Gold */}
          <div className="flex flex-col justify-between p-8 md:p-10" style={{ background: "#0B0B0F" }}>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                >
                  Gold &middot; {purity}
                </span>
              </div>
              <p
                className="mt-3 font-black transition-colors duration-700 ease-in-out"
                style={{ 
                  fontSize: "clamp(2.2rem, 5vw, 3.5rem)", 
                  lineHeight: 1, 
                  color: goldPriceColor 
                }}
              >
                {formatCurrency(goldPrice, currency)}
                <span className="text-lg font-normal" style={{ color: "rgba(245,245,245,0.35)" }}>
                  /g
                </span>
              </p>
              <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${isLiveGoldUp ? "text-emerald-400" : "text-red-400"}`}>
                {isLiveGoldUp ? "▲" : "▼"} {Math.abs(liveGoldChange).toFixed(2)}% live
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                href={buyHref}
                className="rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:brightness-110"
                style={{ background: "#d4a843", color: "#0B0B0F" }}
              >
                Buy Gold
              </Link>
              <Link
                href={sellHref}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300"
                style={{ border: "1px solid rgba(212,168,67,0.25)", color: "#d4a843" }}
              >
                Sell
              </Link>
            </div>
          </div>

          {/* Silver */}
          <div className="flex flex-col justify-between p-8 md:p-10" style={{ background: "#0B0B0F" }}>
            <div>
              <div className="mb-1 flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span
                  className="text-sm font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,245,245,0.5)" }}
                >
                  Silver &middot; 999
                </span>
              </div>
              <p
                className="mt-3 font-black transition-colors duration-700 ease-in-out"
                style={{ 
                  fontSize: "clamp(2.2rem, 5vw, 3.5rem)", 
                  lineHeight: 1, 
                  color: silverPriceColor 
                }}
              >
                {formatCurrency(silverPrice, currency)}
                <span className="text-lg font-normal" style={{ color: "rgba(245,245,245,0.35)" }}>
                  /g
                </span>
              </p>
              <p className={`mt-2 text-sm font-semibold transition-colors duration-300 ${isLiveSilverUp ? "text-emerald-400" : "text-red-400"}`}>
                {isLiveSilverUp ? "▲" : "▼"} {Math.abs(liveSilverChange).toFixed(2)}% live
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                href={buyHref}
                className="rounded-lg px-6 py-2.5 text-sm font-bold transition-all duration-300 hover:brightness-110"
                style={{ background: "#9ca3af", color: "#0B0B0F" }}
              >
                Buy Silver
              </Link>
              <Link
                href={sellHref}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300"
                style={{ border: "1px solid rgba(156,163,175,0.25)", color: "#9ca3af" }}
              >
                Sell
              </Link>
            </div>
          </div>
        </div>

        {/* ── Chart ── */}
        <div ref={chartRef}>
          {/* Metal + Range controls */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div
              className="flex gap-1 rounded-xl p-1"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <Link
                scroll={false}
                href={`/?metal=gold&currency=${currency}&range=${range}&purity=${purity}`}
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-300"
                style={
                  metal === "gold"
                    ? { background: "rgba(212,168,67,0.12)", color: "#d4a843" }
                    : { color: "rgba(245,245,245,0.4)" }
                }
              >
                Gold
              </Link>
              <Link
                scroll={false}
                href={`/?metal=silver&currency=${currency}&range=${range}`}
                className="rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-300"
                style={
                  metal === "silver"
                    ? { background: "rgba(156,163,175,0.12)", color: "#9ca3af" }
                    : { color: "rgba(245,245,245,0.4)" }
                }
              >
                Silver
              </Link>
            </div>

            <div className="flex flex-wrap gap-1">
              {ranges.map((r) => (
                <Link
                  scroll={false}
                  key={r.key}
                  href={`/?metal=${metal}&currency=${currency}&range=${r.key}&purity=${purity}`}
                  className="rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all duration-300"
                  style={
                    range === r.key
                      ? {
                          background: metal === "gold" ? "rgba(212,168,67,0.12)" : "rgba(156,163,175,0.12)",
                          color: metal === "gold" ? "#d4a843" : "#9ca3af",
                        }
                      : { color: "rgba(245,245,245,0.4)" }
                  }
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Chart container */}
          <div
            className="rounded-2xl p-4 md:p-6"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="h-72 w-full md:h-96">
              <HistoricalChart
                title=""
                currency={currency}
                color={accentColor}
                range={range}
                data={convertedHistoryData}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
