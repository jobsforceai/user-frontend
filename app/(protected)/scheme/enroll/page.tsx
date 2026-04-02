"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { enrollScheme, verifySgxCode } from "@/actions/scheme";

const slabs = [
  { monthlyPaise: 500000, bonusPaise: 1000000 },
  { monthlyPaise: 1000000, bonusPaise: 2000000 },
  { monthlyPaise: 2500000, bonusPaise: 5000000 },
  { monthlyPaise: 5000000, bonusPaise: 10000000 },
  { monthlyPaise: 10000000, bonusPaise: 20000000 },
];

const fmt = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v / 100);

export default function SchemeEnrollPage() {
  const router = useRouter();
  const [sliderIndex, setSliderIndex] = useState(0);
  const [eligibilityCode, setEligibilityCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const slab = slabs[sliderIndex];
  const totalPaid = slab.monthlyPaise * 11;
  const bonus = slab.bonusPaise;
  const redemptionValue = totalPaid + bonus;
  const sgxEligible = slab.monthlyPaise >= 1000000; // Rs 10,000+/mo

  const [codeLoading, setCodeLoading] = useState(false);
  const [codeError, setCodeError] = useState("");

  async function handleVerifyCode() {
    if (!eligibilityCode.trim()) {
      setCodeStatus("invalid");
      setCodeError("Please enter a code");
      return;
    }

    setCodeLoading(true);
    setCodeError("");

    const result = await verifySgxCode(eligibilityCode.trim(), slab.monthlyPaise);

    if (result.error) {
      setCodeStatus("invalid");
      setCodeError(result.error);
    } else if (result.data?.valid) {
      setCodeStatus("valid");
    } else {
      setCodeStatus("invalid");
      setCodeError(result.data?.error ?? "Invalid code");
    }

    setCodeLoading(false);
  }

  async function handleEnroll() {
    setError("");
    setLoading(true);

    const verifiedCode = codeStatus === "valid" ? eligibilityCode.trim() : undefined;
    const result = await enrollScheme(slab.monthlyPaise, verifiedCode);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/scheme");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="relative overflow-hidden rounded-[30px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-[#725eb5]/16 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">Enrollment Studio</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff] sm:text-4xl">11-Month Gold Pool</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#b4bdd5]">Create a fixed monthly commitment and unlock bonus value in month 12 with optional SGX loyalty rewards.</p>
        </div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-300">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
          <h2 className="text-lg font-bold text-[#eef2ff]">Contribution Calculator</h2>

          <div className="mt-6 rounded-2xl border border-[#3f4762] bg-[#11182a] p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.16em] text-[#8f98b3]">Monthly Contribution</p>
              <p className="text-2xl font-black text-[#f8df8a]">{fmt(slab.monthlyPaise)}</p>
            </div>

            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={slabs.length - 1}
                step={1}
                value={sliderIndex}
                onChange={(e) => setSliderIndex(Number(e.target.value))}
                className="scheme-slider w-full"
              />
              <div className="mt-1 flex justify-between text-xs text-[#8f98b3]">
                <span>Rs 5K</span>
                <span>Rs 100K</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-[#3f4762] bg-[#20263a] px-3 py-2.5 text-sm">
              <span className="text-[#b4bdd5]">Total Contribution (11 months)</span>
              <span className="font-semibold text-[#eef2ff]">{fmt(totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2.5 text-sm">
              <span className="text-[#d6f7e1]">Month 12 Bonus</span>
              <span className="font-semibold text-emerald-300">+ {fmt(bonus)}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-3">
              <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[#f6d97f]">Total Redemption</span>
              <span className="text-2xl font-black text-[#f8df8a]">{fmt(redemptionValue)}</span>
            </div>
          </div>

          <button
            onClick={handleEnroll}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#d7af35] py-3 text-sm font-extrabold text-[#171b28] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Enrolling..." : "Enroll in Scheme"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f6d97f]">Scheme Rules</h3>
            <ul className="mt-3 space-y-2 text-sm text-[#b4bdd5]">
              <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8f98b3]" />Locked for 11 months for maximum value yield.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8f98b3]" />Cycle resets every 30 days from your start date.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8f98b3]" />Penalties may apply for missed payments. Advance payments are allowed.</li>
              <li className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8f98b3]" />Redeemable as 24K coins or bars after month 12 maturity.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-[#d7af35]/30 bg-[#d7af35]/10 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#f8df8a]">SGX Loyalty Reward</h3>
            <p className="mt-2 text-sm text-[#f2ead0]">
              Users investing at least <strong>Rs 10,000/mo</strong> can unlock an extra <strong>250mg Gold Coin</strong> on maturity.
            </p>

            {sgxEligible ? (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Eligibility Code"
                    value={eligibilityCode}
                    onChange={(e) => {
                      setEligibilityCode(e.target.value);
                      setCodeStatus("idle");
                    }}
                    className="flex-1 rounded-xl border border-[#b18d2d]/40 bg-[#2b230f]/50 px-3 py-2.5 text-sm text-[#fff6d8] placeholder:text-[#b8a980] focus:border-[#f7de89]/65 focus:outline-none focus:ring-2 focus:ring-[#f7de89]/15"
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={codeLoading}
                    className="rounded-xl bg-[#f0cd6b] px-4 py-2.5 text-sm font-bold text-[#221c0d] transition hover:brightness-110 disabled:opacity-50"
                  >
                    {codeLoading ? "..." : "Verify"}
                  </button>
                </div>
                {codeStatus === "valid" && (
                  <p className="mt-2 text-sm text-emerald-200">Code verified. 250mg coin will be credited on maturity.</p>
                )}
                {codeStatus === "invalid" && (
                  <p className="mt-2 text-sm text-red-200">{codeError || "Invalid code. Please check and try again."}</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-[#d8c89d]">Choose Rs 10,000/mo or higher to unlock this reward.</p>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl border border-[#404964] bg-[#1a2032]/95 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <div className="border-b border-[#3f4762] bg-[#20263a] px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f98b3]">Benefit Comparison</p>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.1em] text-[#8f98b3]">
                <tr>
                  <th className="px-4 py-2">Monthly</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Bonus</th>
                  <th className="px-4 py-2">Redemption</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((s, i) => (
                  <tr key={s.monthlyPaise} className={`border-t border-[#2c344c] ${i === sliderIndex ? "bg-[#d7af35]/10" : ""}`}>
                    <td className="px-4 py-2.5 font-medium text-[#eef2ff]">{fmt(s.monthlyPaise)}</td>
                    <td className="px-4 py-2.5 text-[#b4bdd5]">{fmt(s.monthlyPaise * 11)}</td>
                    <td className="px-4 py-2.5 font-semibold text-emerald-300">+ {fmt(s.bonusPaise)}</td>
                    <td className="px-4 py-2.5 font-bold text-[#f8df8a]">{fmt(s.monthlyPaise * 11 + s.bonusPaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
