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
    <form onSubmit={handleSubmit} className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Change Password</h2>

      {error && <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-300">{error}</div>}
      {success && <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/12 px-3 py-2 text-sm text-emerald-300">{success}</div>}

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="currentPassword" className="text-sm text-[#d7ddf1]">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="newPassword" className="text-sm text-[#d7ddf1]">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Min 6 characters"
            className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] placeholder:text-[#6f7898] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirmNewPassword" className="text-sm text-[#d7ddf1]">Confirm New Password</label>
          <input
            id="confirmNewPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-[#4a5270] bg-[#20263a] px-5 py-2.5 text-sm font-semibold text-[#d7ddf1] transition hover:border-[#d7af35]/45 hover:text-[#f6d97f] disabled:opacity-50"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </div>
    </form>
  );
}
