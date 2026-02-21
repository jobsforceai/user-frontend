import Link from "next/link";
import { cookies } from "next/headers";
import { GalleryHero } from "@/components/ui/gallery-hero";
import { Navbar } from "@/components/ui/navbar";
import { LivePriceBanner } from "@/components/ui/live-price-banner";
import { LiveMarketRates } from "@/components/ui/live-market-rates";
import { AboutSection } from "@/components/ui/about-section";
import { WhyGoldSection } from "@/components/ui/why-gold-section";
import { BusinessSection } from "@/components/ui/business-section";
import { SavingsSchemeSection } from "@/components/ui/savings-scheme-section";
import { SecureVaultSection } from "@/components/ui/secure-vault-section";
import { Footer } from "@/components/ui/footer";
import {
  getGoldRates,
  getHistorical,
  getOverview,
  getSilverRates,
  type Currency,
  type Metal,
  type Range
} from "@/actions/assets";

const fallbackCurrency: Currency = "INR";
const fallbackRange: Range = "1D";
const fallbackMetal: Metal = "gold";
const gramsPerOunce = 31.1035;
export const dynamic = "force-dynamic";

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
      <Navbar isLoggedIn={isLoggedIn} />

      {/* ───────────────────── HERO — Gallery Style ───────────────────── */}
      <GalleryHero />

      {/* ───────────────────── PREMIUM SECTIONS ───────────────────── */}
      <AboutSection />

      <WhyGoldSection />
      <SavingsSchemeSection authHref={authHref("/scheme/enroll")} />
      {/* ───────────────────── LIVE MARKET RATES ───────────────────── */}
      <LiveMarketRates
        metal={metal}
        currency={currency}
        range={range}
        purity={purity}
        purityFactor={purityFactor}
        goldPerGram={goldPerGram}
        silverPerGram={silverPerGram}
        isGoldUp={isGoldUp}
        isSilverUp={isSilverUp}
        goldChangePercent={gold.changePercent}
        silverChangePercent={silver.changePercent}
        accentColor={accentColor}
        convertedHistoryData={convertedHistoryData}
        buyHref={authHref("/buy")}
        sellHref={authHref("/sell")}
      />
      <BusinessSection authHref={authHref("/profile")} />
      <SecureVaultSection />

      {/* ───────────────────── FINAL CTA ───────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#0B0B0F" }}
      >
        {/* Gold gradient line at top */}
        <div
          className="h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(212,168,67,0.06) 20%, #d4a843 50%, rgba(212,168,67,0.06) 80%, transparent 100%)",
          }}
        />

        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,168,67,0.06) 0%, rgba(212,168,67,0.02) 35%, transparent 65%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-36">
          {/* Eyebrow */}
          <span
            className="inline-block text-[11px] font-semibold uppercase tracking-[0.3em] mb-6"
            style={{ color: "#d4a843" }}
          >
            Start Today
          </span>

          <h2
            className="font-black uppercase leading-[0.95]"
            style={{
              color: "#f5f5f5",
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            Your Gold Journey
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #d4a843, #f0d78c, #b8860b)",
              }}
            >
              Begins Here.
            </span>
          </h2>

          <p
            className="mx-auto mt-6 max-w-lg text-[15px] leading-relaxed"
            style={{ color: "rgba(245,245,245,0.5)" }}
          >
            Create your free account in under a minute. Buy your first
            digital gold today and receive a 10% welcome bonus.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[14px] font-semibold text-white transition-all duration-200 hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, #d4a843 0%, #b8860b 100%)",
                boxShadow: "0 4px 24px rgba(212,168,67,0.25)",
              }}
            >
              Create Free Account
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center rounded-full px-8 py-3.5 text-[14px] font-medium transition-all duration-200"
              style={{
                color: "rgba(245,245,245,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-[11px] uppercase tracking-[0.15em]"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(212,168,67,0.4)" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Bank-Grade Security
            </span>
            <span style={{ color: "rgba(255,255,255,0.08)" }}>|</span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(212,168,67,0.4)" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Insured Vaults
            </span>
            <span style={{ color: "rgba(255,255,255,0.08)" }}>|</span>
            <span className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(212,168,67,0.4)" }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
              Free Delivery
            </span>
          </div>
        </div>
      </section>

      {/* ───────────────────── FOOTER ───────────────────── */}
      <Footer />

      {/* ───────────────────── FLOATING LIVE PRICE BANNER ───────────────────── */}
      <LivePriceBanner
        currency={currency}
        initialGoldPerGram={goldPerGram}
        initialSilverPerGram={silverPerGram}
        purityFactor={purityFactor}
        purity={purity}
      />
    </main>
  );
}
