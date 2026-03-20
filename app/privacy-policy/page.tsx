import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SG Gold",
  description: "Privacy Policy for SG Gold web and mobile services",
};

const sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }> = [
  {
    title: "1. Introduction",
    paragraphs: [
      "This Privacy Policy describes how SG Gold, its affiliates, service providers, and authorized partners collect, use, process, disclose, transfer, retain, and protect personal information when you access, browse, register for, or use our websites, mobile applications, digital bullion products, wallet services, payment features, customer support channels, and related offerings (collectively, the Services).",
      "We are committed to responsible data practices, transparency, and security. This policy is intentionally comprehensive to support informed consent and to satisfy legal and regulatory expectations in jurisdictions where we operate. By creating an account, completing identity verification, or otherwise using the Services, you acknowledge that you have read and understood this Privacy Policy.",
      "If you do not agree with this Privacy Policy, please discontinue use of the Services. We may provide supplementary privacy notices for region-specific products, promotions, or legal obligations, and those notices should be read together with this policy.",
    ],
  },
  {
    title: "2. Scope and Applicability",
    paragraphs: [
      "This Privacy Policy applies to information processed in connection with all SG Gold digital channels, including but not limited to account onboarding, identity verification, bullion purchase and sale workflows, delivery scheduling, scheme enrollment, referral and rewards programs, payment reconciliation, support interactions, security reviews, and fraud prevention systems.",
      "This policy applies to current, former, and prospective users, and may also apply to visitors who interact with our support forms, marketing pages, and communications channels.",
    ],
  },
  {
    title: "3. Information We Collect",
    paragraphs: [
      "We collect information directly from you, automatically through your device and usage of our Services, from trusted third parties, and from lawful public sources where relevant and permitted.",
    ],
    bullets: [
      "Account identity data: full name, email address, mobile number, date of birth, address, profile identifiers, and account credentials.",
      "Verification and compliance data: government-issued identity documents, tax identifiers where required, selfie and liveness signals, verification outcomes, sanctions screening signals, and risk profile tags.",
      "Financial and transaction data: wallet balances, bullion units purchased or sold, invoice data, payment method references, settlement details, and fulfillment records.",
      "Device and technical data: IP address, device identifiers, platform and OS details, browser type, app version, language settings, crash logs, diagnostics, network metadata, and interaction timestamps.",
      "Behavioral and operational data: feature usage paths, session durations, error traces, clickstream events, and engagement activity to improve product quality and reliability.",
      "Communications data: messages sent to support, feedback submissions, call summaries, and notification preferences.",
      "Marketing and preference data: campaign interactions, referral metadata, consent records, and offer participation.",
      "Derived data: fraud-risk inferences, account health indicators, segmentation labels, and eligibility flags generated from internal models.",
    ],
  },
  {
    title: "4. Purposes of Processing",
    paragraphs: [
      "We process personal information only where we have a legal basis and a legitimate business need. Primary purposes include identity verification, account management, transaction execution, legal compliance, customer service, fraud prevention, security hardening, and service improvement.",
      "We also use data for audit trails, regulatory reporting, analytics, product testing, issue diagnostics, and communications regarding account activity, security alerts, policy updates, and essential service notices.",
    ],
    bullets: [
      "Provisioning and operating your account and wallet.",
      "Executing buy, sell, transfer, and delivery requests.",
      "Conducting KYC, AML, anti-fraud, and sanctions screening processes.",
      "Maintaining transaction records and reconciliation logs.",
      "Sending OTPs, alerts, receipts, and risk notifications.",
      "Improving service performance, UI quality, and user experience.",
      "Defending legal claims and ensuring platform integrity.",
    ],
  },
  {
    title: "5. Legal Bases for Processing",
    paragraphs: [
      "Depending on jurisdiction, we rely on one or more legal bases such as contractual necessity, legal obligation, legitimate interests, consent, and protection of vital interests. Where consent is required, you may withdraw it at any time, subject to lawful processing carried out before withdrawal.",
      "Where processing is necessary to comply with financial regulations, anti-money laundering rules, tax requirements, fraud control, or law enforcement obligations, we may process and retain data even if you close your account.",
    ],
  },
  {
    title: "6. Cookies, SDKs, and Similar Technologies",
    paragraphs: [
      "Our web and app properties may use cookies, local storage, pixels, SDK instrumentation, and similar technologies for authentication, session continuity, fraud defense, performance monitoring, diagnostics, and analytics.",
      "You can manage browser cookie settings and certain in-app permissions. Disabling some technologies may reduce availability of important account and security functions.",
    ],
  },
  {
    title: "7. Data Sharing and Disclosure",
    paragraphs: [
      "We do not sell personal information in the ordinary commercial sense. We disclose data only where necessary to deliver Services, satisfy legal obligations, maintain security, and support core operations.",
    ],
    bullets: [
      "Service providers: cloud infrastructure, payment processors, communications vendors, analytics vendors, and customer support tooling providers under contractual safeguards.",
      "Compliance and verification partners: identity verification, sanctions screening, fraud detection, and risk intelligence providers.",
      "Financial and logistics partners: banks, payment gateways, vaulting entities, fulfillment and delivery partners, and settlement processors where needed for a requested transaction.",
      "Group entities and affiliates for lawful internal governance, support, security operations, and consolidated reporting.",
      "Regulators, courts, law enforcement, and public authorities where legally required or where disclosure is necessary to protect rights, property, and safety.",
      "Corporate transactions such as mergers, acquisitions, financing, reorganization, insolvency, or asset transfer subject to confidentiality and lawful notice requirements.",
    ],
  },
  {
    title: "8. International Data Transfers",
    paragraphs: [
      "Your information may be processed in countries other than your own. Where cross-border transfers occur, we implement safeguards such as contractual protections, access controls, data minimization, encryption, and transfer impact assessments where applicable.",
      "By using the Services, you acknowledge that your information may be transferred and processed under systems and controls that are designed to maintain comparable levels of protection.",
    ],
  },
  {
    title: "9. Data Retention",
    paragraphs: [
      "We retain personal information for as long as necessary to provide Services, maintain records, comply with legal obligations, resolve disputes, enforce agreements, and support security and anti-fraud functions.",
      "Retention periods depend on data category, account status, transaction history, legal requirements, and regulatory standards. When retention is no longer required, we delete, anonymize, or securely archive information in accordance with applicable rules.",
    ],
  },
  {
    title: "10. Security Measures",
    paragraphs: [
      "We maintain layered administrative, technical, and physical controls designed to protect confidentiality, integrity, and availability of data. Controls may include encryption in transit, encryption at rest, tokenization, least-privilege access, monitoring, logging, anomaly detection, vulnerability management, incident response procedures, and role-based access governance.",
      "No method of transmission or storage is absolutely secure. You are responsible for maintaining the confidentiality of account credentials, enabling device-level security, and promptly notifying us of suspected unauthorized activity.",
    ],
  },
  {
    title: "11. Your Privacy Rights",
    paragraphs: [
      "Depending on your location, you may have rights including access, correction, deletion, portability, objection, restriction, and withdrawal of consent. You may also have rights related to automated decision-making and complaint submission to supervisory authorities.",
      "We may need to verify identity before processing requests. Some rights may be limited where data retention or processing is legally required for security, compliance, anti-fraud, or contractual obligations.",
    ],
  },
  {
    title: "12. Children and Age Restrictions",
    paragraphs: [
      "Our Services are not directed to minors and are intended only for users of legal age to enter financial transactions under applicable law. We do not knowingly collect personal information from children. If we become aware of unauthorized collection, we will take appropriate steps to delete or restrict such information.",
    ],
  },
  {
    title: "13. Third-Party Services and Links",
    paragraphs: [
      "Our Services may include links to third-party websites, payment experiences, and tools that are not operated by SG Gold. We are not responsible for the content, security, or privacy practices of third parties. You should review applicable third-party privacy notices before sharing information.",
    ],
  },
  {
    title: "14. Marketing Communications",
    paragraphs: [
      "We may send account-related communications, educational content, and promotional messages where permitted. You can manage marketing preferences through available settings or unsubscribe links. Transactional and security notifications are typically mandatory for account safety and service continuity.",
    ],
  },
  {
    title: "15. Automated Processing and Fraud Defense",
    paragraphs: [
      "We use rule-based and statistical systems to identify suspicious patterns, reduce abuse, and protect users. This may include velocity checks, behavioral signals, geolocation indicators, device fingerprints, and transactional anomaly scoring.",
      "Automated systems may contribute to decisions such as temporary risk holds, verification escalation, or additional review requirements. Where required by law, we provide mechanisms to request review.",
    ],
  },
  {
    title: "16. Incident Management",
    paragraphs: [
      "We maintain procedures to detect, investigate, contain, and remediate security incidents. Where legally required, we may provide notice to users, regulators, and other stakeholders. Incident records may be retained for legal and operational purposes.",
    ],
  },
  {
    title: "17. Data Accuracy and User Responsibilities",
    paragraphs: [
      "You agree to provide accurate and current information and to update your account when details change. Inaccurate information may lead to account restrictions, delayed transactions, or compliance escalations.",
      "You are responsible for safeguarding credentials, monitoring account activity, and reporting unauthorized use immediately.",
    ],
  },
  {
    title: "18. Regional Disclosures",
    paragraphs: [
      "Users in specific jurisdictions may receive supplemental notices describing region-specific rights and disclosures, including lawful basis details, rights exercise channels, and supervisory authority contacts. In the event of conflict between this policy and mandatory local law, local law controls.",
    ],
  },
  {
    title: "19. Changes to This Privacy Policy",
    paragraphs: [
      "We may revise this Privacy Policy periodically to reflect legal, technical, and business developments. Material changes may be communicated through in-app notices, website updates, email alerts, or other lawful means. Continued use of the Services after an effective date constitutes acceptance of the revised policy, to the extent permitted by law.",
    ],
  },
  {
    title: "20. Contact Us",
    paragraphs: [
      "If you have questions, concerns, or requests regarding this Privacy Policy, please contact SG Gold support using the official support channels available in the app or website. For legal and compliance inquiries, include sufficient detail to help us validate and process your request efficiently.",
      "Effective Date: 20 March 2026",
      "Last Updated: 20 March 2026",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#f5f5f5]">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <h1 className="text-4xl font-black tracking-tight text-[#f0c96c] md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-[#c8c8c8] md:text-base">
          SG Gold values your privacy and data security. This page contains a comprehensive explanation of how
          personal information is handled across our digital bullion ecosystem.
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
