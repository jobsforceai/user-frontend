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
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">11-Month Gold Pool</h1>
        <p className="text-sm text-ink/50">Disciplined saving meets luxury rewards. Contribute for 11 months and unlock your bonus on the 12th month.</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Left: Contribution Calculator ── */}
        <div className="rounded-2xl border border-border bg-panel p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-ink">Contribution Calculator</h2>

          <div className="mt-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest text-ink/40">Monthly Contribution</p>
              <p className="text-2xl font-bold text-accent">{fmt(slab.monthlyPaise)}</p>
            </div>

            {/* Slider */}
            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={slabs.length - 1}
                step={1}
                value={sliderIndex}
                onChange={(e) => setSliderIndex(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="mt-1 flex justify-between text-xs text-ink/30">
                <span>Rs 5K</span>
                <span>Rs 100K</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-border pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink/50">Total Contribution (11 Months)</span>
              <span className="font-medium text-ink">{fmt(totalPaid)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink/50">Month 12 Bonus Benefit</span>
              <span className="font-semibold text-emerald-400">+ {fmt(bonus)}</span>
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold uppercase tracking-wide text-ink/60">Total Redemption Value</span>
                <span className="text-2xl font-black text-accent">{fmt(redemptionValue)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleEnroll}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-accent py-3 text-sm font-bold text-bg transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Enrolling..." : "Enroll in Scheme"}
          </button>
        </div>

        {/* ── Right: Rules + SGX Reward ── */}
        <div className="space-y-4">
          {/* Scheme Rules */}
          <div className="rounded-2xl border border-border bg-panel p-6">
            <div className="mb-3 flex items-center gap-2">
              <svg className="h-4 w-4 text-ink/40" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>
              <h3 className="font-semibold text-ink">Scheme Rules</h3>
            </div>
            <ul className="space-y-2 text-sm text-ink/50">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                Locked for 11 months for maximum value yield.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                Countdown resets every <strong className="text-ink/70">30 days</strong> from start date, not calendar months.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                Standard penalties apply for missed payments. Early/Advance payments accepted.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                Redeemable as 24K gold coins or bars at the end of month 12.
              </li>
            </ul>
          </div>

          {/* SGX / Sagenex Loyalty Reward */}
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
            <h3 className="text-sm font-bold italic text-accent">SGX / Sagenex Loyalty Reward</h3>
            <p className="mt-2 text-sm text-ink/50">
              Existing users investing min <strong className="text-ink/70">Rs 10,000/mo</strong> unlock an additional{" "}
              <strong className="text-accent">250 mg Gold Coin</strong> on top of the 12th-month bonus.
            </p>

            {sgxEligible ? (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Eligibility Code"
                    value={eligibilityCode}
                    onChange={(e) => { setEligibilityCode(e.target.value); setCodeStatus("idle"); }}
                    className="flex-1 rounded-lg border border-border bg-panel-alt px-3 py-2.5 text-sm text-ink placeholder:text-ink/30 focus:border-accent focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={codeLoading}
                    className="rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-bg transition hover:brightness-110 disabled:opacity-50"
                  >
                    {codeLoading ? "..." : "Verify"}
                  </button>
                </div>
                {codeStatus === "valid" && (
                  <p className="mt-2 text-sm text-emerald-400">Code verified! 250mg Gold Coin will be credited on scheme maturity.</p>
                )}
                {codeStatus === "invalid" && (
                  <p className="mt-2 text-sm text-red-400">{codeError || "Invalid code. Please check and try again."}</p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-xs text-ink/30">Select Rs 10,000/mo or higher to qualify for this reward.</p>
            )}
          </div>

          {/* Benefit table */}
          <div className="overflow-x-auto rounded-2xl border border-border bg-panel">
            <div className="border-b border-border bg-panel-alt/50 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/40">Benefit Comparison</p>
            </div>
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink/30">
                <tr>
                  <th className="px-4 py-2">Monthly</th>
                  <th className="px-4 py-2">Total (11 mo)</th>
                  <th className="px-4 py-2">Bonus</th>
                  <th className="px-4 py-2">Redemption</th>
                </tr>
              </thead>
              <tbody>
                {slabs.map((s, i) => (
                  <tr key={s.monthlyPaise} className={`border-t border-border/50 ${i === sliderIndex ? "bg-accent/5" : ""}`}>
                    <td className="px-4 py-2.5 font-medium text-ink">{fmt(s.monthlyPaise)}</td>
                    <td className="px-4 py-2.5 text-ink/60">{fmt(s.monthlyPaise * 11)}</td>
                    <td className="px-4 py-2.5 font-semibold text-emerald-400">+ {fmt(s.bonusPaise)}</td>
                    <td className="px-4 py-2.5 font-bold text-accent">{fmt(s.monthlyPaise * 11 + s.bonusPaise)}</td>
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
