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
      <div className="mx-auto max-w-7xl px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center justify-between gap-2 md:justify-center md:gap-4">
          {/* Live indicator - compact on mobile */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <span className="flex h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span 
              className="text-[10px] md:text-xs font-semibold uppercase tracking-wider"
              style={{ color: "rgba(245,245,245,0.5)" }}
            >
              Live
            </span>
          </div>

          {/* Prices - optimized for mobile */}
          <div className="flex items-center gap-3 md:gap-6 lg:gap-8">
            {/* Gold */}
            <div className="flex items-center gap-1.5 md:gap-3">
              <span 
                className="text-[10px] md:text-xs font-medium uppercase tracking-wider"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                <span className="hidden sm:inline">Gold · {purity}</span>
                <span className="sm:hidden">Au</span>
              </span>
              <div className="flex items-baseline gap-1 md:gap-2">
                <span 
                  className="text-sm md:text-lg font-bold transition-colors duration-700 ease-in-out"
                  style={{ color: goldPriceColor }}
                >
                  {formatCurrency(goldPrice, currency)}
                </span>
                <span className="text-[10px] md:text-xs font-medium hidden sm:inline" style={{ color: "rgba(245,245,245,0.3)" }}>
                  /g
                </span>
                <span 
                  className={`text-[10px] md:text-xs font-semibold transition-colors duration-300 ${isLiveGoldUp ? "text-emerald-400" : "text-red-400"}`}
                >
                  {isLiveGoldUp ? "▲" : "▼"} {Math.abs(liveGoldChange).toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-6 md:h-8 w-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

            {/* Silver */}
            <div className="flex items-center gap-1.5 md:gap-3">
              <span 
                className="text-[10px] md:text-xs font-medium uppercase tracking-wider"
                style={{ color: "rgba(245,245,245,0.4)" }}
              >
                <span className="hidden sm:inline">Silver · 999</span>
                <span className="sm:hidden">Ag</span>
              </span>
              <div className="flex items-baseline gap-1 md:gap-2">
                <span 
                  className="text-sm md:text-lg font-bold transition-colors duration-700 ease-in-out"
                  style={{ color: silverPriceColor }}
                >
                  {formatCurrency(silverPrice, currency)}
                </span>
                <span className="text-[10px] md:text-xs font-medium hidden sm:inline" style={{ color: "rgba(245,245,245,0.3)" }}>
                  /g
                </span>
                <span 
                  className={`text-[10px] md:text-xs font-semibold transition-colors duration-300 ${isLiveSilverUp ? "text-emerald-400" : "text-red-400"}`}
                >
                  {isLiveSilverUp ? "▲" : "▼"} {Math.abs(liveSilverChange).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
