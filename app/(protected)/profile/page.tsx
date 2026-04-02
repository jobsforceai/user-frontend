import { getMe } from "@/actions/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";
import { JewellerRequest } from "./jeweller-request";

export default async function ProfilePage() {
  const user = await getMe();
  if (!user) redirect("/login");

  const slabLabels: Record<number, string> = {
    2500000: "Rs 25,000",
    5000000: "Rs 50,000",
    20000000: "Rs 2,00,000",
    50000000: "Rs 5,00,000",
  };

  const dailyLimits: Record<number, string> = {
    2500000: "100g / day",
    5000000: "250g / day",
    20000000: "500g / day",
    50000000: "Up to 1 kg / day",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#725eb5]/16 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">Identity Center</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff]">Profile</h1>
          <p className="mt-2 text-sm text-[#b4bdd5]">Manage account identity, security controls, and jeweller access status.</p>
        </div>
      </section>

      <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#8f98b3]">Phone</p>
            <p className="mt-0.5 font-medium text-[#eef2ff]">{user.phone}</p>
          </div>
          <div>
            <p className="text-xs text-[#8f98b3]">Account Type</p>
            <p className="mt-0.5 font-medium capitalize text-[#eef2ff]">{user.accountType}</p>
          </div>
        </div>
      </div>

      {/* Jeweller Status (if applicable) */}
      {user.jewellerStatus === "approved" && user.jewellerSubscriptionSlabPaise && (
        <div className="rounded-3xl border border-emerald-500/25 bg-emerald-500/10 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-300">Jeweller Account</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-emerald-100/80">Subscription Tier</p>
              <p className="mt-0.5 font-semibold text-emerald-200">
                {slabLabels[user.jewellerSubscriptionSlabPaise] ?? `Rs ${(user.jewellerSubscriptionSlabPaise / 100).toLocaleString("en-IN")}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-emerald-100/80">Daily Limit</p>
              <p className="mt-0.5 font-semibold text-emerald-50">
                {dailyLimits[user.jewellerSubscriptionSlabPaise] ?? "—"}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-emerald-100/80">1.5% tax | 3-day settlement</p>
        </div>
      )}

      {/* Edit Profile */}
      <ProfileForm name={user.name} email={user.email ?? ""} />

      {/* Change Password */}
      <PasswordForm />

      {/* Jeweller Request */}
      {user.accountType === "regular" && (
        <JewellerRequest status={user.jewellerStatus} />
      )}
    </div>
  );
}
