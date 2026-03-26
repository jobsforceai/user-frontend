"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Range } from "@/actions/assets";

type Props = {
  title: string;
  currency: string;
  color: string;
  range: Range;
  data: Array<{ time: string; price: number }>;
};

export function HistoricalChart({ title, currency, color, range, data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth || 1,
          height: containerRef.current.offsetHeight || 1,
        });
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isIntraday = range === "1D";
  const isWeekly = range === "1W";
  const isMonthly = range === "1M" || range === "5M";

  const xTickFormatter = (value: string) =>
    isIntraday
      ? new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      : isWeekly
        ? new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit" })
        : isMonthly
          ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
          : new Date(value).toLocaleDateString("en-IN", { month: "short", year: "2-digit" });

  const tooltipLabelFormatter = (value: unknown) =>
    new Date(String(value ?? "")).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(isIntraday ? { hour: "2-digit", minute: "2-digit" } : {})
    });

  const yDomain = useMemo((): [number, number] => {
    const prices = data
      .map((point) => point.price)
      .filter((value) => Number.isFinite(value));

    if (prices.length === 0) return [0, 1];

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const spread = max - min;

    // Keep a visible vertical band even when prices are nearly flat.
    const padding = spread > 0 ? spread * 0.15 : Math.max(Math.abs(max) * 0.002, 1);
    return [min - padding, max + padding];
  }, [data]);

  const chart = (
    <ResponsiveContainer width={containerSize.width || "100%"} height={containerSize.height || 300}>
      <LineChart data={data}>
        <XAxis
          dataKey="time"
          tickFormatter={xTickFormatter}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          minTickGap={28}
          interval="preserveStartEnd"
          stroke="#2a2a2a"
        />
        <YAxis
          tickFormatter={(value) => `${Math.round(value)}`}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          width={60}
          stroke="#2a2a2a"
          domain={yDomain}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value ?? 0), currency)}
          labelFormatter={tooltipLabelFormatter}
          contentStyle={{
            backgroundColor: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#f5f5f5"
          }}
        />
        <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2.2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  // When embedded (no title), render just the chart — parent controls height
  if (!title) {
    return <div ref={containerRef} className="h-full w-full min-h-0 min-w-0">{chart}</div>;
  }

  // Standalone mode with Card wrapper
  return (
    <Card className="border border-border p-5 md:p-6">
      <p className="mb-3 text-sm font-medium tracking-wide text-ink/60">{title}</p>
      <div ref={containerRef} className="h-64 w-full min-h-0 min-w-0">{chart}</div>
    </Card>
  );
}
