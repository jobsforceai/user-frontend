"use client";

import { useEffect, useMemo, useState } from "react";
import { formatCurrency } from "@/lib/utils";

type Props = {
  cities: string[];
  basePricePerGram: number;
};

function citySeed(city: string) {
  let hash = 0;
  for (let i = 0; i < city.length; i += 1) {
    hash = (hash * 31 + city.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function cityOffsetPercent(city: string) {
  const seed = citySeed(city);
  // Deterministic per-city fixed offset in rupees: roughly [-4.00, +4.00]
  return ((seed % 801) - 400) / 100;
}

export function CityLivePricesGrid({ cities, basePricePerGram }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((v) => v + 1);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  const rows = useMemo(() => {
    return cities.map((city) => {
      const baseOffsetInr = cityOffsetPercent(city);
      const wobbleInr = ((((citySeed(city) + tick * 17) % 13) - 6) / 10) * 0.15;
      const value = basePricePerGram + baseOffsetInr + wobbleInr;

      return {
        city,
        value,
      };
    });
  }, [cities, basePricePerGram, tick]);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <div key={row.city} className="flex items-center justify-between rounded-xl border border-border/60 bg-bg/50 px-4 py-3">
          <p className="text-sm font-medium text-ink/70">{row.city}</p>
          <p className="text-base font-bold text-accent">{formatCurrency(row.value, "INR")}</p>
        </div>
      ))}
    </div>
  );
}
