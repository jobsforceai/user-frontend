import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support | SG Gold",
  description: "Official support page for SG Gold users",
};

const supportTopics = [
  "Account access and login issues",
  "Buy, sell, wallet, and transaction queries",
  "Scheme, delivery, and redemption help",
  "KYC and verification support",
  "Security and unauthorized activity reporting",
  "General product feedback and bug reports",
];

export default function SupportPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0d1220] text-[#eef2ff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(215,175,53,0.13),transparent_35%),radial-gradient(circle_at_88%_15%,rgba(114,94,181,0.18),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(49,93,140,0.14),transparent_36%)]" />

      <div className="relative mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <section className="rounded-[30px] border border-[#4a5270] bg-[#1b2236]/95 p-8 shadow-[0_26px_60px_rgba(0,0,0,0.36)]">
          <span className="inline-flex rounded-full border border-[#d7af35]/35 bg-[#d7af35]/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7de89]">Help Center</span>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[#eef2ff] md:text-5xl">Support</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[#b4bdd5] md:text-base">
            Need help with SG Gold? Our support team assists with account access, transactions,
            delivery workflows, and security-related concerns.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.3)] md:p-8">
          <h2 className="text-xl font-extrabold text-[#f6d97f] md:text-2xl">Contact Information</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[#d4d9ec] md:text-base">
            <p>
              Email: <a className="font-semibold text-[#f6d97f] underline" href="mailto:support@sggold.app">support@sggold.app</a>
            </p>
            <p>
              Website: <a className="font-semibold text-[#f6d97f] underline" href="https://sggold.app">https://sggold.app</a>
            </p>
            <p>Business hours: Monday to Saturday, 10:00 AM to 7:00 PM IST</p>
            <p>Expected response time: within 24 to 48 business hours</p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.3)] md:p-8">
          <h2 className="text-xl font-extrabold text-[#f6d97f] md:text-2xl">What We Can Help With</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[#d4d9ec] md:text-base">
            {supportTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-[#404964] bg-[#1a2032]/95 p-6 shadow-[0_18px_46px_rgba(0,0,0,0.3)] md:p-8">
          <h2 className="text-xl font-extrabold text-[#f6d97f] md:text-2xl">Before You Contact Support</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[#d4d9ec] md:text-base">
            <p>Please include your registered phone number or email used in SG Gold.</p>
            <p>For transaction issues, include date, amount, and transaction reference if available.</p>
            <p>For security concerns, report immediately with full details so we can assist faster.</p>
          </div>
        </section>

        <p className="mt-10 text-xs text-[#aab2ca] md:text-sm">
          This is the official SG Gold support page for App Store and Play Store listing compliance.
        </p>
      </div>
    </main>
  );
}
