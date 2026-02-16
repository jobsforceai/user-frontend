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
      className="block rounded-2xl border border-border bg-panel p-5 transition hover:border-accent-dim"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-accent">{fmt(scheme.slabAmountPaise)}<span className="text-sm font-normal text-ink/40"> /month</span></p>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
          scheme.status === "active" ? "bg-green-900/30 text-green-400" :
          scheme.status === "completed" ? "bg-accent/20 text-accent" :
          "bg-red-900/30 text-red-400"
        }`}>
          {scheme.status}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1">
            <div className="h-2 rounded-full bg-border">
            <div className="h-2 rounded-full bg-accent transition-all" style={{ width: `${(paidCount / total) * 100}%` }} />
          </div>
        </div>
        <span className="text-xs text-ink/50">{paidCount}/{total} paid</span>
      </div>
      <p className="mt-2 text-xs text-ink/40">Bonus: {fmt(scheme.bonusAmountPaise)}</p>
    </Link>
  );
}

export default async function SchemePage() {
  const result = await getSchemes();
  const schemes = result.data?.schemes ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">11-Month Scheme</h1>
          <p className="text-sm text-ink/50">Invest monthly, earn bonus on the 12th month</p>
        </div>
        <Link
          href="/scheme/enroll"
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-bg transition hover:bg-accent-dim"
        >
          Enroll Now
        </Link>
      </div>

      {schemes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-panel p-8 text-center">
          <p className="text-ink/50">You don&apos;t have any schemes yet. Enroll to start your gold investment journey.</p>
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
