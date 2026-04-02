"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buyGold } from "@/actions/trade";
import { useIndicativePrice } from "@/lib/use-indicative-price";

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
  const priceTick = useIndicativePrice(pricePerGramPaise, { maxPercent: 0.5, stepPercent: 0.2, intervalMs: 2200 });

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
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-14 h-48 w-48 rounded-full bg-[#725eb5]/16 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">
              Buy Desk
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff]">Acquire Digital Gold</h1>
            <p className="mt-2 max-w-xl text-sm text-[#b4bdd5]">Set quantity, view live indicative quotes, and place a buy request for admin confirmation.</p>
          </div>
          <div className="rounded-2xl border border-[#4a5270] bg-[#232a3f]/90 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Quote Snapshot</p>
            <p className="mt-1 text-xl font-black text-[#f3f6ff]">{pricePerGramPaise > 0 ? fmt(Math.round(priceTick.value)) : "--"}</p>
            <p className="text-xs text-[#8f98b3]">per 1,000mg</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-5 rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-300">{error}</div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-3 py-2 text-sm text-emerald-300">{success}</div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Fast Presets</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.mg}
                  onClick={() => setAmountMg(p.mg)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    amountMg === p.mg
                      ? "border-[#d7af35]/45 bg-[#d7af35]/18 font-semibold text-[#f8df8a]"
                      : "border-[#3f4762] bg-[#20263a] text-[#b2bbd3] hover:border-[#667197] hover:text-[#eef2ff]"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#d7ddf1]">Amount (mg)</label>
            <input
              type="number"
              min={100}
              max={100000}
              value={amountMg}
              onChange={(e) => setAmountMg(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
            />
            <p className="text-xs text-[#8f98b3]">Min 100mg, max 100,000mg per day</p>
          </div>

          <button
            onClick={handleBuy}
            disabled={loading || amountMg < 100}
            className="w-full rounded-xl bg-[#d7af35] py-3 font-extrabold text-[#171b28] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Placing order..." : `Place Buy Order - ${amountMg.toLocaleString()}mg`}
          </button>

          <p className="text-center text-xs text-[#8f98b3]">Order remains pending until admin approves. Gold credits after confirmation.</p>
        </div>

        <div className="space-y-4">
          {pricePerGramPaise > 0 && (
            <div className="space-y-3 rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Settlement Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#b4bdd5]">Live rate / 1,000mg</span>
                <span className="font-semibold text-[#eef2ff]">{fmt(Math.round(priceTick.value))}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#8f98b3]">Market pulse</span>
                <span className={priceTick.isUp ? "text-emerald-300" : "text-red-300"}>
                  {priceTick.isUp ? "▲" : "▼"} {Math.abs(priceTick.offsetPercent).toFixed(2)}% indicative
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#b4bdd5]">Gold value ({amountMg.toLocaleString()}mg)</span>
                <span className="text-[#eef2ff]">{fmt(basePaise)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#b4bdd5]">GST (3%)</span>
                <span className="text-[#eef2ff]">{fmt(gstPaise)}</span>
              </div>
              {bonusMg > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-300">First-gram bonus</span>
                  <span className="font-semibold text-emerald-300">+{bonusMg}mg</span>
                </div>
              )}
              <div className="border-t border-[#3f4762] pt-2">
                <div className="flex justify-between text-base font-extrabold">
                  <span className="text-[#eef2ff]">Total payable</span>
                  <span className="text-[#f6d97f]">{fmt(totalPaise)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Execution Flow</p>
            <ul className="mt-3 space-y-2 text-sm text-[#b4bdd5]">
              <li>1. Submit your requested quantity.</li>
              <li>2. Team validates pricing and compliance checks.</li>
              <li>3. Approved orders are credited to your wallet.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
