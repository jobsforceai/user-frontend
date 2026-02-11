"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sellGold } from "@/actions/trade";

export default function SellPage() {
  const router = useRouter();
  const [amountMg, setAmountMg] = useState(1000);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSell() {
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await sellGold(amountMg);

    if (!result.success) {
      setError(result.error ?? "Sell failed");
      setLoading(false);
      return;
    }

    setSuccess(`Successfully sold ${(amountMg / 1000).toFixed(3)}g of gold!`);
    setLoading(false);

    setTimeout(() => {
      router.push("/wallet");
      router.refresh();
    }, 2000);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sell Gold</h1>
        <p className="text-sm text-ink/50">Minimum 1 gram to sell</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-panel p-6">
        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="rounded-lg border border-green-800/50 bg-green-900/20 px-3 py-2 text-sm text-green-400">{success}</div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm text-ink/70">Amount to sell (mg)</label>
          <input
            type="number"
            min={1000}
            value={amountMg}
            onChange={(e) => setAmountMg(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-lg border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent focus:outline-none"
          />
          <p className="text-xs text-ink/40">= {(amountMg / 1000).toFixed(3)} grams</p>
        </div>

        <button
          onClick={handleSell}
          disabled={loading || amountMg < 1000}
          className="w-full rounded-lg bg-red-600 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : `Sell ${(amountMg / 1000).toFixed(3)}g Gold`}
        </button>
      </div>
    </div>
  );
}
