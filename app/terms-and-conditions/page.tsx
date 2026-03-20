import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | SG Gold",
  description: "Terms and Conditions governing SG Gold services",
};

const sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }> = [
  {
    title: "1. Acceptance of Terms",
    paragraphs: [
      "These Terms and Conditions (Terms) govern your access to and use of SG Gold websites, mobile applications, digital precious metal products, wallet services, transaction services, delivery options, support channels, and any associated tools (collectively, the Platform).",
      "By registering, accessing, or using the Platform, you agree to be bound by these Terms, our Privacy Policy, and any additional policies, schedules, disclosures, and notices incorporated by reference. If you do not agree, you must not use the Platform.",
      "You confirm that you are legally competent, of required legal age, and authorized to enter binding agreements under applicable law.",
    ],
  },
  {
    title: "2. Definitions",
    paragraphs: [
      "For these Terms, references to SG Gold, we, us, and our mean the operating legal entity and its permitted affiliates. User, you, and your refer to any person or entity using the Platform. Asset means digital representation of precious metals offered through the Platform. Wallet means your account balance representation for eligible products and transactions.",
    ],
  },
  {
    title: "3. Eligibility and Account Registration",
    paragraphs: [
      "You must provide accurate, complete, and up-to-date information to create and maintain an account. We may require identity verification and ongoing compliance checks at any time.",
      "We may reject, suspend, limit, or terminate accounts that fail verification, present elevated risk, violate law, violate these Terms, or are linked to suspicious or prohibited activity.",
    ],
    bullets: [
      "One individual or entity may be restricted to one primary account unless otherwise approved.",
      "You are solely responsible for all activity under your credentials.",
      "You must immediately notify us of unauthorized access or security concerns.",
    ],
  },
  {
    title: "4. Nature of Services",
    paragraphs: [
      "SG Gold provides a technology platform enabling eligible users to access digital bullion transactions and related services. We may rely on third-party providers, liquidity sources, vaulting partners, logistics providers, and payment partners to facilitate execution and settlement.",
      "Service availability may vary by jurisdiction, product type, risk profile, payment method, and regulatory requirements.",
    ],
  },
  {
    title: "5. Pricing, Quotes, and Market Risk",
    paragraphs: [
      "Asset prices may fluctuate rapidly due to market conditions. Quotes shown on the Platform may be time-sensitive and subject to spread, fees, taxes, and execution constraints.",
      "Execution is not guaranteed until transaction confirmation is completed under our operational and compliance controls. Delays, partial fills, rejections, or quote expirations may occur.",
    ],
    bullets: [
      "Displayed prices may include or exclude applicable taxes depending on context.",
      "Network or payment delays may affect final execution.",
      "Historical returns do not guarantee future outcomes.",
    ],
  },
  {
    title: "6. Orders, Settlement, and Reversals",
    paragraphs: [
      "By placing an order, you authorize us and our partners to process the transaction based on available settlement rails and risk checks. You agree that once an order is confirmed and executed, reversal may not be possible except where required by law or expressly approved by SG Gold.",
      "We may apply holds, delays, additional verification, or cancellation where fraud, compliance, legal, operational, or technical concerns are identified.",
    ],
  },
  {
    title: "7. Fees, Charges, and Taxes",
    paragraphs: [
      "You agree to pay all applicable charges, including platform fees, spread components, delivery fees, withdrawal fees, processing charges, and statutory taxes. Fee schedules may be updated with notice as required by law.",
      "Taxes are your responsibility unless explicitly stated otherwise. You are responsible for determining and reporting tax obligations arising from your activity.",
    ],
  },
  {
    title: "8. Storage, Delivery, and Fulfillment",
    paragraphs: [
      "Where physical conversion or delivery is offered, you must comply with eligibility rules, minimum quantity requirements, geographic restrictions, KYC requirements, and logistics procedures. Delivery timelines are estimates and may be affected by inventory, regulatory checks, courier capacity, force majeure events, and external disruptions.",
      "Risk of loss, title transfer mechanics, and fulfillment conditions will be governed by the product-specific terms presented during request initiation.",
    ],
  },
  {
    title: "9. Prohibited Activities",
    paragraphs: [
      "You must not misuse the Platform or engage in unlawful, deceptive, abusive, or harmful behavior.",
    ],
    bullets: [
      "Fraud, impersonation, money laundering, terrorist financing, sanctions violations, or other illegal activity.",
      "Attempting unauthorized access, reverse engineering, disruption, scraping, or interference with Platform integrity.",
      "Use of stolen payment instruments, manipulated identities, or fabricated documents.",
      "Circumvention of risk controls, geographic restrictions, account limits, or verification requirements.",
      "Distribution of malware, spam, abusive content, or misleading statements about SG Gold services.",
    ],
  },
  {
    title: "10. Compliance, Monitoring, and Reporting",
    paragraphs: [
      "We may monitor transactions and account behavior for legal compliance, platform security, fraud detection, sanctions controls, and operational resilience. We may report suspicious activity to competent authorities where required.",
      "You consent to lawful data checks and screening needed to maintain a safe and compliant platform.",
    ],
  },
  {
    title: "11. Communications and Notices",
    paragraphs: [
      "You agree to receive communications electronically, including policy updates, statements, confirmations, risk alerts, service notices, and legal disclosures. Electronic records satisfy legal communication requirements where permitted.",
      "It is your responsibility to keep contact information current and monitor communications for important actions.",
    ],
  },
  {
    title: "12. Intellectual Property",
    paragraphs: [
      "All Platform content, software, interfaces, graphics, trademarks, logos, text, and compilations are owned by SG Gold or licensed to SG Gold and are protected by applicable intellectual property laws.",
      "Except as expressly permitted, you may not copy, modify, distribute, license, sell, publish, reverse engineer, or create derivative works from any Platform materials.",
    ],
  },
  {
    title: "13. Third-Party Services",
    paragraphs: [
      "The Platform may integrate with third-party services. SG Gold is not responsible for third-party uptime, policies, acts, omissions, errors, or security practices. Your use of third-party services may be subject to additional terms.",
    ],
  },
  {
    title: "14. Service Availability and Modifications",
    paragraphs: [
      "We may modify, suspend, restrict, or discontinue any part of the Platform at any time for business, legal, security, or technical reasons. We do not guarantee uninterrupted access, error-free operation, or compatibility with all devices and networks.",
      "Scheduled and unscheduled maintenance may temporarily affect access.",
    ],
  },
  {
    title: "15. Disclaimers",
    paragraphs: [
      "The Platform is provided on an as-is and as-available basis, without warranties of any kind except as required by law. We disclaim implied warranties including merchantability, fitness for a particular purpose, and non-infringement to the maximum extent permitted.",
      "SG Gold does not provide investment, legal, tax, or accounting advice. You are solely responsible for evaluating the suitability of transactions and seeking professional advice where needed.",
    ],
  },
  {
    title: "16. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, SG Gold and its affiliates, officers, directors, employees, agents, and partners shall not be liable for indirect, incidental, special, consequential, punitive, or exemplary damages, including lost profits, lost data, business interruption, or reputational harm.",
      "Where liability cannot be excluded, our aggregate liability for claims arising out of or relating to the Platform shall be limited to amounts lawfully permitted, and in no event exceed amounts actually paid by you to SG Gold for the specific service giving rise to the claim during the applicable limitation period.",
    ],
  },
  {
    title: "17. Indemnification",
    paragraphs: [
      "You agree to indemnify, defend, and hold harmless SG Gold and its affiliates from and against claims, liabilities, losses, damages, penalties, costs, and expenses (including legal fees) arising from your use of the Platform, breach of these Terms, breach of law, infringement of rights, fraud, negligence, or misconduct.",
    ],
  },
  {
    title: "18. Suspension and Termination",
    paragraphs: [
      "We may suspend or terminate access immediately where required to protect users, comply with law, investigate suspicious activity, or enforce these Terms. You may close your account subject to settlement of outstanding obligations and compliance retention requirements.",
      "Termination does not extinguish obligations accrued before termination, including payment obligations, indemnities, limitations, and dispute provisions.",
    ],
  },
  {
    title: "19. Governing Law and Dispute Resolution",
    paragraphs: [
      "These Terms are governed by the laws of the competent jurisdiction identified in your applicable service notice, excluding conflict-of-law principles where disallowed. Disputes should first be raised through support for good-faith resolution.",
      "If unresolved, disputes shall be handled by courts or arbitration forums specified in applicable law or contractual notice. Venue and procedural rules may vary by location and mandatory legal rights.",
    ],
  },
  {
    title: "20. Force Majeure",
    paragraphs: [
      "SG Gold is not liable for delay or failure caused by events beyond reasonable control, including natural disasters, war, terrorism, civil unrest, sanctions, regulatory directives, labor disruptions, internet outages, platform attacks, market halts, critical supplier failure, or utility disruptions.",
    ],
  },
  {
    title: "21. Assignment and Subcontracting",
    paragraphs: [
      "We may assign or transfer rights and obligations under these Terms as part of corporate reorganization, merger, acquisition, financing, or asset transfer, subject to applicable law. You may not assign rights or obligations without prior written consent.",
    ],
  },
  {
    title: "22. Entire Agreement and Severability",
    paragraphs: [
      "These Terms, together with incorporated policies and notices, constitute the entire agreement between you and SG Gold regarding Platform use. If any provision is held invalid or unenforceable, remaining provisions remain in full force to the extent permitted.",
    ],
  },
  {
    title: "23. Amendments",
    paragraphs: [
      "We may update these Terms periodically to reflect legal, regulatory, operational, or business changes. Updated Terms become effective upon posting or as otherwise communicated. Continued use after effectiveness constitutes acceptance to the extent permitted by law.",
    ],
  },
  {
    title: "24. Contact Information",
    paragraphs: [
      "For support or legal notices related to these Terms, use official SG Gold contact channels available in our app and website. Please include account and transaction context where relevant so we can respond efficiently.",
      "Effective Date: 20 March 2026",
      "Last Updated: 20 March 2026",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#f5f5f5]">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <h1 className="text-4xl font-black tracking-tight text-[#f0c96c] md:text-5xl">Terms and Conditions</h1>
        <p className="mt-4 text-sm leading-7 text-[#c8c8c8] md:text-base">
          These Terms govern use of SG Gold digital products, transactions, and related services. Please read this
          document carefully before using the Platform.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-[#242424] bg-[#111111] p-6 md:p-8">
              <h2 className="text-xl font-extrabold text-[#f2d480] md:text-2xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-sm leading-7 text-[#d4d4d4] md:text-base">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.title}-p-${index}`}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-[#d4d4d4] md:text-base">
                  {section.bullets.map((bullet, index) => (
                    <li key={`${section.title}-b-${index}`}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
