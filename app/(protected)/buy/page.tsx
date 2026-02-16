"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buyGold } from "@/actions/trade";

const presets = [
  { label: "100mg", mg: 100 },
  { label: "500mg", mg: 500 },
  { label: "1,000mg", mg: 1000 },
  { label: "5,000mg", mg: 5000 },
  { label: "10,000mg", mg: 10000 },
  { label: "50,000mg", mg: 50000 },
  { label: "100,000mg", mg: 100000 },
];

const fmt = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

export default function BuyPage() {
  const router = useRouter();
  const [amountMg, setAmountMg] = useState(1000);
  const [pricePerGramPaise, setPricePerGramPaise] = useState(0);
  const [totalPurchasedMg, setTotalPurchasedMg] = useState(0);
  const [totalBonusMg, setTotalBonusMg] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/trade-price").then((r) => r.json()).then((d) => {
      if (d.pricePerGramPaise) setPricePerGramPaise(d.pricePerGramPaise);
      if (d.totalPurchasedMg !== undefined) setTotalPurchasedMg(d.totalPurchasedMg);
      if (d.totalBonusMg !== undefined) setTotalBonusMg(d.totalBonusMg);
    }).catch(() => {});
  }, []);

  const basePaise = pricePerGramPaise > 0 ? Math.round((amountMg / 1000) * pricePerGramPaise) : 0;
  const gstPaise = Math.round(basePaise * 0.03);
  const totalPaise = basePaise + gstPaise;

  const bonusEligible = totalPurchasedMg < 1000 && totalBonusMg < 100;
  const rawBonus = bonusEligible ? Math.floor((amountMg * 10) / 100) : 0;
  const remainingBonusCap = 100 - totalBonusMg;
  const bonusMg = Math.min(rawBonus, Math.max(0, remainingBonusCap));

  async function handleBuy() {
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await buyGold(amountMg);

    if (!result.success) {
      setError(result.error ?? "Order failed");
      setLoading(false);
      return;
    }

    setSuccess("Order placed successfully! Waiting for admin approval.");
    setLoading(false);

    setTimeout(() => {
      router.push("/wallet");
      router.refresh();
    }, 2500);
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Buy Gold</h1>
        <p className="text-sm text-ink/50">Select amount in mg — order will be reviewed by admin</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-panel p-4 shadow-card sm:p-6">
        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>
        )}
        {success && (
          <div className="rounded-lg border border-emerald-800/50 bg-emerald-900/20 px-3 py-2 text-sm text-emerald-400">{success}</div>
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
          <label className="text-sm text-ink/70">Amount (mg)</label>
          <input
            type="number"
            min={100}
            max={100000}
            value={amountMg}
            onChange={(e) => setAmountMg(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
          <p className="text-xs text-ink/40">Min 100mg &middot; Max 100,000mg per day</p>
        </div>

        {pricePerGramPaise > 0 && (
          <div className="space-y-2 rounded-xl border border-border bg-panel-alt/50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Live price per 1,000mg</span>
              <span className="text-ink">{fmt(pricePerGramPaise)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">Gold value ({amountMg.toLocaleString()}mg)</span>
              <span className="text-ink">{fmt(basePaise)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/50">GST (3%)</span>
              <span className="text-ink">{fmt(gstPaise)}</span>
            </div>
            {bonusMg > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-emerald-400">First-gram bonus</span>
                <span className="font-medium text-emerald-400">+{bonusMg}mg free</span>
              </div>
            )}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="text-ink">Total payable</span>
                <span className="text-accent">{fmt(totalPaise)}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleBuy}
          disabled={loading || amountMg < 100}
          className="w-full rounded-xl bg-accent py-3 font-bold text-bg transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Placing order..." : `Place Buy Order — ${amountMg.toLocaleString()}mg`}
        </button>

        <p className="text-center text-xs text-ink/30">
          Order will be pending until admin approves. Gold is credited after approval.
        </p>
      </div>
    </div>
  );
}
