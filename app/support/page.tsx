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
    <main className="min-h-screen bg-[#080808] text-[#f5f5f5]">
      <div className="mx-auto w-full max-w-4xl px-6 py-16 md:px-10 md:py-20">
        <h1 className="text-4xl font-black tracking-tight text-[#f0c96c] md:text-5xl">Support</h1>
        <p className="mt-4 text-sm leading-7 text-[#c8c8c8] md:text-base">
          Need help with SG Gold? Our support team is available to assist with account, transactions,
          delivery, and security-related queries.
        </p>

        <section className="mt-10 rounded-2xl border border-[#242424] bg-[#111111] p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-[#f2d480] md:text-2xl">Contact Information</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[#d4d4d4] md:text-base">
            <p>
              Email: <a className="text-[#f0c96c] underline" href="mailto:support@sggold.app">support@sggold.app</a>
            </p>
            <p>
              Website: <a className="text-[#f0c96c] underline" href="https://sggold.app">https://sggold.app</a>
            </p>
            <p>Business hours: Monday to Saturday, 10:00 AM to 7:00 PM IST</p>
            <p>Expected response time: within 24 to 48 business hours</p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#242424] bg-[#111111] p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-[#f2d480] md:text-2xl">What We Can Help With</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[#d4d4d4] md:text-base">
            {supportTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-[#242424] bg-[#111111] p-6 md:p-8">
          <h2 className="text-xl font-extrabold text-[#f2d480] md:text-2xl">Before You Contact Support</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-[#d4d4d4] md:text-base">
            <p>Please include your registered phone number or email used in SG Gold.</p>
            <p>For transaction issues, include date, amount, and transaction reference if available.</p>
            <p>For security concerns, report immediately with full details so we can assist faster.</p>
          </div>
        </section>

        <p className="mt-10 text-xs text-[#a7a7a7] md:text-sm">
          This is the official SG Gold support page for App Store and Play Store listing compliance.
        </p>
      </div>
    </main>
  );
}
