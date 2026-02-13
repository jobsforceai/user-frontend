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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-ink/50">Manage your account details</p>
      </div>

      {/* Account Info (read-only) */}
      <div className="rounded-2xl border border-border bg-panel p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-ink/40">Account</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-ink/40">Phone</p>
            <p className="mt-0.5 font-medium text-ink">{user.phone}</p>
          </div>
          <div>
            <p className="text-xs text-ink/40">Account Type</p>
            <p className="mt-0.5 font-medium capitalize text-ink">{user.accountType}</p>
          </div>
        </div>
      </div>

      {/* Jeweller Status (if applicable) */}
      {user.jewellerStatus === "approved" && user.jewellerSubscriptionSlabPaise && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">Jeweller Account</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-ink/40">Subscription Tier</p>
              <p className="mt-0.5 font-semibold text-emerald-400">
                {slabLabels[user.jewellerSubscriptionSlabPaise] ?? `Rs ${(user.jewellerSubscriptionSlabPaise / 100).toLocaleString("en-IN")}`}
              </p>
            </div>
            <div>
              <p className="text-xs text-ink/40">Daily Limit</p>
              <p className="mt-0.5 font-semibold text-ink">
                {dailyLimits[user.jewellerSubscriptionSlabPaise] ?? "—"}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink/30">1.5% tax &middot; 3-day settlement</p>
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
