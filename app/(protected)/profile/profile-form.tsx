"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/actions/auth";

export function ProfileForm({ name: initialName, email: initialEmail }: { name: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await updateProfile({ name, email: email || undefined });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Profile updated");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Edit Profile</h2>

      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-300">{error}</div>}
      {success && <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/12 px-3 py-2 text-sm text-emerald-300">{success}</div>}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm text-[#d7ddf1]">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-[#d7ddf1]">Email <span className="text-[#8f98b3]">(optional)</span></label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#d7af35] px-5 py-2.5 text-sm font-extrabold text-[#171b28] transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
