"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestJewellerAccount } from "@/actions/auth";

type Props = {
  status?: "pending" | "approved" | "rejected";
};

export function JewellerRequest({ status }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setError("");
    setLoading(true);

    const result = await requestJewellerAccount();
    if (result.error) {
      setError(result.error);
    } else {
      router.refresh();
    }
    setLoading(false);
  }

  if (status === "pending") {
    return (
      <div className="rounded-3xl border border-amber-400/25 bg-amber-500/10 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-300/35 bg-amber-500/15">
            <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-amber-400">Jeweller Request Pending</h2>
            <p className="text-sm text-amber-100/85">Your request is being reviewed by the admin team. You will be notified once approved.</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="rounded-3xl border border-red-500/25 bg-red-500/10 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-400/35 bg-red-500/15">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-red-400">Jeweller Request Rejected</h2>
            <p className="text-sm text-red-100/85">Your previous request was not approved. You can apply again if your circumstances have changed.</p>
            <button
              onClick={handleRequest}
              disabled={loading}
              className="mt-3 rounded-xl border border-red-400/35 bg-red-500/12 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 disabled:opacity-50"
            >
              {loading ? "Requesting..." : "Request Again"}
            </button>
            {error && <p className="mt-2 text-sm text-red-200">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  // No status - show request CTA
  return (
    <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d7af35]/35 bg-[#d7af35]/12">
          <svg className="h-5 w-5 text-[#f7de89]" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-[#eef2ff]">Upgrade to Jeweller Account</h2>
          <p className="mt-1 text-sm text-[#b4bdd5]">
            Get higher daily limits (up to 1kg/day), locked pricing, and 3-day settlement.
            Admin will review your request and assign an appropriate subscription tier.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#aab2ca]">
            <span className="rounded-full border border-[#3f4762] bg-[#20263a] px-2.5 py-1">Rs 25k -&gt; 100g/day (1.0%)</span>
            <span className="rounded-full border border-[#3f4762] bg-[#20263a] px-2.5 py-1">Rs 50k -&gt; 250g/day (1.2%)</span>
            <span className="rounded-full border border-[#3f4762] bg-[#20263a] px-2.5 py-1">Rs 2L -&gt; 500g/day (1.5%)</span>
            <span className="rounded-full border border-[#3f4762] bg-[#20263a] px-2.5 py-1">Rs 5L -&gt; 1kg/day (Custom)</span>
          </div>
          <button
            onClick={handleRequest}
            disabled={loading}
            className="mt-4 rounded-xl bg-[#d7af35] px-5 py-2.5 text-sm font-extrabold text-[#171b28] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Request Jeweller Account"}
          </button>
          {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  );
}
