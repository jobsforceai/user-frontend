"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollScheme } from "@/actions/scheme";

const slabs = [
  { monthlyPaise: 500000, bonusPaise: 1000000 },
  { monthlyPaise: 1000000, bonusPaise: 2000000 },
  { monthlyPaise: 2000000, bonusPaise: 4000000 },
  { monthlyPaise: 4000000, bonusPaise: 8000000 },
  { monthlyPaise: 6000000, bonusPaise: 12000000 },
  { monthlyPaise: 8000000, bonusPaise: 16000000 },
  { monthlyPaise: 10000000, bonusPaise: 24000000 },
];

const fmt = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v / 100);

export default function SchemeEnrollPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEnroll() {
    if (selected === null) return;
    setError("");
    setLoading(true);

    const result = await enrollScheme(slabs[selected].monthlyPaise);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/scheme");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Choose Your Plan</h1>
        <p className="text-sm text-ink/50">Pay monthly for 11 months, receive bonus on the 12th month</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {slabs.map((slab, i) => (
          <button
            key={slab.monthlyPaise}
            onClick={() => setSelected(i)}
            className={`rounded-2xl border p-5 text-left transition ${
              selected === i
                ? "border-accent bg-accent/10"
                : "border-border bg-panel hover:border-accent-dim"
            }`}
          >
            <p className="text-lg font-semibold text-accent">
              {fmt(slab.monthlyPaise)}
              <span className="text-sm font-normal text-ink/40"> /month</span>
            </p>
            <p className="mt-1 text-sm text-ink/60">11 months = {fmt(slab.monthlyPaise * 11)}</p>
            <p className="mt-0.5 text-sm text-green-400">+ {fmt(slab.bonusPaise)} bonus</p>
            <p className="mt-2 text-xs text-ink/40">Total value: {fmt(slab.monthlyPaise * 11 + slab.bonusPaise)}</p>
          </button>
        ))}
      </div>

      {selected !== null && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6">
          <h3 className="font-semibold text-accent">Summary</h3>
          <div className="mt-3 space-y-1 text-sm">
            <p>Monthly: <span className="text-ink">{fmt(slabs[selected].monthlyPaise)}</span></p>
            <p>Duration: <span className="text-ink">11 months</span></p>
            <p>Total invested: <span className="text-ink">{fmt(slabs[selected].monthlyPaise * 11)}</span></p>
            <p>12th month bonus: <span className="text-green-400">{fmt(slabs[selected].bonusPaise)}</span></p>
            <p className="pt-2 text-base font-semibold">Grand total: <span className="text-accent">{fmt(slabs[selected].monthlyPaise * 11 + slabs[selected].bonusPaise)}</span></p>
          </div>
          <button
            onClick={handleEnroll}
            disabled={loading}
            className="mt-4 w-full rounded-lg bg-accent py-2.5 font-medium text-bg transition hover:bg-accent-dim disabled:opacity-50"
          >
            {loading ? "Enrolling..." : "Enroll & Pay First Installment"}
          </button>
        </div>
      )}
    </div>
  );
}
