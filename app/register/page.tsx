"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { register } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const result = await register({
      phone,
      password,
      name,
      email: email || undefined,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1220] px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(215,175,53,0.14),transparent_38%),radial-gradient(circle_at_82%_18%,rgba(114,94,181,0.2),transparent_42%),radial-gradient(circle_at_40%_100%,rgba(49,93,140,0.16),transparent_38%)]" />

      <div className="relative grid w-full max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden overflow-hidden rounded-[30px] border border-[#4a5270] bg-[#1b2236]/95 p-8 shadow-[0_26px_60px_rgba(0,0,0,0.36)] lg:block">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f6d97f]">New Investor Access</h2>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#eef2ff]">Create Account</h1>
          <p className="mt-3 max-w-md text-sm text-[#b4bdd5]">Join SG Gold to start building holdings with live pricing, flexible plans, and delivery options.</p>
          <div className="mt-6 space-y-3 text-sm text-[#d0d7ee]">
            <div className="rounded-xl border border-[#3f4762] bg-[#20263a]/90 px-4 py-3">Track portfolio value in real time across dashboard and wallet.</div>
            <div className="rounded-xl border border-[#3f4762] bg-[#20263a]/90 px-4 py-3">Use buy, sell, scheme, and delivery workflows in one platform.</div>
            <div className="rounded-xl border border-[#3f4762] bg-[#20263a]/90 px-4 py-3">Manage account security and profile controls from one place.</div>
          </div>
        </section>

        <section className="w-full space-y-7 rounded-[30px] border border-[#4a5270] bg-[#1b2236]/95 p-7 shadow-[0_26px_60px_rgba(0,0,0,0.36)] sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-[#d7af35]/30 bg-[#111625]">
              <Image src="/logo.png" alt="SG Gold" width={56} height={56} className="h-full w-full object-cover" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-[#eef2ff]">Register</h1>
            <p className="mt-1 text-sm text-[#b4bdd5]">Start your SG Gold journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-4 py-2.5 text-sm text-red-300">{error}</div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-4 py-3 text-[#eef2ff] transition placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:ring-2 focus:ring-[#d7af35]/15 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                required
                className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-4 py-3 text-[#eef2ff] transition placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:ring-2 focus:ring-[#d7af35]/15 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Email <span className="text-[#6f7898]">(optional)</span></label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-4 py-3 text-[#eef2ff] transition placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:ring-2 focus:ring-[#d7af35]/15 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-4 py-3 text-[#eef2ff] transition placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:ring-2 focus:ring-[#d7af35]/15 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
                className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-4 py-3 text-[#eef2ff] transition placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:ring-2 focus:ring-[#d7af35]/15 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#d7af35] py-3 text-sm font-extrabold text-[#171b28] shadow-sm transition hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[#aab2ca]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#f6d97f] hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
