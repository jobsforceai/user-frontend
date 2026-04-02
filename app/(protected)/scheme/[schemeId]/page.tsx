"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getScheme, paySchemeInstallment, redeemSchemeAction, type SchemeData } from "@/actions/scheme";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v / 100);

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [scheme, setScheme] = useState<SchemeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      const result = await getScheme(params.schemeId as string);
      if (result.data?.scheme) setScheme(result.data.scheme);
      else setError(result.error ?? "Failed to load scheme");
      setLoading(false);
    }
    load();
  }, [params.schemeId]);

  async function handlePay() {
    if (!scheme) return;
    setActionLoading(true);
    setError("");
    setSuccess("");

    const result = await paySchemeInstallment(scheme._id);
    if (result.error) {
      setError(result.error);
    } else if (result.data?.scheme) {
      setScheme(result.data.scheme);
      setSuccess("Installment paid!");
    }
    setActionLoading(false);
  }

  async function handleRedeem() {
    if (!scheme) return;
    setActionLoading(true);
    setError("");
    setSuccess("");

    const result = await redeemSchemeAction(scheme._id);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setSuccess(`Redeemed! ${(result.data.goldCreditedMg / 1000).toFixed(3)}g gold credited to wallet.`);
      setTimeout(() => { router.push("/wallet"); router.refresh(); }, 2000);
    }
    setActionLoading(false);
  }

  if (loading) return <div className="text-ink/50">Loading...</div>;
  if (!scheme) return <div className="text-red-400">{error || "Scheme not found"}</div>;

  const paidCount = scheme.installments.filter((i) => i.status === "paid" || i.status === "advance").length;
  const totalPaidPaise = paidCount * scheme.slabAmountPaise;
  const nextPending = scheme.installments.findIndex((i) => i.status === "pending");
  const allPaid = paidCount >= scheme.installments.length;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-[#725eb5]/16 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">Scheme Ledger</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff]">Plan Detail</h1>
            <p className="mt-2 text-sm text-[#b4bdd5]">{fmt(scheme.slabAmountPaise)} /month commitment with structured installment tracking.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            scheme.status === "active" ? "bg-emerald-500/15 text-emerald-300" :
            scheme.status === "completed" ? "bg-[#d7af35]/18 text-[#f7de89]" :
            "bg-red-500/15 text-red-300"
          }`}>
            {scheme.status}
          </span>
        </div>
      </section>

      {error && <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-300">{error}</div>}
      {success && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-3 py-2 text-sm text-emerald-300">{success}</div>}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-[#404964] bg-[#1a2032]/95 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-xs text-[#8f98b3]">Total Paid</p>
          <p className="mt-1 text-xl font-bold text-[#eef2ff]">{fmt(totalPaidPaise)}</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-xs text-[#d5f6e0]">Month 12 Bonus</p>
          <p className="mt-1 text-xl font-bold text-emerald-300">{fmt(scheme.bonusAmountPaise)}</p>
        </div>
        <div className="rounded-2xl border border-[#d7af35]/35 bg-[#d7af35]/12 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-xs text-[#f6d97f]">Maturity Value</p>
          <p className="mt-1 text-xl font-black text-[#f8df8a]">{fmt(totalPaidPaise + scheme.bonusAmountPaise)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
        <p className="mb-4 text-sm font-semibold text-[#eef2ff]">Installments ({paidCount}/{scheme.installments.length})</p>
        <div className="flex flex-wrap gap-2.5">
          {scheme.installments.map((inst, i) => (
            <div
              key={i}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-xs font-semibold ${
                inst.status === "paid" ? "bg-emerald-500/18 text-emerald-300" :
                inst.status === "advance" ? "bg-[#d7af35]/18 text-[#f7de89]" :
                inst.status === "missed" ? "bg-red-500/18 text-red-300" :
                i === nextPending ? "border-2 border-[#d7af35]/60 bg-[#d7af35]/12 text-[#f7de89]" :
                "bg-[#252d43] text-[#8f98b3]"
              }`}
              title={`Month ${i + 1}: ${inst.status}${inst.paidDate ? ` (paid ${new Date(inst.paidDate).toLocaleDateString("en-IN")})` : ""}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {scheme.status === "active" && nextPending !== -1 && (
        <button
          onClick={handlePay}
          disabled={actionLoading}
          className="w-full rounded-xl bg-[#d7af35] py-3 font-extrabold text-[#171b28] transition hover:brightness-110 disabled:opacity-50"
        >
          {actionLoading ? "Processing..." : `Pay Installment #${nextPending + 1} (${fmt(scheme.slabAmountPaise)})`}
        </button>
      )}

      {scheme.status === "completed" && allPaid && (
        <button
          onClick={handleRedeem}
          disabled={actionLoading}
          className="w-full rounded-xl bg-emerald-500 py-3 font-extrabold text-[#11251a] transition hover:brightness-110 disabled:opacity-50"
        >
          {actionLoading ? "Processing..." : "Redeem Scheme - Convert to Gold"}
        </button>
      )}
    </div>
  );
}
