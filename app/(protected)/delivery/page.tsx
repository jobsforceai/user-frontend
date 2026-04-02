"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStores, getDeliveries, createDelivery, type StoreData, type DeliveryData } from "@/actions/delivery";

const coinWeights = [1000, 2000, 5000, 8000, 10000, 20000, 50000, 100000];
const barWeights = [10000, 20000, 50000, 100000, 500000, 1000000];

const fmtG = (mg: number) => `${(mg / 1000).toFixed(mg >= 1000 ? 0 : 3)}g`;
const fmtINR = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100);

export default function DeliveryPage() {
  const router = useRouter();
  const [stores, setStores] = useState<StoreData[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryData[]>([]);
  const [productType, setProductType] = useState<"coin" | "bar">("coin");
  const [weightMg, setWeightMg] = useState(1000);
  const [storeId, setStoreId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const [s, d] = await Promise.all([getStores(), getDeliveries()]);
      setStores(s);
      setDeliveries(d.data?.deliveries ?? []);
      if (s.length > 0) setStoreId(s[0].id);
    }
    load();
  }, []);

  const weights = productType === "coin" ? coinWeights : barWeights;

  async function handleSubmit() {
    setError("");
    setSuccess("");
    setLoading(true);

    const result = await createDelivery({
      amountMg: weightMg,
      productType,
      productWeightMg: weightMg,
      pickupStoreId: storeId,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess("Delivery request created! Gold has been deducted from your wallet.");
      const d = await getDeliveries();
      setDeliveries(d.data?.deliveries ?? []);
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-48 w-48 rounded-full bg-[#3f79a5]/16 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">Fulfillment Desk</span>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff]">Physical Delivery</h1>
          <p className="mt-2 text-sm text-[#b4bdd5]">Convert digital holdings into verified coin or bar delivery requests.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4 rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)] sm:p-6">
          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/12 px-3 py-2 text-sm text-red-300">{error}</div>}
          {success && <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/12 px-3 py-2 text-sm text-emerald-300">{success}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#d7ddf1]">Product Type</label>
            <div className="flex gap-2">
              {(["coin", "bar"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setProductType(t);
                    setWeightMg(t === "coin" ? coinWeights[0] : barWeights[0]);
                  }}
                  className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${
                    productType === t
                      ? "border-[#d7af35]/45 bg-[#d7af35]/18 font-semibold text-[#f8df8a]"
                      : "border-[#3f4762] bg-[#20263a] text-[#b2bbd3] hover:border-[#667197] hover:text-[#eef2ff]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#d7ddf1]">Weight</label>
            <div className="flex flex-wrap gap-2">
              {weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setWeightMg(w)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    weightMg === w
                      ? "border-[#d7af35]/45 bg-[#d7af35]/18 font-semibold text-[#f8df8a]"
                      : "border-[#3f4762] bg-[#20263a] text-[#b2bbd3] hover:border-[#667197] hover:text-[#eef2ff]"
                  }`}
                >
                  {fmtG(w)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#d7ddf1]">Pickup Store</label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full rounded-xl border border-[#3f4762] bg-[#11182a] px-3 py-2.5 text-[#eef2ff] focus:border-[#d7af35]/55 focus:outline-none focus:ring-2 focus:ring-[#d7af35]/15"
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}, {s.state}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !storeId}
            className="w-full rounded-xl bg-[#d7af35] py-2.5 font-extrabold text-[#171b28] transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Request Delivery"}
          </button>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Current Selection</p>
            <p className="mt-2 text-2xl font-black text-[#f8df8a]">{fmtG(weightMg)}</p>
            <p className="mt-1 text-sm capitalize text-[#b4bdd5]">{productType} delivery</p>
            <p className="mt-3 text-xs text-[#8f98b3]">Coin charges (if applicable) and 3% GST are applied during confirmation.</p>
          </div>

          <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8f98b3]">Fulfillment Flow</p>
            <ul className="mt-3 space-y-2 text-sm text-[#b4bdd5]">
              <li>1. Create delivery request with product and store.</li>
              <li>2. Team validates inventory and reserve quantity.</li>
              <li>3. Track readiness and collection status below.</li>
            </ul>
          </div>
        </div>
      </div>

      {deliveries.length > 0 && (
        <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <div className="border-b border-[#3f4762] px-5 py-3">
            <p className="text-sm font-semibold text-[#eef2ff]">Past Requests</p>
          </div>
          <div className="divide-y divide-[#2c344c]">
            {deliveries.map((d) => (
              <div key={d._id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm font-semibold capitalize text-[#eef2ff]">{d.productType} - {fmtG(d.amountMg)}</p>
                  <p className="text-xs text-[#8f98b3]">{new Date(d.createdAt).toLocaleDateString("en-IN")} | Store: {d.pickupStoreId}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    d.status === "collected" ? "bg-emerald-500/15 text-emerald-300" :
                    d.status === "ready" ? "bg-[#d7af35]/18 text-[#f7de89]" :
                    d.status === "cancelled" ? "bg-red-500/15 text-red-300" :
                    "bg-[#252d43] text-[#aab2ca]"
                  }`}>
                    {d.status}
                  </span>
                  {d.totalChargePaise > 0 && (
                    <p className="mt-1 text-xs text-[#8f98b3]">Charges: {fmtINR(d.totalChargePaise)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
