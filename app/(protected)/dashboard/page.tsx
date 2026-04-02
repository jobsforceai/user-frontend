import Link from "next/link";
import Image from "next/image";
import { getOverview, getHistorical, type Currency, type Metal, type Range } from "@/actions/assets";
import { getWallet } from "@/actions/wallet";
import { HistoricalChart } from "@/components/ui/historical-chart";
import { CityLivePricesGrid } from "@/components/ui/city-live-prices-grid";
import { IndicativeLivePrice } from "@/components/ui/indicative-live-price";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { RefreshTimer } from "@/components/ui/refresh-timer";

const gramsPerOunce = 31.1035;

const storeCities = [
  "Vizag", "Vijayawada", "Hyderabad", "Rajahmundry", "Bhimavaram",
  "Anakapalli", "Tirupati", "Guntur", "Nellore", "Kakinada", "Warangal",
];

const currencies: Currency[] = ["INR", "USD", "EUR", "GBP", "AED"];
const ranges: Array<{ key: Range; label: string }> = [
  { key: "1D", label: "1D" },
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "5M", label: "5M" },
  { key: "1Y", label: "1Y" },
  { key: "5Y", label: "5Y" },
];

const actionDeck = [
  {
    href: "/buy",
    title: "Buy Gold",
    description: "Execute instant purchase on secure rates.",
    image: "/app-assets/trade-gold-silver-stack.png",
    chip: "Trade",
    tone: "from-[#413768] to-[#725eb5]",
  },
  {
    href: "/scheme",
    title: "SIP Plans",
    description: "Build disciplined savings over 11 months.",
    image: "/app-assets/scheme-piggybank-gold.png",
    chip: "Scheme",
    tone: "from-[#324050] to-[#506782]",
  },
  {
    href: "/delivery",
    title: "Delivery",
    description: "Track request lifecycle and pickup status.",
    image: "/app-assets/delivery-premium-box.png",
    chip: "Fulfillment",
    tone: "from-[#26345a] to-[#3f5891]",
  },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ metal?: Metal; currency?: Currency; range?: Range }>;
}) {
  const params = await searchParams;
  const metal: Metal = params.metal === "silver" ? "silver" : "gold";
  const currency: Currency = params.currency ?? "INR";
  const range: Range = params.range ?? "1D";

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
    <div className="mx-auto max-w-[1180px] space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[30px] border border-[#7f70ba]/35 bg-[#1B1F2D] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#8f73cc]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#d7af35]/18 blur-3xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d7af35]/30 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f8df8a]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live Portfolio
              </span>
              <RefreshTimer intervalSeconds={45} />
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#ECEFF8] sm:text-5xl">
              {(balanceGrams || 0).toFixed(3)}g
              <span className="ml-2 text-lg font-semibold text-[#B2B7CB] sm:text-2xl">Available Gold</span>
            </h1>
            <p className="mt-1 text-2xl font-extrabold text-[#EFCB57]">{fmt(balanceValue)}</p>
            <p className="mt-2 max-w-xl text-sm text-[#B2B7CB]">
              Unified command center for portfolio value, live market snapshots, and execution routes.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#8a77c8]/30 bg-[#252A3A]/90 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B92AA]">Purchased</p>
                <p className="mt-1 text-xl font-extrabold text-[#ECEFF8]">{totalPurchasedGrams.toFixed(3)}g</p>
                <p className="text-xs text-[#8B92AA]">{fmt(purchasedValue)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/20 bg-[#252A3A]/90 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B92AA]">Bonus</p>
                <p className="mt-1 text-xl font-extrabold text-emerald-300">{totalBonusGrams.toFixed(3)}g</p>
                <p className="text-xs text-[#8B92AA]">{fmt(profitFromBonus)}</p>
              </div>
              <div className="rounded-2xl border border-[#8a77c8]/30 bg-[#252A3A]/90 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8B92AA]">P&L</p>
                <p className={`mt-1 text-xl font-extrabold ${profitPercent >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                  {profitPercent >= 0 ? "+" : ""}{profitPercent.toFixed(2)}%
                </p>
                <p className="text-xs text-[#8B92AA]">from bonus credits</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/buy" className="rounded-xl bg-[#D7AF35] px-5 py-2.5 text-sm font-extrabold text-[#171B27] transition hover:brightness-110">Buy Gold</Link>
              <Link href="/sell" className="rounded-xl border border-[#8a77c8]/35 bg-[#252A3A] px-5 py-2.5 text-sm font-semibold text-[#ECEFF8] transition hover:border-[#d7af35]/40">Sell Gold</Link>
              <Link href="/wallet" className="rounded-xl border border-[#8a77c8]/35 bg-[#252A3A] px-5 py-2.5 text-sm font-semibold text-[#ECEFF8] transition hover:border-[#d7af35]/40">View Wallet</Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[26px] border border-[#9d8ad5]/35 bg-gradient-to-br from-[#2E3456] via-[#4C4F79] to-[#6A5BA4] p-6">
            {/* <Image src="/app-assets/wallet-vault.png" alt="Vault" width={230} height={230} className="pointer-events-none absolute -right-8 -bottom-10 h-44 w-44 object-contain opacity-90" /> */}
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9daf0]">Vault Health</p>
            <h2 className="mt-2 text-2xl font-black text-white">Portfolio secured</h2>
            <p className="mt-1 max-w-[18rem] text-sm text-[#d0d3e6]">
              Real-time metal pricing with synchronized dashboard controls and protected transaction routes.
            </p>

            <div className="mt-5 rounded-2xl border border-white/20 bg-black/20 p-4 backdrop-blur-sm">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Current Gold / 10g</p>
              <IndicativeLivePrice
                baseValue={goldPrice10g}
                currency="INR"
                className="mt-1 block text-2xl font-black text-[#F8DF8A]"
                tickClassName="text-white/70"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          scroll={false}
          href={qp({ metal: "gold" })}
          className={`relative overflow-hidden rounded-2xl border p-6 transition ${
            metal === "gold"
              ? "border-[#D7AF35]/50 bg-[#232838]"
              : "border-[#3c4256] bg-[#1B1F2D] hover:border-[#D7AF35]/35"
          }`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#D7AF35]/12 blur-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B92AA]">Live Rate</p>
              <h3 className="mt-1 text-xl font-bold text-[#ECEFF8]">Gold 24K</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isGoldUp ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
              {isGoldUp ? "+" : ""}{gold.changePercent.toFixed(2)}%
            </span>
          </div>
          <IndicativeLivePrice
            baseValue={goldPrice10g}
            currency="INR"
            className="mt-3 block text-4xl font-black tracking-tight text-[#EFCB57]"
          />
          <p className="mt-1 text-xs text-[#8B92AA]">Per 10 grams</p>
        </Link>

        <Link
          scroll={false}
          href={qp({ metal: "silver" })}
          className={`relative overflow-hidden rounded-2xl border p-6 transition ${
            metal === "silver"
              ? "border-[#b3bdd4]/45 bg-[#232838]"
              : "border-[#3c4256] bg-[#1B1F2D] hover:border-[#b3bdd4]/35"
          }`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#9ca3af]/12 blur-2xl" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8B92AA]">Live Rate</p>
              <h3 className="mt-1 text-xl font-bold text-[#ECEFF8]">Silver</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${isSilverUp ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
              {isSilverUp ? "+" : ""}{silver.changePercent.toFixed(2)}%
            </span>
          </div>
          <IndicativeLivePrice
            baseValue={silverPrice1kg}
            currency="INR"
            className="mt-3 block text-4xl font-black tracking-tight text-[#cdd5e9]"
          />
          <p className="mt-1 text-xs text-[#8B92AA]">Per 1 kilogram</p>
        </Link>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-2xl border border-[#3c4256] bg-[#1B1F2D] p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8B92AA]">Price Studio</p>
              <h3 className="mt-1 text-lg font-bold text-[#ECEFF8]">{metal === "gold" ? "Gold" : "Silver"} trend intelligence</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Link scroll={false} href={qp({ metal: "gold" })} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${metal === "gold" ? "bg-[#D7AF35]/15 text-[#F8DF8A]" : "bg-[#252A3A] text-[#B2B7CB] hover:text-[#ECEFF8]"}`}>Gold</Link>
              <Link scroll={false} href={qp({ metal: "silver" })} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${metal === "silver" ? "bg-[#9CA3AF]/15 text-[#D7DEEE]" : "bg-[#252A3A] text-[#B2B7CB] hover:text-[#ECEFF8]"}`}>Silver</Link>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-1.5">
            {currencies.map((c) => (
              <Link
                scroll={false}
                key={c}
                href={qp({ currency: c })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  currency === c
                    ? "bg-[#725eb5]/25 text-[#eceff8]"
                    : "bg-[#252A3A] text-[#B2B7CB] hover:text-[#ECEFF8]"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {ranges.map((r) => (
              <Link
                scroll={false}
                key={r.key}
                href={qp({ range: r.key })}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  range === r.key
                    ? "bg-[#D7AF35]/15 text-[#F8DF8A]"
                    : "bg-[#252A3A] text-[#B2B7CB] hover:text-[#ECEFF8]"
                }`}
              >
                {r.label}
              </Link>
            ))}
          </div>

          <div className="h-64 w-full md:h-72">
            <HistoricalChart title="" currency={currency} color={accentColor} range={range} data={convertedHistoryData} />
          </div>

          <div className="mt-5 rounded-xl border border-[#3c4256] bg-[#252A3A]/80 p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#8B92AA]">Current Selected Asset</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-black text-[#ECEFF8]">{formatCurrency(convertedLivePrice, currency)}</span>
              <span className={`inline-flex items-center gap-1 text-sm font-semibold ${isUp ? "text-emerald-300" : "text-red-300"}`}>
                {isUp ? "▲" : "▼"} {formatCurrency(Math.abs(convertedLiveChange), currency)} ({formatPercent(activeAsset.changePercent)})
              </span>
              <span className="text-xs text-[#8B92AA]">{displayUnit}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {actionDeck.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative block overflow-hidden rounded-2xl border border-[#3c4256] bg-[#1B1F2D] p-5 transition hover:border-[#D7AF35]/35"
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.tone}`} />
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full border border-[#8a77c8]/35 bg-[#252A3A] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#B2B7CB]">{item.chip}</span>
                  <h4 className="mt-2 text-lg font-extrabold text-[#ECEFF8]">{item.title}</h4>
                  <p className="mt-1 text-sm text-[#B2B7CB]">{item.description}</p>
                </div>
                <Image src={item.image} alt={item.title} width={88} height={88} className="h-20 w-20 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105" />
              </div>
            </Link>
          ))}

          <div className="relative overflow-hidden rounded-2xl border border-[#3c4256] bg-gradient-to-br from-[#2d3a64] to-[#4d628c] p-5">
            <Image src="/app-assets/vault.png" alt="Vault" width={180} height={180} className="pointer-events-none absolute -right-4 -bottom-8 h-28 w-28 object-contain opacity-90" />
            <p className="text-xs uppercase tracking-[0.16em] text-[#d8deef]">Execution Notice</p>
            <p className="mt-2 max-w-[17rem] text-sm text-[#eef2ff]">
              Orders, schemes, and delivery requests are routed through verified execution flows. Continue to the respective module to proceed.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#3c4256] bg-[#1B1F2D] p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8B92AA]">Regional Board</p>
            <h3 className="mt-1 text-lg font-bold text-[#ECEFF8]">City Live Gold Prices</h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            Streaming
          </span>
        </div>
        <CityLivePricesGrid cities={storeCities} basePricePerGram={goldPerGram} />
      </section>
    </div>
  );
}
