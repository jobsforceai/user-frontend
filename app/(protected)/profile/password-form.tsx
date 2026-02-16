"use client";

import { useState } from "react";
import { changePassword } from "@/actions/auth";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    const result = await changePassword({ currentPassword, newPassword });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-panel p-4 shadow-card sm:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-ink/40">Change Password</h2>

      {error && <div className="mb-4 rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>}
      {success && <div className="mb-4 rounded-lg border border-green-800/50 bg-green-900/20 px-3 py-2 text-sm text-green-400">{success}</div>}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="currentPassword" className="text-sm text-ink/70">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-sm text-ink/70">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min 6 characters"
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink placeholder:text-ink/30 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmNewPassword" className="text-sm text-ink/70">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-border bg-panel-alt px-5 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-ink/5 disabled:opacity-50"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
