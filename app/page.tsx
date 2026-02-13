import Link from "next/link";
import { cookies } from "next/headers";
import { HistoricalChart } from "@/components/ui/historical-chart";
import { RateTable } from "@/components/ui/rate-table";
import {
  getGoldRates,
  getHistorical,
  getOverview,
  getSilverRates,
  type Currency,
  type Metal,
  type Range
} from "@/actions/assets";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { RefreshTimer } from "@/components/ui/refresh-timer";
import { RegionSelect } from "@/components/ui/region-select";

const fallbackCurrency: Currency = "INR";
const fallbackRange: Range = "1D";
const fallbackMetal: Metal = "gold";
const gramsPerOunce = 31.1035;
export const dynamic = "force-dynamic";

const currencies: Currency[] = ["INR", "USD", "EUR", "GBP", "AED"];

const countries: Array<{ currency: Currency; label: string }> = [
  { currency: "INR", label: "India" },
  { currency: "USD", label: "USA" },
  { currency: "GBP", label: "United Kingdom" },
  { currency: "EUR", label: "Europe" },
  { currency: "AED", label: "UAE" },
];

const indianStates = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Kerala",
  "Maharashtra", "Gujarat", "Rajasthan", "Delhi", "Uttar Pradesh",
  "West Bengal", "Bihar", "Odisha", "Madhya Pradesh", "Punjab",
];

const ranges: Array<{ key: Range; label: string }> = [
  { key: "1D", label: "Today" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "5M", label: "5M" },
  { key: "1Y", label: "1Y" },
  { key: "5Y", label: "5Y" },
  { key: "10Y", label: "10Y" }
];

const schemeSlabs = [
  { monthly: "5,000", bonus: "10,000" },
  { monthly: "10,000", bonus: "20,000" },
  { monthly: "25,000", bonus: "50,000" },
  { monthly: "50,000", bonus: "1,00,000" },
  { monthly: "1,00,000", bonus: "2,00,000" },
];

const stores = [
  "Vizag", "Vijayawada", "Hyderabad", "Rajahmundry",
  "Bhimavaram", "Anakapalli", "Tirupati", "Guntur",
  "Nellore", "Kakinada","Khammam", "Warangal"
];

export default async function Home({
  searchParams
}: {
  searchParams: { metal?: Metal; currency?: Currency; range?: Range; purity?: string; state?: string };
}) {
  const metal = searchParams.metal === "silver" ? "silver" : fallbackMetal;
  const currency = searchParams.currency ?? fallbackCurrency;
  const range = searchParams.range ?? fallbackRange;
  const purity = metal === "gold" ? (searchParams.purity === "22K" ? "22K" : searchParams.purity === "18K" ? "18K" : "24K") : "999";
  const purityFactor = purity === "22K" ? 22 / 24 : purity === "18K" ? 18 / 24 : 1;
  const selectedState = searchParams.state ?? "Andhra Pradesh";
  const activeCountry = countries.find((c) => c.currency === currency) ?? countries[0];

  const [overview, history, goldRates, silverRates] = await Promise.all([
    getOverview(currency),
    getHistorical(metal, currency, range),
    getGoldRates(currency),
    getSilverRates(currency)
  ]);

  const gold = overview.assets.gold;
  const silver = overview.assets.silver;

  const goldPerGram = gold.price / gramsPerOunce;
  const silverPerGram = silver.price / gramsPerOunce;
  const goldPrice10g = goldPerGram * 10;
  const silverPrice1kg = silverPerGram * 1000;

  const activeRates = metal === "gold" ? goldRates : silverRates;
  const activeAsset = metal === "gold" ? gold : silver;
  const accentColor = metal === "gold" ? "#d4a843" : "#9ca3af";
  const displayUnitLabel = metal === "gold" ? "Per 10 gm" : "Per 1 kg";
  const convertedLivePrice = (metal === "gold" ? goldPrice10g : silverPrice1kg) * purityFactor;
  const convertedLiveChange = (metal === "gold"
    ? (gold.change / gramsPerOunce) * 10
    : (silver.change / gramsPerOunce) * 1000) * purityFactor;
  const isMockSource = activeRates.source === "mock";
  const isActiveUp = activeAsset.changePercent >= 0;
  const isGoldUp = gold.changePercent >= 0;
  const isSilverUp = silver.changePercent >= 0;

  const convertedHistoryData = history.data.map((point) => ({
    ...point,
    price: metal === "gold" ? (point.price / gramsPerOunce) * 10 : (point.price / gramsPerOunce) * 1000
  }));

  const isLoggedIn = cookies().has("sg_token");
  const authHref = (path: string) => isLoggedIn ? path : "/register";

  return (
    <main className="min-h-screen bg-bg">

      {/* ───────────────────── NAVBAR ───────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border/60 bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent shadow-lg shadow-accent/20">
              <span className="text-sm font-black text-bg">SG</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-ink">SG Gold</span>
          </Link>
          <div className="flex items-center gap-2.5">
            {isLoggedIn ? (
              <Link href="/dashboard" className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-bg transition hover:brightness-110">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-ink/70 transition hover:text-ink">
                  Sign in
                </Link>
                <Link href="/register" className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-bg transition hover:brightness-110">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-accent/4" />
        <div className="absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 md:px-8 md:pb-16 md:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            {/* Left — copy */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-accent">Live prices updated every minute</span>
              </div>
              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">
                Invest in{" "}
                <span className="bg-gradient-to-r from-accent to-yellow-500 bg-clip-text text-transparent">
                  Digital Gold
                </span>
                <br />with confidence
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-ink/50 md:text-lg">
                Buy &amp; sell gold at live market prices. Start a monthly savings scheme with 2x bonus.
                Take physical delivery at 11+ stores.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={authHref("/buy")} className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 text-sm font-bold text-bg shadow-lg shadow-accent/25 transition hover:brightness-110">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  Buy Gold
                </Link>
                <Link href={authHref("/scheme")} className="inline-flex items-center gap-2 rounded-xl border border-accent/40 px-7 py-3.5 text-sm font-semibold text-accent transition hover:bg-accent/10">
                  Start Scheme
                </Link>
                <Link href={authHref("/sell")} className="inline-flex items-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-medium text-ink/50 transition hover:border-ink/30 hover:text-ink/70">
                  Sell Gold
                </Link>
              </div>
            </div>

            {/* Right — price cards */}
            <div className="grid gap-3 sm:grid-cols-2">
              <Link scroll={false} href="/?metal=gold&currency=INR&range=1D" className="group rounded-2xl border border-accent/20 bg-panel p-5 transition hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5">
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

              <Link scroll={false} href="/?metal=silver&currency=INR&range=1D" className="group rounded-2xl border border-silver/20 bg-panel p-5 transition hover:border-silver/40 hover:shadow-lg hover:shadow-silver/5">
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

              {/* First 1g Bonus mini-card */}
              <div className="col-span-full rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15">
                    <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">New user bonus</p>
                    <p className="text-xs text-ink/40">Get 10% extra gold on every buy until your first 1 gram</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── LIVE MARKET RATES ───────────────────── */}
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 md:py-14">

        {/* Section heading */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400">Live</span>
            </div>
            <h2 className="text-3xl font-black italic text-ink">Live Market Rates</h2>
            <p className="mt-1 text-sm text-ink/40">Real-time interbank rates for Gold and Silver. Select your region for accurate localized pricing including taxes.</p>
          </div>
          <RefreshTimer intervalSeconds={60} />
        </div>

        {/* ── Two side-by-side price cards (Gold + Silver) ── */}
        <div className="grid gap-5 md:grid-cols-2">

          {/* Gold Card */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-panel to-panel-alt p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-ink">Gold</h3>
                <span className="mt-1 inline-block rounded-full bg-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-accent">
                  {purity} {purity === "24K" ? "99.9% PURE" : purity === "22K" ? "91.6% PURE" : "75% PURE"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-accent">
                  {formatCurrency(goldPerGram * purityFactor, currency)}
                  <span className="text-sm font-normal text-ink/40">/g</span>
                </p>
                <p className={`mt-0.5 text-sm font-medium ${isGoldUp ? "text-emerald-400" : "text-red-400"}`}>
                  {isGoldUp ? "+" : ""}{gold.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Country / State */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <RegionSelect
                type="country"
                value={currency}
                options={countries.map((c) => ({ value: c.currency, label: c.label }))}
                hrefTemplate={`/?metal=${metal}&currency={VALUE}&range=${range}&purity=${purity}&state=${selectedState}`}
              />
              {currency === "INR" ? (
                <RegionSelect
                  type="state"
                  value={selectedState}
                  options={indianStates.map((s) => ({ value: s, label: s }))}
                  hrefTemplate={`/?metal=${metal}&currency=${currency}&range=${range}&purity=${purity}&state={VALUE}`}
                />
              ) : (
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-ink/30">State</p>
                  <div className="rounded-lg border border-border bg-panel-alt px-3 py-2 text-sm text-ink/40">—</div>
                </div>
              )}
            </div>

            {/* Purity tabs */}
            <div className="mt-4 flex overflow-hidden rounded-xl border border-border bg-panel-alt">
              {(["24K", "22K", "18K"] as const).map((p) => (
                <Link
                  scroll={false}
                  key={p}
                  href={`/?metal=${metal}&currency=${currency}&range=${range}&purity=${p}&state=${selectedState}`}
                  className={`flex-1 py-2.5 text-center text-sm font-semibold transition ${
                    purity === p ? "bg-accent text-bg" : "text-ink/50 hover:text-ink"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {/* Buy / Sell */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href={authHref("/buy")} className="rounded-xl bg-accent py-3 text-center text-sm font-bold text-bg transition hover:brightness-110">
                Buy
              </Link>
              <Link href={authHref("/sell")} className="rounded-xl border border-accent/40 py-3 text-center text-sm font-semibold text-accent transition hover:bg-accent/10">
                Sell
              </Link>
            </div>
          </div>

          {/* Silver Card */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-panel to-panel-alt p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-ink">Silver</h3>
                <span className="mt-1 inline-block rounded-full bg-silver/15 px-2.5 py-0.5 text-[10px] font-bold text-silver">
                  99.9% PURE
                </span>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-silver">
                  {formatCurrency(silverPerGram, currency)}
                  <span className="text-sm font-normal text-ink/40">/g</span>
                </p>
                <p className={`mt-0.5 text-sm font-medium ${isSilverUp ? "text-emerald-400" : "text-red-400"}`}>
                  {isSilverUp ? "+" : ""}{silver.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* Country / State */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <RegionSelect
                type="country"
                value={currency}
                options={countries.map((c) => ({ value: c.currency, label: c.label }))}
                hrefTemplate={`/?metal=${metal}&currency={VALUE}&range=${range}&purity=${purity}&state=${selectedState}`}
              />
              {currency === "INR" ? (
                <RegionSelect
                  type="state"
                  value={selectedState}
                  options={indianStates.map((s) => ({ value: s, label: s }))}
                  hrefTemplate={`/?metal=${metal}&currency=${currency}&range=${range}&purity=${purity}&state={VALUE}`}
                />
              ) : (
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-widest text-ink/30">State</p>
                  <div className="rounded-lg border border-border bg-panel-alt px-3 py-2 text-sm text-ink/40">—</div>
                </div>
              )}
            </div>

            {/* Buy / Sell */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href={authHref("/buy")} className="rounded-xl bg-silver py-3 text-center text-sm font-bold text-bg transition hover:brightness-110">
                Buy
              </Link>
              <Link href={authHref("/sell")} className="rounded-xl border border-silver/40 py-3 text-center text-sm font-semibold text-silver transition hover:bg-silver/10">
                Sell
              </Link>
            </div>
          </div>
        </div>

        {/* ── Chart (below the cards) ── */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex overflow-hidden rounded-xl border border-border bg-panel">
            <Link
              scroll={false}
              href={`/?metal=gold&currency=${currency}&range=${range}&purity=${purity}`}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition ${
                metal === "gold" ? "bg-accent text-bg" : "text-ink/50 hover:text-ink"
              }`}
            >
              Gold
            </Link>
            <Link
              scroll={false}
              href={`/?metal=silver&currency=${currency}&range=${range}`}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition ${
                metal === "silver" ? "bg-silver text-bg" : "text-ink/50 hover:text-ink"
              }`}
            >
              Silver
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            {currencies.map((c) => (
              <Link
                scroll={false}
                key={c}
                href={`/?metal=${metal}&currency=${c}&range=${range}&purity=${purity}`}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  currency === c ? "bg-panel-alt text-ink" : "text-ink/40 hover:text-ink/70"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mt-5 rounded-2xl border border-border bg-panel p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-ink/50">
              {metal === "gold" ? "Gold" : "Silver"} Trend &middot; {displayUnitLabel}
            </p>
            <div className="flex gap-1">
              {ranges.map((r) => (
                <Link
                  scroll={false}
                  key={r.key}
                  href={`/?metal=${metal}&currency=${currency}&range=${r.key}`}
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
          <div className="h-72 w-full md:h-80">
            <HistoricalChart title="" currency={currency} color={accentColor} range={range} data={convertedHistoryData} />
          </div>
        </div>

        {/* Rate matrix */}
        <div className="mt-5">
          {isMockSource && (
            <div className="mb-3 rounded-xl border border-amber-700/40 bg-amber-900/15 px-4 py-2.5 text-xs text-amber-300/80">
              Live provider is rate-limited. Showing fallback values — prices may vary.
            </div>
          )}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-ink">{metal === "gold" ? "Gold" : "Silver"} Rate Matrix</h3>
            <p className="text-xs text-ink/40">
              Updated {new Date(activeRates.updatedAt).toLocaleString("en-IN")} &middot; {activeRates.source}
            </p>
          </div>
          <RateTable rows={activeRates.rows} currency={currency} />
        </div>
      </div>

      {/* ───────────────────── WHY SG GOLD ───────────────────── */}
      <section className="border-t border-border/40 bg-panel/30">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-ink md:text-3xl">Why SG Gold?</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink/40">Everything you need to buy, save, and own gold — digitally or physically.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1 */}
            <div className="rounded-2xl border border-border bg-panel p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              </div>
              <h3 className="font-semibold text-ink">Instant Buy &amp; Sell</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/40">Buy from 100mg, sell from 1g. Trades execute at live market prices with 3% GST included.</p>
            </div>
            {/* Card 2 */}
            <div className="rounded-2xl border border-border bg-panel p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>
              </div>
              <h3 className="font-semibold text-ink">Digital Wallet</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/40">Your gold is stored securely in a digital vault. Track your holdings and transaction history in real time.</p>
            </div>
            {/* Card 3 */}
            <div className="rounded-2xl border border-border bg-panel p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              </div>
              <h3 className="font-semibold text-ink">Fully Secured</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/40">Every transaction is atomic and tamper-proof. Your account is protected with encrypted authentication.</p>
            </div>
            {/* Card 4 */}
            <div className="rounded-2xl border border-border bg-panel p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>
              </div>
              <h3 className="font-semibold text-ink">Live Market Data</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/40">Track gold &amp; silver in 5 currencies with historical charts spanning 10+ years. Stay informed before you invest.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── FIRST 1g BONUS ───────────────────── */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  New User Offer
                </div>
                <h2 className="text-2xl font-bold text-ink md:text-3xl">
                  Get <span className="text-emerald-400">10% bonus gold</span> on every purchase
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/50">
                  Every time you buy gold, we add 10% extra to your wallet — completely free.
                  This offer runs on all your purchases until you&apos;ve accumulated your first 1 gram.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-emerald-400">10%</p>
                    <p className="text-xs text-ink/40">Bonus per buy</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">1g</p>
                    <p className="text-xs text-ink/40">Qualifying threshold</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">100mg</p>
                    <p className="text-xs text-ink/40">Max per transaction</p>
                  </div>
                </div>
                <Link href={authHref("/buy")} className="mt-6 inline-flex rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-bg transition hover:bg-emerald-600">
                  Claim Your Bonus
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl" />
                  <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-emerald-500/30 bg-panel md:h-56 md:w-56">
                    <div className="text-center">
                      <p className="text-5xl font-black text-emerald-400 md:text-6xl">+10%</p>
                      <p className="mt-1 text-sm font-medium text-ink/50">free gold</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── 11-MONTH SCHEME ───────────────────── */}
      <section className="border-t border-border/40 bg-panel/30">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left */}
            <div>
              <div className="mb-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                Gold Savings Scheme
              </div>
              <h2 className="text-2xl font-bold text-ink md:text-3xl">
                Save monthly, get <span className="text-accent">bonus gold</span> on the 12th month
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/50">
                Choose a monthly amount from Rs 5,000 to Rs 1,00,000. Pay for 11 months, and on the 12th month
                we credit a bonus worth 2x your monthly installment — converted to gold at prevailing prices.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">1</div>
                  <div>
                    <p className="text-sm font-medium text-ink">Pick a monthly slab</p>
                    <p className="text-xs text-ink/40">7 slabs from Rs 5,000 to Rs 1,00,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">2</div>
                  <div>
                    <p className="text-sm font-medium text-ink">Pay for 11 months</p>
                    <p className="text-xs text-ink/40">Amount is saved in INR, gold calculated at redemption</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-bold text-emerald-400">3</div>
                  <div>
                    <p className="text-sm font-medium text-emerald-400">Receive bonus on month 12</p>
                    <p className="text-xs text-ink/40">Bonus credited as gold to your wallet</p>
                  </div>
                </div>
              </div>
              <Link href={authHref("/scheme/enroll")} className="mt-7 inline-flex rounded-xl bg-accent px-6 py-3 text-sm font-bold text-bg shadow-lg shadow-accent/20 transition hover:brightness-110">
                Start a Scheme
              </Link>
            </div>

            {/* Right — slab table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-panel">
              <div className="border-b border-border bg-panel-alt/50 px-5 py-3">
                <p className="text-sm font-semibold text-ink">Scheme Slabs &amp; Bonus</p>
              </div>
              <table className="w-full text-left">
                <thead className="text-xs uppercase tracking-wide text-ink/40">
                  <tr>
                    <th className="px-5 py-3">Monthly</th>
                    <th className="px-5 py-3">11-Month Total</th>
                    <th className="px-5 py-3">12th Month Bonus</th>
                    <th className="px-5 py-3">Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {schemeSlabs.map((slab) => {
                    const monthlyNum = parseInt(slab.monthly.replace(/,/g, ""));
                    const bonusNum = parseInt(slab.bonus.replace(/,/g, ""));
                    const multiplier = (bonusNum / monthlyNum).toFixed(1);
                    return (
                      <tr key={slab.monthly} className="border-t border-border/60 text-sm">
                        <td className="px-5 py-3 font-medium text-ink">Rs {slab.monthly}</td>
                        <td className="px-5 py-3 text-ink/60">Rs {(monthlyNum * 11).toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 font-semibold text-emerald-400">Rs {slab.bonus}</td>
                        <td className="px-5 py-3">
                          <span className="inline-flex rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                            {multiplier}x
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── PHYSICAL DELIVERY ───────────────────── */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left — products */}
            <div>
              <div className="mb-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                Physical Delivery
              </div>
              <h2 className="text-2xl font-bold text-ink md:text-3xl">
                Take your gold <span className="text-accent">home</span>
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/50">
                Convert digital gold into physical coins and bars. Choose your product, select a pickup store,
                and collect your gold — it&apos;s that simple.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-panel p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><circle cx="12" cy="12" r="9" /></svg>
                  </div>
                  <h4 className="font-semibold text-ink">Gold Coins</h4>
                  <p className="mt-1 text-xs text-ink/40">1g, 2g, 5g, 8g, 10g, 20g, 50g, 100g</p>
                  <p className="mt-2 text-xs text-ink/30">Making charge: Rs 500 + 3% GST</p>
                </div>
                <div className="rounded-2xl border border-border bg-panel p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><rect x="3" y="7" width="18" height="10" rx="2" /></svg>
                  </div>
                  <h4 className="font-semibold text-ink">Gold Bars</h4>
                  <p className="mt-1 text-xs text-ink/40">10g, 20g, 50g, 100g, 500g, 1kg</p>
                  <p className="mt-2 text-xs text-ink/30">Making charge: Rs 500 + 3% GST</p>
                </div>
              </div>
              <Link href={authHref("/delivery")} className="mt-6 inline-flex rounded-xl border border-accent/40 px-6 py-3 text-sm font-semibold text-accent transition hover:bg-accent/10">
                Request Delivery
              </Link>
            </div>

            {/* Right — store locations */}
            <div>
              <div className="rounded-2xl border border-border bg-panel p-6">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                  <h3 className="font-semibold text-ink">Pickup Stores</h3>
                  <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-0.5 text-xs font-bold text-accent">{stores.length} locations</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stores.map((store) => (
                    <div key={store} className="flex items-center gap-2 rounded-lg bg-panel-alt/50 px-3 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span className="text-sm text-ink/70">{store}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-ink/30">Available across Andhra Pradesh, Telangana &amp; more coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── STORAGE BENEFIT ───────────────────── */}
      <section className="border-t border-border/40 bg-panel/30">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="rounded-3xl border border-accent/15 bg-gradient-to-r from-accent/5 to-transparent p-8 md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="mb-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
                  Passive Reward
                </div>
                <h2 className="text-2xl font-bold text-ink md:text-3xl">Storage Benefit</h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/50">
                  Hold 500 grams or more in your digital wallet and earn <span className="font-semibold text-accent">100mg of free gold every month</span> as a
                  storage benefit — just for keeping your gold with us. No action required.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-accent/20 bg-panel p-6 text-center">
                <p className="text-xs uppercase tracking-widest text-ink/40">Monthly reward</p>
                <p className="text-4xl font-black text-accent">100mg</p>
                <p className="text-xs text-ink/40">on 500g+ holdings</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── JEWELLER ACCOUNTS ───────────────────── */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
              For Business
            </div>
            <h2 className="text-2xl font-bold text-ink md:text-3xl">Business &amp; Bullion</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-ink/40">
              Professional trading with higher daily limits, wholesale rates, and specialized business tax handling.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { slab: "25,000", limit: "100g / Day", fee: "1.0% Platform + 3% GST" },
              { slab: "50,000", limit: "250g / Day", fee: "1.2% Platform + 3% GST" },
              { slab: "2,00,000", limit: "500g / Day", fee: "1.5% Platform + 3% GST" },
              { slab: "5,00,000", limit: "Up to 1kg / Day", fee: "Custom Tier" },
            ].map((tier) => (
              <div key={tier.slab} className="rounded-2xl border border-border bg-panel p-5 text-center transition hover:border-accent/30">
                <p className="text-xs uppercase tracking-widest text-ink/40">Deposit Tier</p>
                <p className="mt-2 text-lg font-bold text-accent">Rs {tier.slab}</p>
                <div className="mx-auto my-3 h-px w-10 bg-border" />
                <p className="text-xs text-ink/40">Daily Limit</p>
                <p className="mt-1 text-lg font-bold text-ink">{tier.limit}</p>
                <p className="mt-3 text-xs text-ink/30">{tier.fee}</p>
              </div>
            ))}
          </div>

          {/* Strict rule + Wholesale portal */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="mb-2 text-sm font-semibold text-red-400">Strict Order Rule</p>
              <p className="text-sm leading-relaxed text-ink/50">
                Once a business order is placed (e.g. 100g), payment must be settled within 3 days.
                Non-compliance results in immediate account closure and deposit forfeiture.
              </p>
            </div>
            <div className="rounded-2xl border border-accent/20 bg-panel p-6">
              <p className="mb-2 text-sm font-semibold text-accent">Wholesale Portal</p>
              <p className="text-sm leading-relaxed text-ink/50">
                Get wholesale rates, manual verification for jewelry stores, and specialized business tax handling.
              </p>
              <Link href={authHref("/profile")} className="mt-4 inline-flex rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-bg transition hover:brightness-110">
                Request Business Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── FINAL CTA ───────────────────── */}
      <section className="border-t border-border/40 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:px-8 md:py-24">
          <h2 className="text-3xl font-bold text-ink md:text-4xl">
            Ready to start your gold journey?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/50">
            Create your free account in under a minute. Buy your first gold today and get 10% bonus.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-bg shadow-lg shadow-accent/25 transition hover:brightness-110">
              Create Free Account
            </Link>
            <Link href="/login" className="rounded-xl border border-border px-8 py-3.5 text-sm font-medium text-ink/60 transition hover:border-ink/30 hover:text-ink/80">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────── FOOTER ───────────────────── */}
      <footer className="border-t border-border/40 bg-panel/50">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
                <span className="text-[10px] font-black text-bg">SG</span>
              </div>
              <span className="text-sm font-semibold text-ink/60">SG Gold</span>
            </div>
            <div className="flex gap-6 text-xs text-ink/30">
              <span>Prices sourced from global bullion markets</span>
              <span>&copy; {new Date().getFullYear()} SG Gold</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
