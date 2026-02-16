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
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Physical Delivery</h1>
        <p className="text-sm text-ink/50">Convert digital gold to physical coins or bars</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-border bg-panel p-4 shadow-card sm:p-6">
        {error && <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-3 py-2 text-sm text-red-400">{error}</div>}
        {success && <div className="rounded-lg border border-green-800/50 bg-green-900/20 px-3 py-2 text-sm text-green-400">{success}</div>}

        <div className="space-y-1.5">
          <label className="text-sm text-ink/70">Product Type</label>
          <div className="flex gap-2">
            {(["coin", "bar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setProductType(t); setWeightMg(t === "coin" ? coinWeights[0] : barWeights[0]); }}
                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition ${
                  productType === t ? "border-accent bg-accent text-bg font-medium" : "border-border bg-panel-alt text-ink/70"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-ink/70">Weight</label>
          <div className="flex flex-wrap gap-2">
            {weights.map((w) => (
              <button
                key={w}
                onClick={() => setWeightMg(w)}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  weightMg === w ? "border-accent bg-accent text-bg font-medium" : "border-border bg-panel-alt text-ink/70"
                }`}
              >
                {fmtG(w)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm text-ink/70">Pickup Store</label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full rounded-xl border border-border bg-panel-alt px-3 py-2.5 text-ink focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/10"
          >
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.name}, {s.state}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-white/5 p-4 text-sm space-y-1">
          <p>Gold: <span className="text-accent">{fmtG(weightMg)}</span></p>
          <p className="text-xs text-ink/40">+ Coin charge (if coin) + 3% GST. Exact charges shown after confirmation.</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !storeId}
          className="w-full rounded-xl bg-accent py-2.5 font-medium text-bg transition hover:bg-accent-dim disabled:opacity-50"
        >
          {loading ? "Processing..." : "Request Delivery"}
        </button>
      </div>

      {deliveries.length > 0 && (
        <div className="rounded-2xl border border-border bg-panel">
          <div className="border-b border-border px-5 py-3">
            <p className="text-sm font-medium">Past Requests</p>
          </div>
          <div className="divide-y divide-border">
            {deliveries.map((d) => (
              <div key={d._id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium capitalize">{d.productType} — {fmtG(d.amountMg)}</p>
                  <p className="text-xs text-ink/40">{new Date(d.createdAt).toLocaleDateString("en-IN")} · Store: {d.pickupStoreId}</p>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    d.status === "collected" ? "bg-green-900/30 text-green-400" :
                    d.status === "ready" ? "bg-accent/20 text-accent" :
                    d.status === "cancelled" ? "bg-red-900/30 text-red-400" :
                    "bg-white/10 text-ink/50"
                  }`}>
                    {d.status}
                  </span>
                  {d.totalChargePaise > 0 && (
                    <p className="mt-1 text-xs text-ink/40">Charges: {fmtINR(d.totalChargePaise)}</p>
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
