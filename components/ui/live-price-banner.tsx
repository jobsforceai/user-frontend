"use client";

import { useRef, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Currency } from "@/actions/assets";
import { getLivePrices } from "@/actions/assets";

// Custom hook to track previous value
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

interface LivePriceBannerProps {
  currency: Currency;
  initialGoldPerGram: number;
  initialSilverPerGram: number;
  purityFactor: number;
  purity: string;
}

export function LivePriceBanner({
  currency,
  initialGoldPerGram,
  initialSilverPerGram,
  purityFactor,
  purity,
}: LivePriceBannerProps) {
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

  const goldPrice = goldPerGram * purityFactor;
  const silverPrice = silverPerGram;
  
  const isLiveGoldUp = liveGoldChange >= 0;
  const isLiveSilverUp = liveSilverChange >= 0;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-md"
      style={{ 
        backgroundColor: "rgba(11, 11, 15, 0.95)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 -4px 24px rgba(0, 0, 0, 0.4)"
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {/* Left side - Live indicator */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span 
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(245,245,245,0.5)" }}
            >
              Live
            </span>
          </div>

          {/* Center - Prices */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Gold */}
            <div className="flex items-center gap-3">
              <span 
                className="text-xs font-medium uppercase tracking-wider hidden sm:inline"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                Gold · {purity}
              </span>
              <span 
                className="text-xs font-medium uppercase tracking-wider sm:hidden"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                Au
              </span>
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-lg font-bold transition-colors duration-700 ease-in-out"
                  style={{ color: goldPriceColor }}
                >
                  {formatCurrency(goldPrice, currency)}
                </span>
                <span className="text-xs font-medium" style={{ color: "rgba(245,245,245,0.3)" }}>
                  /g
                </span>
                <span 
                  className={`text-xs font-semibold transition-colors duration-300 ${isLiveGoldUp ? "text-emerald-400" : "text-red-400"}`}
                >
                  {isLiveGoldUp ? "▲" : "▼"} {Math.abs(liveGoldChange).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-8 w-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

            {/* Silver */}
            <div className="flex items-center gap-3">
              <span 
                className="text-xs font-medium uppercase tracking-wider hidden sm:inline"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                Silver · 999
              </span>
              <span 
                className="text-xs font-medium uppercase tracking-wider sm:hidden"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                Ag
              </span>
              <div className="flex items-baseline gap-2">
                <span 
                  className="text-lg font-bold transition-colors duration-700 ease-in-out"
                  style={{ color: silverPriceColor }}
                >
                  {formatCurrency(silverPrice, currency)}
                </span>
                <span className="text-xs font-medium" style={{ color: "rgba(245,245,245,0.3)" }}>
                  /g
                </span>
                <span 
                  className={`text-xs font-semibold transition-colors duration-300 ${isLiveSilverUp ? "text-emerald-400" : "text-red-400"}`}
                >
                  {isLiveSilverUp ? "▲" : "▼"} {Math.abs(liveSilverChange).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Right side - Spacer for balance */}
          <div className="hidden md:block w-16"></div>
        </div>
      </div>
    </div>
  );
}
