"use client";

import { useIndicativePrice } from "@/lib/use-indicative-price";
import { cn, formatCurrency } from "@/lib/utils";

type IndicativeLivePriceProps = {
  baseValue: number;
  currency: string;
  className?: string;
  tickClassName?: string;
  showTick?: boolean;
};

export function IndicativeLivePrice({
  baseValue,
  currency,
  className,
  tickClassName,
  showTick = true,
}: IndicativeLivePriceProps) {
  const tick = useIndicativePrice(baseValue, { maxPercent: 0.5, stepPercent: 0.16, intervalMs: 2200 });

  return (
    <>
      <span className={className}>{formatCurrency(tick.value, currency)}</span>
      {showTick && (
        <span
          className={cn(
            "mt-1 block text-xs font-medium",
            tick.isUp ? "text-emerald-400" : "text-red-400",
            tickClassName
          )}
        >
          {tick.isUp ? "▲" : "▼"} {Math.abs(tick.offsetPercent).toFixed(2)}% live
        </span>
      )}
    </>
  );
}
