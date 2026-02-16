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
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold">Wallet</h1>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <div className="col-span-2 rounded-2xl border border-border bg-panel p-4 sm:col-span-1 sm:p-5">
          <p className="text-xs text-ink/40">Gold Balance</p>
          <p className="mt-1 text-xl font-semibold text-accent sm:text-2xl">{balanceGrams.toFixed(3)}g</p>
          <p className="text-sm text-ink/50">{fmt(balanceValue)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <p className="text-xs text-ink/40">Total Purchased</p>
          <p className="mt-1 text-xl font-semibold sm:text-2xl">{(wallet.totalPurchasedMg / 1000).toFixed(3)}g</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <p className="text-xs text-ink/40">Bonus Earned</p>
          <p className="mt-1 text-xl font-semibold text-green-400 sm:text-2xl">{(wallet.totalBonusMg / 1000).toFixed(3)}g</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5 space-y-3">
        <p className="text-sm font-medium">First 1g Bonus Progress</p>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-ink/50">
            <span>Purchased: {purchaseProgress}mg / 1000mg</span>
            <span>Bonus: {bonusProgress}mg / 100mg</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-2 rounded-full bg-accent transition-all"
              style={{ width: `${(purchaseProgress / 1000) * 100}%` }}
            />
          </div>
          {purchaseProgress >= 1000 ? (
            <p className="text-xs text-green-400">Bonus fully claimed!</p>
          ) : (
            <p className="text-xs text-ink/40">Buy {((1000 - purchaseProgress) / 1000).toFixed(3)}g more to complete the bonus</p>
          )}
        </div>
      </div>

      {/* Storage Benefit */}
      {storageBenefit && <StorageBenefitCard status={storageBenefit} />}

      <div className="rounded-2xl border border-border bg-panel">
        <div className="border-b border-border px-5 py-3">
          <p className="text-sm font-medium">Transaction History</p>
        </div>
        {txResult.transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-ink/50">No transactions yet</div>
        ) : (
          <div className="divide-y divide-border">
            {txResult.transactions.map((tx) => (
              <div key={tx._id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{tx.type}</p>
                  <p className="text-xs text-ink/40">{new Date(tx.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.type === "sell" || tx.type === "withdrawal" ? "text-red-400" : "text-green-400"}`}>
                    {tx.type === "sell" || tx.type === "withdrawal" ? "-" : "+"}{(tx.amountMg / 1000).toFixed(3)}g
                  </p>
                  {tx.totalPaise > 0 && (
                    <p className="text-xs text-ink/40">{fmt(tx.totalPaise / 100)}</p>
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
