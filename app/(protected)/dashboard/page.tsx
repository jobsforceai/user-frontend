import Link from "next/link";
import { getOverview, getHistorical, type Currency, type Metal, type Range } from "@/actions/assets";
import { getWallet } from "@/actions/wallet";
import { HistoricalChart } from "@/components/ui/historical-chart";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { RefreshTimer } from "@/components/ui/refresh-timer";

const gramsPerOunce = 31.1035;

const currencies: Currency[] = ["INR", "USD", "EUR", "GBP", "AED"];
const ranges: Array<{ key: Range; label: string }> = [
  { key: "1D", label: "Today" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "5M", label: "5M" },
  { key: "1Y", label: "1Y" },
  { key: "5Y", label: "5Y" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { metal?: Metal; currency?: Currency; range?: Range };
}) {
  const metal: Metal = searchParams.metal === "silver" ? "silver" : "gold";
  const currency: Currency = searchParams.currency ?? "INR";
  const range: Range = searchParams.range ?? "1D";

  const [overview, history, wallet] = await Promise.all([
    getOverview(currency),
    getHistorical(metal, currency, range),
    getWallet().catch(() => null),
  ]);

  const gold = overview.assets.gold;
  const silver = overview.assets.silver;
  const activeAsset = metal === "gold" ? gold : silver;

  const goldPrice10g = (gold.price / gramsPerOunce) * 10;
  const silverPrice1kg = (silver.price / gramsPerOunce) * 1000;
  const goldPerGram = gold.price / gramsPerOunce;

  const convertedLivePrice = metal === "gold" ? goldPrice10g : silverPrice1kg;
  const convertedLiveChange = metal === "gold"
    ? (gold.change / gramsPerOunce) * 10
    : (silver.change / gramsPerOunce) * 1000;
  const displayUnit = metal === "gold" ? "Per 10 gm" : "Per 1 kg";
  const accentColor = metal === "gold" ? "#d4a843" : "#9ca3af";
  const isUp = activeAsset.changePercent >= 0;
  const isGoldUp = gold.changePercent >= 0;
  const isSilverUp = silver.changePercent >= 0;

  const convertedHistoryData = history.data.map((point) => ({
    ...point,
    price: metal === "gold" ? (point.price / gramsPerOunce) * 10 : (point.price / gramsPerOunce) * 1000,
  }));

  const balanceGrams = wallet ? wallet.balanceMg / 1000 : 0;
  const balanceValue = balanceGrams * goldPerGram;
  const fmt = (v: number) => formatCurrency(v, "INR");

  // P/L: compare current market value of purchased gold vs what it was worth at avg price
  // Since we don't track totalSpentPaise, use purchased gold at current price as reference
  const totalPurchasedGrams = wallet ? wallet.totalPurchasedMg / 1000 : 0;
  const totalBonusGrams = wallet ? wallet.totalBonusMg / 1000 : 0;
  const purchasedValue = totalPurchasedGrams * goldPerGram;
  const profitFromBonus = totalBonusGrams * goldPerGram;
  const profitPercent = purchasedValue > 0 ? (profitFromBonus / purchasedValue) * 100 : 0;

  const qp = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({ metal, currency, range, ...overrides });
    return `/dashboard?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">

      {/* ── Wallet Summary ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-accent/20 bg-panel p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-ink/40">Gold Balance</p>
            {profitPercent > 0 && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
                +{profitPercent.toFixed(1)}% profit
              </span>
            )}
          </div>
          <p className="mt-1 text-2xl font-bold text-accent">{balanceGrams.toFixed(3)}g</p>
          <p className="text-sm text-ink/50">{fmt(balanceValue)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">Total Purchased</p>
          <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{totalPurchasedGrams.toFixed(3)}g</p>
          <p className="text-sm text-ink/50">{fmt(purchasedValue)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">Bonus Earned</p>
          <p className="mt-1 text-xl font-bold text-emerald-400 sm:text-2xl">{totalBonusGrams.toFixed(3)}g</p>
          <p className="text-sm text-ink/50">{fmt(profitFromBonus)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
          <p className="text-xs uppercase tracking-widest text-ink/40">Current Value</p>
          <p className="mt-1 text-xl font-bold text-ink sm:text-2xl">{fmt(balanceValue)}</p>
          <RefreshTimer intervalSeconds={60} />
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex flex-wrap gap-3">
        <Link href="/buy" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-bg transition hover:brightness-110">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Buy Gold
        </Link>
        <Link href="/sell" className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel px-5 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-panel-alt">
          Sell Gold
        </Link>
        <Link href="/scheme" className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel px-5 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-panel-alt">
          Schemes
        </Link>
        <Link href="/delivery" className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel px-5 py-2.5 text-sm font-medium text-ink/70 transition hover:bg-panel-alt">
          Delivery
        </Link>
      </div>

      {/* ── Live Price Cards ── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Link scroll={false} href={qp({ metal: "gold" })} className={`rounded-2xl border p-5 transition ${metal === "gold" ? "border-accent/40 bg-panel shadow-lg shadow-accent/5" : "border-border bg-panel hover:border-accent/20"}`}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
              <span className="text-sm font-bold text-accent">Au</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-ink">Gold</span>
              <span className={`ml-2 text-xs font-medium ${isGoldUp ? "text-emerald-400" : "text-red-400"}`}>
                {isGoldUp ? "+" : ""}{gold.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-accent">{formatCurrency(goldPrice10g, "INR")}</p>
          <p className="mt-0.5 text-xs text-ink/35">Per 10 grams</p>
        </Link>

        <Link scroll={false} href={qp({ metal: "silver" })} className={`rounded-2xl border p-5 transition ${metal === "silver" ? "border-silver/40 bg-panel shadow-lg shadow-silver/5" : "border-border bg-panel hover:border-silver/20"}`}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-silver/15">
              <span className="text-sm font-bold text-silver">Ag</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-ink">Silver</span>
              <span className={`ml-2 text-xs font-medium ${isSilverUp ? "text-emerald-400" : "text-red-400"}`}>
                {isSilverUp ? "+" : ""}{silver.changePercent.toFixed(2)}%
              </span>
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-silver">{formatCurrency(silverPrice1kg, "INR")}</p>
          <p className="mt-0.5 text-xs text-ink/35">Per 1 kilogram</p>
        </Link>
      </div>

      {/* ── Price Banner ── */}
      <div className="rounded-2xl border border-border bg-panel p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-ink/40">
              {metal === "gold" ? "Gold" : "Silver"} &middot; Live
            </p>
            <div className="mt-1.5 flex items-baseline gap-3">
              <span className={`text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${metal === "gold" ? "text-accent" : "text-silver"}`}>
                {formatCurrency(convertedLivePrice, currency)}
              </span>
              <span className="text-sm text-ink/40">{displayUnit}</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className={`flex items-center gap-1 text-sm font-medium ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                <svg className={`h-3.5 w-3.5 ${isUp ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l7.5-7.5 7.5 7.5" />
                </svg>
                {formatCurrency(Math.abs(convertedLiveChange), currency)}
              </span>
              <span className={`text-sm ${isUp ? "text-emerald-400/70" : "text-red-400/70"}`}>
                ({formatPercent(activeAsset.changePercent)})
              </span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {currencies.map((c) => (
              <Link
                scroll={false}
                key={c}
                href={qp({ currency: c })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  currency === c ? "bg-panel-alt text-ink" : "text-ink/40 hover:text-ink/70"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div className="rounded-2xl border border-border bg-panel p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink/50">
            {metal === "gold" ? "Gold" : "Silver"} Trend &middot; {displayUnit}
          </p>
          <div className="flex gap-1">
            {ranges.map((r) => (
              <Link
                scroll={false}
                key={r.key}
                href={qp({ range: r.key })}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  range === r.key
                    ? metal === "gold" ? "bg-accent/15 text-accent" : "bg-silver/15 text-silver"
                    : "text-ink/40 hover:text-ink/60"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="h-64 w-full md:h-72">
          <HistoricalChart title="" currency={currency} color={accentColor} range={range} data={convertedHistoryData} />
        </div>
      </div>

      {/* ── Wallet Link ── */}
      <div className="rounded-2xl border border-border bg-panel p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">Wallet &amp; Transactions</h2>
            <p className="text-sm text-ink/40">View your full transaction history and bonus progress</p>
          </div>
          <Link href="/wallet" className="rounded-lg bg-accent/15 px-4 py-2 text-center text-sm font-semibold text-accent transition hover:bg-accent/25 sm:text-left">
            View Wallet
          </Link>
        </div>
      </div>
    </div>
  );
}
