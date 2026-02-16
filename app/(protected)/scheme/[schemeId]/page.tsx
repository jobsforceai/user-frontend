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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Scheme Detail</h1>
          <p className="text-sm text-ink/50">{fmt(scheme.slabAmountPaise)} /month</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          scheme.status === "active" ? "bg-green-900/30 text-green-400" :
          scheme.status === "completed" ? "bg-accent/20 text-accent" :
          "bg-red-900/30 text-red-400"
        }`}>
          {scheme.status}
        </span>
      </div>

      {error && <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>}
      {success && <div className="rounded-lg border border-green-800/50 bg-green-900/20 px-3 py-2 text-sm text-green-400">{success}</div>}

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-panel p-4 shadow-card">
          <p className="text-xs text-ink/40">Total Paid</p>
          <p className="mt-1 text-lg font-semibold">{fmt(totalPaidPaise)}</p>
        </div>
        <div className="rounded-xl border border-border bg-panel p-4 shadow-card">
          <p className="text-xs text-ink/40">Bonus (12th month)</p>
          <p className="mt-1 text-lg font-semibold text-green-400">{fmt(scheme.bonusAmountPaise)}</p>
        </div>
        <div className="rounded-xl border border-border bg-panel p-4 shadow-card">
          <p className="text-xs text-ink/40">Total Value</p>
          <p className="mt-1 text-lg font-semibold text-accent">{fmt(totalPaidPaise + scheme.bonusAmountPaise)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-5">
        <p className="mb-3 text-sm font-medium">Installments ({paidCount}/{scheme.installments.length})</p>
        <div className="flex flex-wrap gap-2">
          {scheme.installments.map((inst, i) => (
            <div
              key={i}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-medium ${
                inst.status === "paid" ? "bg-green-900/40 text-green-400" :
                inst.status === "advance" ? "bg-accent/20 text-accent" :
                inst.status === "missed" ? "bg-red-900/40 text-red-400" :
                i === nextPending ? "border-2 border-accent bg-accent/10 text-accent" :
                "bg-white/5 text-ink/30"
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
          className="w-full rounded-xl bg-accent py-2.5 font-medium text-bg transition hover:bg-accent-dim disabled:opacity-50"
        >
          {actionLoading ? "Processing..." : `Pay Installment #${nextPending + 1} (${fmt(scheme.slabAmountPaise)})`}
        </button>
      )}

      {scheme.status === "completed" && allPaid && (
        <button
          onClick={handleRedeem}
          disabled={actionLoading}
          className="w-full rounded-xl bg-green-600 py-2.5 font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
        >
          {actionLoading ? "Processing..." : "Redeem Scheme — Convert to Gold"}
        </button>
      )}
    </div>
  );
}
