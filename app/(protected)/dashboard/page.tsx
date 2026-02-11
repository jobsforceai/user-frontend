import Link from "next/link";
import { getOverview } from "@/actions/assets";

const gramsPerOunce = 31.1035;

export default async function DashboardPage() {
  const overview = await getOverview("INR");
  const goldPerGram = overview.assets.gold.price / gramsPerOunce;
  const silverPerGram = overview.assets.silver.price / gramsPerOunce;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-ink/50">Welcome to SG Gold</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-panel p-5">
          <p className="text-xs tracking-widest text-ink/40">GOLD</p>
          <p className="mt-2 text-2xl font-semibold text-accent">
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(goldPerGram)}
            <span className="ml-1 text-sm font-normal text-ink/40">/gram</span>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-5">
          <p className="text-xs tracking-widest text-ink/40">SILVER</p>
          <p className="mt-2 text-2xl font-semibold text-silver">
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(silverPerGram)}
            <span className="ml-1 text-sm font-normal text-ink/40">/gram</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/buy"
          className="flex items-center justify-center rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center font-medium text-accent transition hover:bg-accent/10"
        >
          Buy Gold
        </Link>
        <Link
          href="/sell"
          className="flex items-center justify-center rounded-2xl border border-border bg-panel p-5 text-center font-medium text-ink/70 transition hover:bg-panel-alt"
        >
          Sell Gold
        </Link>
        <Link
          href="/scheme"
          className="flex items-center justify-center rounded-2xl border border-border bg-panel p-5 text-center font-medium text-ink/70 transition hover:bg-panel-alt"
        >
          11-Month Scheme
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-5">
        <h2 className="text-lg font-semibold">Wallet</h2>
        <p className="mt-1 text-sm text-ink/50">Your gold wallet will appear here once you make your first purchase.</p>
        <Link href="/wallet" className="mt-3 inline-block text-sm text-accent hover:underline">
          View Wallet
        </Link>
      </div>
    </div>
  );
}
