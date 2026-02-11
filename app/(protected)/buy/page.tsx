"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buyGold } from "@/actions/trade";

const presets = [
  { label: "100mg", mg: 100 },
  { label: "500mg", mg: 500 },
  { label: "1g", mg: 1000 },
  { label: "5g", mg: 5000 },
  { label: "10g", mg: 10000 },
  { label: "50g", mg: 50000 },
  { label: "100g", mg: 100000 },
];

export default function BuyPage() {
  const router = useRouter();
  const [amountMg, setAmountMg] = useState(100);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [bonusInfo, setBonusInfo] = useState("");

  async function handleBuy() {
    setError("");
    setSuccess("");
    setBonusInfo("");
    setLoading(true);

    const result = await buyGold(amountMg);

    if (!result.success) {
      setError(result.error ?? "Purchase failed");
      setLoading(false);
      return;
    }

    let msg = `Successfully bought ${(amountMg / 1000).toFixed(3)}g of gold!`;
    if (result.bonusMg && result.bonusMg > 0) {
      setBonusInfo(`+ ${result.bonusMg}mg bonus credited!`);
    }
    setSuccess(msg);
    setLoading(false);

    setTimeout(() => {
      router.push("/wallet");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buy Gold</h1>
        <p className="text-sm text-ink/50">Select amount to purchase</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-panel p-6">
        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="rounded-lg border border-green-800/50 bg-green-900/20 px-3 py-2 text-sm text-green-400">
            {success}
            {bonusInfo && <p className="mt-1 font-medium">{bonusInfo}</p>}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.mg}
              onClick={() => setAmountMg(p.mg)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                amountMg === p.mg
                  ? "border-accent bg-accent text-bg font-medium"
                  : "border-border bg-panel-alt text-ink/70 hover:border-accent-dim"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-ink/70">Custom amount (mg)</label>
          <input
            type="number"
            min={100}
            max={100000}
            value={amountMg}
            onChange={(e) => setAmountMg(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-lg border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent focus:outline-none"
          />
          <p className="text-xs text-ink/40">= {(amountMg / 1000).toFixed(3)} grams</p>
        </div>

        <button
          onClick={handleBuy}
          disabled={loading || amountMg < 100}
          className="w-full rounded-lg bg-accent py-2.5 font-medium text-bg transition hover:bg-accent-dim disabled:opacity-50"
        >
          {loading ? "Processing..." : `Buy ${(amountMg / 1000).toFixed(3)}g Gold`}
        </button>
      </div>
    </div>
  );
}
