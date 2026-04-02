import { getWallet, getTransactions, getStorageBenefitStatus } from "@/actions/wallet";
import { getOverview } from "@/actions/assets";
import { StorageBenefitCard } from "./storage-benefit-card";

const gramsPerOunce = 31.1035;

export default async function WalletPage() {
  let wallet, txResult, goldPerGram, storageBenefit;

  try {
    const [w, t, overview, sb] = await Promise.all([
      getWallet(),
      getTransactions(1, 20),
      getOverview("INR"),
      getStorageBenefitStatus().catch(() => null),
    ]);
    wallet = w;
    txResult = t;
    goldPerGram = overview.assets.gold.price / gramsPerOunce;
    storageBenefit = sb;
  } catch {
    return (
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">Wallet</h1>
        <p className="mt-2 text-sm text-ink/50">Unable to load wallet. Please try again.</p>
      </div>
    );
  }

  const balanceGrams = wallet.balanceMg / 1000;
  const balanceValue = balanceGrams * goldPerGram;
  const bonusProgress = Math.min(wallet.totalBonusMg, 100);
  const purchaseProgress = Math.min(wallet.totalPurchasedMg, 1000);
  const fmt = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(v);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#2e7d61]/16 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">Vault Summary</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff]">Wallet</h1>
            <p className="mt-2 text-sm text-[#b4bdd5]">Monitor holdings, bonus milestones, and full transaction history.</p>
          </div>
          <div className="rounded-2xl border border-[#4a5270] bg-[#232a3f]/90 px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#8f98b3]">Current Value</p>
            <p className="mt-1 text-2xl font-black text-[#f8df8a]">{fmt(balanceValue)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-[#404964] bg-[#1a2032]/95 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-xs text-[#8f98b3]">Gold Balance</p>
          <p className="mt-1 text-2xl font-black text-[#f8df8a]">{balanceGrams.toFixed(3)}g</p>
          <p className="text-xs text-[#aab2ca]">{fmt(balanceValue)}</p>
        </div>
        <div className="rounded-2xl border border-[#404964] bg-[#1a2032]/95 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-xs text-[#8f98b3]">Total Purchased</p>
          <p className="mt-1 text-2xl font-bold text-[#eef2ff]">{(wallet.totalPurchasedMg / 1000).toFixed(3)}g</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-xs text-[#d5f6e0]">Bonus Earned</p>
          <p className="mt-1 text-2xl font-bold text-emerald-300">{(wallet.totalBonusMg / 1000).toFixed(3)}g</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
        <p className="text-sm font-semibold text-[#eef2ff]">First 1g Bonus Progress</p>
        <div className="mt-3 space-y-2">
          <div className="flex justify-between text-xs text-[#aab2ca]">
            <span>Purchased: {purchaseProgress}mg / 1000mg</span>
            <span>Bonus: {bonusProgress}mg / 100mg</span>
          </div>
          <div className="h-2 rounded-full bg-[#2c344c]">
            <div
              className="h-2 rounded-full bg-[#d7af35] transition-all"
              style={{ width: `${(purchaseProgress / 1000) * 100}%` }}
            />
          </div>
          {purchaseProgress >= 1000 ? (
            <p className="text-xs text-emerald-300">Bonus fully claimed.</p>
          ) : (
            <p className="text-xs text-[#aab2ca]">Buy {((1000 - purchaseProgress) / 1000).toFixed(3)}g more to complete the bonus.</p>
          )}
        </div>
      </div>

      {storageBenefit && <StorageBenefitCard status={storageBenefit} />}

      <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
        <div className="border-b border-[#3f4762] px-5 py-3">
          <p className="text-sm font-semibold text-[#eef2ff]">Transaction History</p>
        </div>
        {txResult.transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-[#aab2ca]">No transactions yet.</div>
        ) : (
          <div className="divide-y divide-[#2c344c]">
            {txResult.transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-[#eef2ff]">{tx.type}</p>
                  <p className="text-xs text-[#8f98b3]">{new Date(tx.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === "sell" || tx.type === "withdrawal" ? "text-red-300" : "text-emerald-300"}`}>
                    {tx.type === "sell" || tx.type === "withdrawal" ? "-" : "+"}{(tx.amountMg / 1000).toFixed(3)}g
                  </p>
                  {tx.totalPaise > 0 && (
                    <p className="text-xs text-[#8f98b3]">{fmt(tx.totalPaise / 100)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
