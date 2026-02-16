import Link from "next/link";
import Image from "next/image";
import { getOverview, getHistorical, type Currency, type Metal, type Range } from "@/actions/assets";
import { getWallet } from "@/actions/wallet";
import { HistoricalChart } from "@/components/ui/historical-chart";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { RefreshTimer } from "@/components/ui/refresh-timer";

const gramsPerOunce = 31.1035;

const currencies: Currency[] = ["INR", "USD", "EUR", "GBP", "AED"];
const ranges: Array<{ key: Range; label: string }> = [
  { key: "1D", label: "1D" },
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
    <div className="mx-auto max-w-6xl space-y-8 pb-8">

      {/* ── Hero: Portfolio Overview ── */}
      <section className="relative overflow-hidden rounded-3xl border border-accent/15 bg-gradient-to-br from-panel via-panel to-accent/[0.04] p-6 shadow-card sm:p-8">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/[0.04] blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* Left: Balance */}
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="SG Gold" width={32} height={32} className="h-8 w-8 rounded-md object-cover" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink/35">Your Gold Portfolio</p>
            </div>
            <div className="mt-4 flex items-baseline gap-4">
              <h1 className="text-4xl font-black tracking-tight text-ink sm:text-5xl">{balanceGrams.toFixed(3)}<span className="ml-1.5 text-xl font-semibold text-ink/40">g</span></h1>
              {profitPercent > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l7.5-7.5 7.5 7.5" /></svg>
                  {profitPercent.toFixed(1)}%
                </span>
              )}
            </div>
            <p className="mt-1 text-lg font-medium text-accent">{fmt(balanceValue)}</p>
            <RefreshTimer intervalSeconds={60} />
          </div>

          {/* Right: Quick stats */}
          <div className="flex flex-wrap gap-6 lg:gap-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30">Purchased</p>
              <p className="mt-1 text-xl font-bold text-ink">{totalPurchasedGrams.toFixed(3)}g</p>
              <p className="text-xs text-ink/40">{fmt(purchasedValue)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30">Bonus</p>
              <p className="mt-1 text-xl font-bold text-emerald-400">{totalBonusGrams.toFixed(3)}g</p>
              <p className="text-xs text-ink/40">{fmt(profitFromBonus)}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30">Current Value</p>
              <p className="mt-1 text-xl font-bold text-ink">{fmt(balanceValue)}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative mt-6 flex flex-wrap gap-2.5 border-t border-border/50 pt-6">
          <Link href="/buy" className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-bg shadow-sm transition hover:brightness-110">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Buy Gold
          </Link>
          <Link href="/sell" className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel-alt/50 px-5 py-2.5 text-sm font-medium text-ink/60 transition hover:border-accent/30 hover:text-ink/80">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l7.5-7.5 7.5 7.5" /></svg>
            Sell Gold
          </Link>
          <Link href="/scheme" className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel-alt/50 px-5 py-2.5 text-sm font-medium text-ink/60 transition hover:border-accent/30 hover:text-ink/80">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            Schemes
          </Link>
          <Link href="/delivery" className="inline-flex items-center gap-2 rounded-xl border border-border bg-panel-alt/50 px-5 py-2.5 text-sm font-medium text-ink/60 transition hover:border-accent/30 hover:text-ink/80">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.029-.504 1.029-1.125v-3.505a1.125 1.125 0 00-.311-.78l-2.511-2.511a1.125 1.125 0 00-.78-.311H14.25M3.75 16.5V4.875c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v11.625" /></svg>
            Delivery
          </Link>
        </div>
      </section>

      {/* ── Live Price Cards ── */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Link
          scroll={false}
          href={qp({ metal: "gold" })}
          className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 ${
            metal === "gold"
              ? "border-accent/30 bg-panel ring-1 ring-accent/10 shadow-lg shadow-accent/5"
              : "border-border bg-panel hover:border-accent/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent ring-2 ring-accent/10">Au</div>
              <div>
                <p className="text-sm font-semibold text-ink">Gold</p>
                <p className="text-[10px] uppercase tracking-wider text-ink/30">Per 10 grams</p>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isGoldUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {isGoldUp ? "+" : ""}{gold.changePercent.toFixed(2)}%
            </span>
          </div>
          <p className="mt-4 text-3xl font-black tracking-tight text-accent">{formatCurrency(goldPrice10g, "INR")}</p>
          {metal === "gold" && <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/[0.06] blur-2xl" />}
        </Link>

        <Link
          scroll={false}
          href={qp({ metal: "silver" })}
          className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-200 ${
            metal === "silver"
              ? "border-silver/30 bg-panel ring-1 ring-silver/10 shadow-lg shadow-silver/5"
              : "border-border bg-panel hover:border-silver/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-silver/15 text-sm font-bold text-silver ring-2 ring-silver/10">Ag</div>
              <div>
                <p className="text-sm font-semibold text-ink">Silver</p>
                <p className="text-[10px] uppercase tracking-wider text-ink/30">Per 1 kilogram</p>
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${isSilverUp ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
              {isSilverUp ? "+" : ""}{silver.changePercent.toFixed(2)}%
            </span>
          </div>
          <p className="mt-4 text-3xl font-black tracking-tight text-silver">{formatCurrency(silverPrice1kg, "INR")}</p>
          {metal === "silver" && <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-silver/[0.06] blur-2xl" />}
        </Link>
      </section>

      {/* ── Price Detail + Chart ── */}
      <section className="grid gap-4 lg:grid-cols-5">
        {/* Price Banner — 2 cols */}
        <div className="rounded-2xl border border-border bg-panel p-6 shadow-card lg:col-span-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/30">
            {metal === "gold" ? "Gold" : "Silver"} &middot; Live
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-black tracking-tight ${metal === "gold" ? "text-accent" : "text-silver"}`}>
              {formatCurrency(convertedLivePrice, currency)}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink/35">{displayUnit}</p>

          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-sm font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
              <svg className={`h-3.5 w-3.5 ${isUp ? "" : "rotate-180"}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l7.5-7.5 7.5 7.5" />
              </svg>
              {formatCurrency(Math.abs(convertedLiveChange), currency)}
            </span>
            <span className={`text-xs ${isUp ? "text-emerald-400/60" : "text-red-400/60"}`}>
              ({formatPercent(activeAsset.changePercent)})
            </span>
          </div>

          {/* Currency pills */}
          <div className="mt-6 flex flex-wrap gap-1.5">
            {currencies.map((c) => (
              <Link
                scroll={false}
                key={c}
                href={qp({ currency: c })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  currency === c
                    ? metal === "gold" ? "bg-accent/15 text-accent" : "bg-silver/15 text-silver"
                    : "text-ink/30 hover:bg-panel-alt hover:text-ink/60"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Chart — 3 cols */}
        <div className="rounded-2xl border border-border bg-panel p-6 shadow-card lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/35">
              {metal === "gold" ? "Gold" : "Silver"} Trend
            </p>
            <div className="flex gap-1">
              {ranges.map((r) => (
                <Link
                  scroll={false}
                  key={r.key}
                  href={qp({ range: r.key })}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    range === r.key
                      ? metal === "gold" ? "bg-accent/15 text-accent" : "bg-silver/15 text-silver"
                      : "text-ink/30 hover:bg-panel-alt hover:text-ink/60"
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
      </section>

      {/* ── Wallet CTA ── */}
      <section className="group relative overflow-hidden rounded-2xl border border-border bg-panel p-6 shadow-card transition hover:border-accent/20">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/[0.04] blur-2xl transition-all group-hover:bg-accent/[0.07]" />
        <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10">
              <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Wallet & Transactions</h2>
              <p className="text-sm text-ink/35">Full history, bonus progress, and storage benefits</p>
            </div>
          </div>
          <Link href="/wallet" className="rounded-xl bg-accent/10 px-5 py-2.5 text-sm font-bold text-accent transition hover:bg-accent/20">
            View Wallet &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
}
