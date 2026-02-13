"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { claimStorageBenefit, type StorageBenefitStatus } from "@/actions/wallet";

export function StorageBenefitCard({ status }: { status: StorageBenefitStatus }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleClaim() {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await claimStorageBenefit();
      setSuccess(`${result.creditedMg}mg credited to your wallet!`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
    }

    setLoading(false);
  }

  const balanceGrams = (status.balanceMg / 1000).toFixed(3);
  const thresholdGrams = (status.thresholdMg / 1000).toFixed(0);
  const progress = Math.min((status.balanceMg / status.thresholdMg) * 100, 100);

  // Not eligible — show progress toward threshold
  if (!status.eligible) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Storage Benefit</p>
            <p className="text-xs text-ink/40">Hold {thresholdGrams}g+ to earn {status.rewardMg}mg/month</p>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-ink/50">
            <span>{balanceGrams}g held</span>
            <span>{thresholdGrams}g required</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-accent/50 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    );
  }

  // Eligible — show claim or already claimed
  return (
    <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
            <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-accent">Storage Benefit</p>
            <p className="text-xs text-ink/40">You qualify for {status.rewardMg}mg free gold this month</p>
          </div>
        </div>

        {status.claimedThisMonth ? (
          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
            Claimed
          </span>
        ) : (
          <button
            onClick={handleClaim}
            disabled={loading}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-bold text-bg transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Claiming..." : `Claim ${status.rewardMg}mg`}
          </button>
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      {success && <p className="mt-2 text-xs text-emerald-400">{success}</p>}
    </div>
  );
}
