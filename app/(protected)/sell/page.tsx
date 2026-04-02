"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sellGold } from "@/actions/trade";
import { useIndicativePrice } from "@/lib/use-indicative-price";

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
  const priceTick = useIndicativePrice(pricePerGramPaise, { maxPercent: 0.5, stepPercent: 0.2, intervalMs: 2200 });
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
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#5d4354] bg-[#281f2b]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-[#f87171]/14 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#725eb5]/16 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-400/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200">
              Sell Desk
            </span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f7ecf2]">Liquidate Gold Holdings</h1>
            <p className="mt-2 max-w-xl text-sm text-[#d6bfcf]">Submit a sell request with live indicative rates. Minimum quantity is 1,000mg.</p>
          </div>
          <div className="rounded-2xl border border-[#6f5566] bg-[#342936]/90 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c9b0c2]">Indicative Exit / 1,000mg</p>
            <p className="mt-1 text-xl font-black text-[#ffe6f1]">{pricePerGramPaise > 0 ? fmt(Math.round(priceTick.value)) : "--"}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-5 rounded-3xl border border-[#604b5a] bg-[#231b28]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
          {error && (
            <div className="rounded-xl border border-red-400/35 bg-red-400/12 px-3 py-2 text-sm text-red-200">{error}</div>
          )}
          {success && (
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/12 px-3 py-2 text-sm text-emerald-200">{success}</div>
          )}

          {balanceMg > 0 && (
            <div className="flex items-center justify-between rounded-xl border border-[#6f5566] bg-[#342936]/85 px-4 py-3">
              <span className="text-sm text-[#d6bfcf]">Available balance</span>
              <span className="font-semibold text-[#ffe6f1]">{balanceMg.toLocaleString()}mg</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#eedce8]">Amount to sell (mg)</label>
            <input
              type="number"
              min={1000}
              value={amountMg}
              onChange={(e) => setAmountMg(Math.max(0, parseInt(e.target.value) || 0))}
              className={`w-full rounded-xl border px-3 py-2.5 text-[#ffeef7] focus:outline-none focus:ring-2 focus:ring-red-300/20 ${
                insufficientBalance
                  ? "border-red-400/55 bg-red-900/20 focus:border-red-300"
                  : "border-[#6f5566] bg-[#18111d] focus:border-red-300/45"
              }`}
            />
            <div className="flex justify-between">
              <p className="text-xs text-[#c9b0c2]">Min 1,000mg</p>
              {balanceMg > 0 && (
                <button
                  type="button"
                  onClick={() => setAmountMg(balanceMg)}
                  className="text-xs font-semibold text-[#ffd7ea] hover:underline"
                >
                  Sell all
                </button>
              )}
            </div>

            {insufficientBalance && (
              <p className="text-xs text-red-200">Insufficient balance. You have {balanceMg.toLocaleString()}mg.</p>
            )}
            {belowMinimum && amountMg > 0 && (
              <p className="text-xs text-amber-200">Minimum sell amount is 1,000mg.</p>
            )}
          </div>

          <button
            onClick={handleSell}
            disabled={loading || !canSell}
            className="w-full rounded-xl bg-red-500 py-3 font-extrabold text-white transition hover:bg-red-400 disabled:opacity-50"
          >
            {loading ? "Placing order..." : `Place Sell Order - ${amountMg.toLocaleString()}mg`}
          </button>

          <p className="text-center text-xs text-[#c9b0c2]">Gold debits after admin approval. Payout is settled through verified channels.</p>
        </div>

        <div className="space-y-4">
          {pricePerGramPaise > 0 && amountMg >= 1000 && (
            <div className="space-y-3 rounded-3xl border border-[#604b5a] bg-[#231b28]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9b0c2]">Exit Summary</p>
              <div className="flex justify-between text-sm">
                <span className="text-[#d6bfcf]">Live rate / 1,000mg</span>
                <span className="font-semibold text-[#ffeef7]">{fmt(Math.round(priceTick.value))}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#c9b0c2]">Market pulse</span>
                <span className={priceTick.isUp ? "text-emerald-200" : "text-red-200"}>
                  {priceTick.isUp ? "▲" : "▼"} {Math.abs(priceTick.offsetPercent).toFixed(2)}% indicative
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#d6bfcf]">Sell value ({amountMg.toLocaleString()}mg)</span>
                <span className="text-[#ffeef7]">{fmt(totalPaise)}</span>
              </div>
              <div className="border-t border-[#6f5566] pt-2">
                <div className="flex justify-between text-base font-extrabold">
                  <span className="text-[#ffeef7]">Estimated payout</span>
                  <span className="text-[#ffd7ea]">{fmt(totalPaise)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-[#604b5a] bg-[#231b28]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#c9b0c2]">Execution Flow</p>
            <ul className="mt-3 space-y-2 text-sm text-[#d6bfcf]">
              <li>1. Place sell quantity request.</li>
              <li>2. Admin verifies wallet, rates, and compliance.</li>
              <li>3. Approved payout is settled and reflected in records.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
