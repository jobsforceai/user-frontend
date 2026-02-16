"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sellGold } from "@/actions/trade";

const fmt = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

export default function SellPage() {
  const router = useRouter();
  const [amountMg, setAmountMg] = useState(1000);
  const [pricePerGramPaise, setPricePerGramPaise] = useState(0);
  const [balanceMg, setBalanceMg] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/trade-price").then((r) => r.json()).then((d) => {
      if (d.pricePerGramPaise) setPricePerGramPaise(d.pricePerGramPaise);
      if (d.balanceMg !== undefined) setBalanceMg(d.balanceMg);
    }).catch(() => {});
  }, []);

  const totalPaise = pricePerGramPaise > 0 ? Math.round((amountMg / 1000) * pricePerGramPaise) : 0;
  const insufficientBalance = balanceMg > 0 && amountMg > balanceMg;
  const belowMinimum = amountMg < 1000;
  const canSell = !belowMinimum && !insufficientBalance && amountMg > 0;

  async function handleSell() {
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await sellGold(amountMg);

    if (!result.success) {
      setError(result.error ?? "Order failed");
      setLoading(false);
      return;
    }

    setSuccess("Sell order placed! Admin will process the payout.");
    setLoading(false);

    setTimeout(() => {
      router.push("/wallet");
      router.refresh();
    }, 2500);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sell Gold</h1>
        <p className="text-sm text-ink/50">Minimum 1,000mg to sell</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-panel p-4 sm:p-6">
        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-400">{success}</div>
        )}

        {/* Current balance */}
        {balanceMg > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-border bg-panel-alt/50 px-4 py-3">
            <span className="text-sm text-ink/50">Your balance</span>
            <span className="font-semibold text-accent">{balanceMg.toLocaleString()}mg</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm text-ink/70">Amount to sell (mg)</label>
          <input
            type="number"
            min={1000}
            value={amountMg}
            onChange={(e) => setAmountMg(Math.max(0, parseInt(e.target.value) || 0))}
            className={`w-full rounded-lg border px-3 py-2.5 text-ink focus:outline-none ${
              insufficientBalance
                ? "border-red-500/50 bg-red-900/10 focus:border-red-500"
                : "border-border bg-panel-alt focus:border-accent"
            }`}
          />
          <div className="flex justify-between">
            <p className="text-xs text-ink/40">Min 1,000mg</p>
            {balanceMg > 0 && (
              <button
                type="button"
                onClick={() => setAmountMg(balanceMg)}
                className="text-xs font-medium text-accent hover:underline"
              >
                Sell all
              </button>
            )}
          </div>

          {insufficientBalance && (
            <p className="text-xs text-red-400">
              Insufficient balance. You have {balanceMg.toLocaleString()}mg.
            </p>
          )}
          {belowMinimum && amountMg > 0 && (
            <p className="text-xs text-amber-400">
              Minimum sell amount is 1,000mg.
            </p>
          )}
        </div>

        {/* Value breakdown */}
        {pricePerGramPaise > 0 && amountMg >= 1000 && (
          <div className="space-y-2 rounded-xl border border-border bg-panel-alt/50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Live price per 1,000mg</span>
              <span className="text-ink">{fmt(pricePerGramPaise)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Sell value ({amountMg.toLocaleString()}mg)</span>
              <span className="text-ink">{fmt(totalPaise)}</span>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-ink">You will receive</span>
                <span className="text-accent">{fmt(totalPaise)}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleSell}
          disabled={loading || !canSell}
          className="w-full rounded-xl bg-red-600 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Placing order..." : `Place Sell Order — ${amountMg.toLocaleString()}mg`}
        </button>

        <p className="text-center text-xs text-ink/30">
          Gold will be debited after admin approval. Payout will be settled offline.
        </p>
      </div>
    </div>
  );
}
