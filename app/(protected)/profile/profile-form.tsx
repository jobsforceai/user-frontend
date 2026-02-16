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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-panel p-4 shadow-card sm:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-ink/40">Edit Profile</h2>

      {error && <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>}
      {success && <div className="mb-4 rounded-lg border border-green-800/50 bg-green-900/20 px-3 py-2 text-sm text-green-400">{success}</div>}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm text-ink/70">Full Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-ink/70">Email <span className="text-ink/30">(optional)</span></label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink placeholder:text-ink/30 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
