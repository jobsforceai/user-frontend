"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIndicativePrice } from "@/lib/use-indicative-price";
import type { Currency } from "@/actions/assets";

type BottomLiveRateBoardProps = {
  currency: Currency;
  gold24k10g: number;
  silver9991kg: number;
  buyHref: string;
};

function formatBoardPrice(value: number, currency: Currency) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.max(0, value));
}

export function BottomLiveRateBoard({
  currency,
  gold24k10g,
  silver9991kg,
  buyHref,
}: BottomLiveRateBoardProps) {
  const gold24kTick = useIndicativePrice(gold24k10g, {
    maxPercent: 0.45,
    stepPercent: 0.13,
    intervalMs: 1700,
  });

  const gold22kTick = useIndicativePrice(gold24k10g * (22 / 24), {
    maxPercent: 0.45,
    stepPercent: 0.13,
    intervalMs: 1700,
  });

  const gold18kTick = useIndicativePrice(gold24k10g * (18 / 24), {
    maxPercent: 0.45,
    stepPercent: 0.13,
    intervalMs: 1700,
  });

  const silverTick = useIndicativePrice(silver9991kg, {
    maxPercent: 0.35,
    stepPercent: 0.1,
    intervalMs: 1700,
  });

  const rows = [
    { label: "Gold 24K", value: gold24kTick.value, isUp: gold24kTick.isUp, unit: "/10g" },
    { label: "Gold 22K", value: gold22kTick.value, isUp: gold22kTick.isUp, unit: "/10g" },
    { label: "Gold 18K", value: gold18kTick.value, isUp: gold18kTick.isUp, unit: "/10g" },
    { label: "Silver 999", value: silverTick.value, isUp: silverTick.isUp, unit: "/kg" },
  ];

  const [updatedAt, setUpdatedAt] = useState("--:--:--");

  useEffect(() => {
    const formatTime = () =>
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    setUpdatedAt(formatTime());
    const id = window.setInterval(() => setUpdatedAt(formatTime()), 1000);

    return () => window.clearInterval(id);
  }, []);

  const spreadValue = Math.max(0, gold24kTick.value - gold22kTick.value);

  return (
    <div
      className="pointer-events-none fixed bottom-0 left-1/2 z-50 w-[min(94vw,860px)] -translate-x-1/2 pb-1 sm:w-[min(90vw,860px)] md:w-[min(86vw,900px)] md:pb-1.5"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
    >
      <section
        className="pointer-events-auto mx-auto w-full overflow-hidden rounded-lg border"
        style={{
          borderColor: "rgba(255,208,94,0.28)",
          background:
            "linear-gradient(180deg, rgba(15,15,20,0.98) 0%, rgba(7,7,10,0.98) 100%)",
          boxShadow: "0 -4px 14px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center justify-between gap-2 border-b px-2 py-1.5 md:px-3"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <p className="truncate text-[9px] font-semibold uppercase tracking-wider text-[rgba(245,245,245,0.72)] md:text-[10px]">
              Live Rate Board
            </p>
            <span className="hidden text-[9px] text-[rgba(245,245,245,0.42)] sm:inline md:text-[10px]">
              Updated {updatedAt}
            </span>
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-wider text-[rgba(244,191,77,0.85)] md:text-[9px]">
            INR
          </span>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5 px-2 py-1.5 sm:flex-row sm:items-center md:px-3">
          <div className="grid min-w-0 flex-1 grid-cols-2 gap-1 sm:flex sm:flex-wrap sm:items-center">
            {rows.map((row) => (
              <div
                key={row.label}
                className="inline-flex min-w-0 items-center gap-1 rounded-md border px-1.5 py-1 md:px-2"
                style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(8,8,12,0.95)" }}
              >
                <span
                  className="shrink-0 rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider md:text-[9px]"
                  style={{ background: "#f4bf4d", color: "#181106" }}
                >
                  {row.label}
                </span>
                <span
                  className="truncate font-mono text-[11px] font-bold leading-none md:text-[12px]"
                  style={{ color: "#ff4040", textShadow: "0 0 8px rgba(255,64,64,0.35)" }}
                >
                  {formatBoardPrice(row.value, currency)}
                </span>
                <span className="shrink-0 text-[8px] font-medium uppercase text-[rgba(245,245,245,0.5)]">
                  {row.unit}
                </span>
                <span className={`shrink-0 text-[8px] font-semibold ${row.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                  {row.isUp ? "+" : "-"}
                </span>
              </div>
            ))}
          </div>

          <Link
            href={buyHref}
            className="inline-flex w-full items-center justify-center rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-wide text-[#101010] transition hover:brightness-110 sm:w-auto sm:shrink-0 md:px-2.5 md:text-[10px]"
            style={{ background: "linear-gradient(135deg, #f4bf4d, #d99b19)" }}
          >
            Buy
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 px-2 py-1 md:px-3">
          <p className="text-[8px] uppercase tracking-wider text-[rgba(245,245,245,0.52)] md:text-[9px]">
            Spread (24K-22K): {formatBoardPrice(spreadValue, currency)} per 10g
          </p>
          <p className="hidden text-[8px] uppercase tracking-wider text-[rgba(245,245,245,0.4)] sm:block md:text-[9px]">
            Indicative board
          </p>
        </div>
      </section>
    </div>
  );
}
