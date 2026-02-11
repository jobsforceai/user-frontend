import { getMe } from "@/actions/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getMe();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="space-y-4 rounded-2xl border border-border bg-panel p-6">
        <div>
          <p className="text-xs text-ink/40">Name</p>
          <p className="text-ink">{user.name}</p>
        </div>
        <div>
          <p className="text-xs text-ink/40">Phone</p>
          <p className="text-ink">{user.phone}</p>
        </div>
        {user.email && (
          <div>
            <p className="text-xs text-ink/40">Email</p>
            <p className="text-ink">{user.email}</p>
          </div>
        )}
        <div>
          <p className="text-xs text-ink/40">Account Type</p>
          <p className="capitalize text-ink">{user.accountType}</p>
        </div>
      </div>
    </div>
  );
}
