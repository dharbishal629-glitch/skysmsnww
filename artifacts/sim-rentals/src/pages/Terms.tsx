import { Scale, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Reveal } from "@/components/Reveal";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using SKY SMS ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not use our Service. These terms apply to all users, visitors, and others who access or use the Service.`
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: `SKY SMS provides a temporary phone number rental service for SMS verification purposes. Users may rent virtual phone numbers to receive one-time verification codes from third-party platforms. Numbers are available for a limited activation window of 20 minutes per rental.`
  },
  {
    id: "accounts",
    title: "3. User Accounts",
    content: `You must create an account to use SKY SMS. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to terminate accounts that violate these terms.`
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable Use",
    content: `You agree to use the Service only for lawful purposes. You may not use SKY SMS to: (a) violate any applicable laws or regulations; (b) send unsolicited messages or spam; (c) impersonate any person or entity; (d) interfere with or disrupt the integrity or performance of the Service; (e) attempt to gain unauthorized access to any systems or networks. Any violation may result in immediate account termination.`
  },
  {
    id: "payments",
    title: "5. Payments & Billing",
    content: `SKY SMS accepts cryptocurrency payments via OxaPay. All payments are processed in USD equivalent. Funds added to your account balance are consumed when renting numbers. Prices for each rental are displayed before purchase. We reserve the right to modify pricing at any time.`
  },
  {
    id: "refunds",
    title: "6. Refund Policy",
    content: `Automatic refunds are issued when: (a) a rental is cancelled before the 20-minute window expires with no SMS received; (b) the activation window expires with no SMS delivered. Once a payment has been processed for adding funds to your account, no refunds are issued. See our full Refund Policy for details.`
  },
  {
    id: "availability",
    title: "7. Service Availability",
    content: `SKY SMS provides number availability on a best-effort basis. We do not guarantee that numbers will always be available for any specific country or service. Network availability, provider stock, and technical factors may affect number availability at any time.`
  },
  {
    id: "privacy",
    title: "8. Privacy",
    content: `We collect and use information as described in our Privacy Policy. By using the Service, you consent to the collection and use of your information. We do not sell personal data to third parties. All sessions are encrypted and stored securely.`
  },
  {
    id: "disclaimer",
    title: "9. Disclaimer of Warranties",
    content: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. Your use of the Service is at your sole risk.`
  },
  {
    id: "limitation",
    title: "10. Limitation of Liability",
    content: `To the maximum extent permitted by law, SKY SMS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, arising out of or in connection with these terms or the use of the Service.`
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    content: `We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the new terms. We encourage you to review these terms periodically.`
  },
  {
    id: "contact",
    title: "12. Contact",
    content: `If you have any questions about these Terms of Service, please contact us through the support channels available in your account dashboard.`
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#080c18]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-[#080c18]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 h-14">
          <Link href="/">
            <span className="font-display text-[15px] font-extrabold tracking-tight text-[#0a1628] dark:text-white cursor-pointer">
              SKY<span className="text-[#4574FF] ml-1">SMS</span>
            </span>
          </Link>
          <Link href="/">
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
              ← Back to Home
            </span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-14 sm:px-6 lg:px-8">
        <Reveal variant="up">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-5 w-fit rounded-full border border-[#4574FF]/20 bg-[#4574FF]/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#4574FF]">
              Legal
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Terms of Service</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: April 2026</p>
          </div>
        </Reveal>

        <Reveal variant="up" delay={60}>
          <div className="rounded-2xl p-6 mb-8 flex items-start gap-4 border-l-4 border-l-[#4574FF] border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
            <Scale className="h-5 w-5 text-[#4574FF] shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white mb-1">Please read these terms carefully</div>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                These Terms of Service govern your use of SKY SMS. By using our service, you agree to these terms in full. If you disagree with any part, please do not use the service.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <Reveal key={section.id} variant="up" delay={i * 30}>
              <div className="rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">{section.title}</h2>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{section.content}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal variant="up" delay={200}>
          <div className="mt-10 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              By using SKY SMS, you acknowledge that you have read and agree to these Terms of Service.
            </p>
            <Link href="/refund-policy">
              <span className="inline-flex items-center gap-2 text-[#4574FF] text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                View Refund Policy <ChevronRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </Reveal>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-800 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} SKY SMS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
