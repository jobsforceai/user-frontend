"use client";

import { useRouter } from "next/navigation";

type Props = {
  type: "country" | "state";
  value: string;
  options: Array<{ value: string; label: string }>;
  /** URL template with {VALUE} placeholder */
  hrefTemplate: string;
};

export function RegionSelect({ type, value, options, hrefTemplate }: Props) {
  const router = useRouter();

  return (
    <div>
      <p className="mb-1 text-[10px] uppercase tracking-widest text-ink/30">{type}</p>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => router.push(hrefTemplate.replace("{VALUE}", encodeURIComponent(e.target.value)), { scroll: false })}
          className="w-full appearance-none rounded-lg border border-border bg-panel-alt px-3 py-2 pr-8 text-sm text-ink focus:border-accent focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}
