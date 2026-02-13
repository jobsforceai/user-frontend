"use client";

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

  const tooltipLabelFormatter = (value: string) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(isIntraday ? { hour: "2-digit", minute: "2-digit" } : {})
    });

  const chart = (
    <ResponsiveContainer width="100%" height="100%">
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
        />
        <Tooltip
          formatter={(value: number) => formatCurrency(value, currency)}
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
    return <div className="h-full w-full">{chart}</div>;
  }

  // Standalone mode with Card wrapper
  return (
    <Card className="border border-border p-5 md:p-6">
      <p className="mb-3 text-sm font-medium tracking-wide text-ink/60">{title}</p>
      <div className="h-64 w-full">{chart}</div>
    </Card>
  );
}
