import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SG Gold",
  description: "Privacy Policy for SG Gold web and mobile services",
};

const sections: Array<{ title: string; paragraphs: string[]; bullets?: string[] }> = [
  {
    title: "1. Introduction",
    paragraphs: [
      "This Privacy Policy explains, at a high level, how SG Gold handles information when you use our website, apps, and related services.",
      "We follow data minimization, security, and transparency principles and use information only for service delivery, legal compliance, and support.",
      "If you do not agree with this Privacy Policy, please discontinue use of the Services.",
    ],
  },
  {
    title: "2. Scope and Applicability",
    paragraphs: [
      "This Privacy Policy applies to information processed through SG Gold digital channels, including account, transaction, support, and security workflows.",
      "It applies to users and visitors who interact with our services and official communication channels.",
    ],
  },
  {
    title: "3. Information We Collect",
    paragraphs: [
      "We collect information directly from you, from your use of our Services, and from trusted partners where required to provide the service.",
    ],
    bullets: [
      "Account information you provide during onboarding and profile management.",
      "Service and transaction information required to deliver SG Gold features.",
      "Technical information needed for app reliability, security, and fraud prevention.",
      "Communication and preference information when you contact support or manage notifications.",
    ],
  },
  {
    title: "4. Purposes of Processing",
    paragraphs: [
      "We process information only where needed for service operation, legal obligations, security, and customer support.",
      "We may also process information for quality improvement, incident handling, and important service communications.",
    ],
    bullets: [
      "Providing account access and core platform features.",
      "Processing user-initiated service actions.",
      "Meeting compliance and security requirements.",
      "Sending required service and account notifications.",
      "Improving stability and user experience.",
    ],
  },
  {
    title: "5. Legal Bases for Processing",
    paragraphs: [
      "Where applicable, we rely on legal bases such as contractual necessity, legal obligation, legitimate interests, and consent.",
      "You may withdraw consent where consent is the legal basis, subject to prior lawful processing and mandatory legal retention.",
    ],
  },
  {
    title: "6. Cookies, SDKs, and Similar Technologies",
    paragraphs: [
      "Our services may use cookies and similar technologies for authentication, performance, analytics, and security.",
      "You can manage certain preferences through browser and device settings.",
    ],
  },
  {
    title: "7. Data Sharing and Disclosure",
    paragraphs: [
      "We do not sell personal information in the ordinary commercial sense. We share information only where needed for service operation, compliance, and security.",
    ],
    bullets: [
      "Service providers that support hosting, operations, communication, and support.",
      "Partners involved in processing and completing requested services.",
      "Authorities where disclosure is legally required.",
      "Affiliates and successors where permitted by law and contractual safeguards.",
    ],
  },
  {
    title: "8. International Data Transfers",
    paragraphs: [
      "Information may be processed in jurisdictions other than your own where our service providers operate.",
      "When transfers occur, we apply safeguards designed to protect confidentiality and security.",
    ],
  },
  {
    title: "9. Data Retention",
    paragraphs: [
      "We retain information only for as long as needed for service delivery, legal obligations, dispute handling, and security.",
      "When retention is no longer required, information is deleted, anonymized, or securely archived as applicable.",
    ],
  },
  {
    title: "10. Security Measures",
    paragraphs: [
      "We apply administrative, technical, and organizational measures to protect confidentiality, integrity, and availability of information.",
      "No system is completely risk-free, and users should also protect account credentials and report suspicious activity promptly.",
    ],
  },
  {
    title: "11. Your Privacy Rights",
    paragraphs: [
      "Depending on local law, you may have rights such as access, correction, deletion, and withdrawal of consent.",
      "We may verify identity before fulfilling requests and may retain limited information where legally required.",
    ],
  },
  {
    title: "12. Children and Age Restrictions",
    paragraphs: [
      "Our Services are intended for users of legal age under applicable law and are not directed to children.",
    ],
  },
  {
    title: "13. Third-Party Services and Links",
    paragraphs: [
      "Our Services may include third-party tools or links. Their privacy practices are governed by their own policies.",
    ],
  },
  {
    title: "14. Marketing Communications",
    paragraphs: [
      "We may send service and marketing communications where permitted.",
      "You can opt out of non-essential marketing messages through available controls.",
    ],
  },
  {
    title: "15. Automated Processing and Fraud Defense",
    paragraphs: [
      "We use automated and manual controls to support security, fraud prevention, and platform reliability.",
      "Where required by law, additional review channels may be provided.",
    ],
  },
  {
    title: "16. Incident Management",
    paragraphs: [
      "We maintain procedures to detect, investigate, and respond to security incidents.",
      "Where required by law, we may provide notifications to affected users or authorities.",
    ],
  },
  {
    title: "17. Data Accuracy and User Responsibilities",
    paragraphs: [
      "You are responsible for providing accurate information and safeguarding your account credentials.",
      "Please report unauthorized use or account concerns through official support channels.",
    ],
  },
  {
    title: "18. Regional Disclosures",
    paragraphs: [
      "Users in some regions may receive additional notices to satisfy local legal requirements.",
    ],
  },
  {
    title: "19. Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time.",
      "Material updates may be communicated in-app, on the website, or through other official channels.",
    ],
  },
  {
    title: "20. Contact Us",
    paragraphs: [
      "If you have questions or requests regarding this Privacy Policy, contact SG Gold support through official app or website channels.",
      "Effective Date: 20 March 2026",
      "Last Updated: 27 March 2026",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-[#f5f5f5]">
      <div className="mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-20">
        <h1 className="text-4xl font-black tracking-tight text-[#f0c96c] md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-[#c8c8c8] md:text-base">
          SG Gold values your privacy and data security. This page provides a clear, high-level explanation of
          how information is handled across our services.
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
