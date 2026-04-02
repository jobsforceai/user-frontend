import Link from "next/link";
import { getSchemes, type SchemeData } from "@/actions/scheme";

const fmt = (v: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v / 100);

function SchemeCard({ scheme }: { scheme: SchemeData }) {
  const paidCount = scheme.installments.filter((i) => i.status === "paid" || i.status === "advance").length;
  const total = scheme.installments.length;

  return (
    <Link
      href={`/scheme/${scheme._id}`}
      className="group block rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-5 transition hover:border-[#d7af35]/40 hover:bg-[#202840]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-bold text-[#f4f6ff]">{fmt(scheme.slabAmountPaise)}<span className="text-sm font-normal text-[#9ea7c2]"> /month</span></p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          scheme.status === "active" ? "bg-emerald-500/15 text-emerald-300" :
          scheme.status === "completed" ? "bg-[#d7af35]/18 text-[#f7de89]" :
          "bg-red-500/15 text-red-300"
        }`}>
          {scheme.status}
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1">
            <div className="h-2 rounded-full bg-[#2c344c]">
            <div className="h-2 rounded-full bg-[#d7af35] transition-all" style={{ width: `${(paidCount / total) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-[#aab2ca]">{paidCount}/{total} paid</span>
      </div>
      <p className="mt-3 text-xs text-[#aab2ca]">Bonus on maturity: <span className="font-semibold text-emerald-300">{fmt(scheme.bonusAmountPaise)}</span></p>
      <p className="mt-1 text-[11px] text-[#7f89a8] group-hover:text-[#aab2ca]">Open plan details and payment schedule</p>
    </Link>
  );
}

export default async function SchemePage() {
  const result = await getSchemes();
  const schemes = result.data?.schemes ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#4a5270] bg-[#1b2236]/95 p-6 shadow-[0_24px_56px_rgba(0,0,0,0.35)] sm:p-7">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#d7af35]/16 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-8 h-48 w-48 rounded-full bg-[#725eb5]/16 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">11-Month Wealth Plan</span>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#f3f6ff]">Scheme Dashboard</h1>
            <p className="mt-2 text-sm text-[#b4bdd5]">Invest monthly for 11 months and unlock bonus value at maturity.</p>
          </div>
          <Link
            href="/scheme/enroll"
            className="rounded-xl bg-[#d7af35] px-4 py-2 text-sm font-extrabold text-[#171b28] transition hover:brightness-110"
          >
            Enroll Now
          </Link>
        </div>
      </section>

      {schemes.length === 0 ? (
        <div className="rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-10 text-center shadow-[0_18px_46px_rgba(0,0,0,0.3)]">
          <p className="text-[#b4bdd5]">You do not have any active schemes. Enroll to start your monthly gold growth plan.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {schemes.map((s) => (
            <SchemeCard key={s._id} scheme={s} />
          ))}
        </div>
      )}
    </div>
  );
}
