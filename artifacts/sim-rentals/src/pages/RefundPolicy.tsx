import { AlertTriangle, CheckCircle2, XCircle, ChevronRight, RefreshCw, Clock } from "lucide-react";
import { Link } from "wouter";
import { Reveal } from "@/components/Reveal";

const autoRefundCases = [
  {
    icon: Clock,
    title: "Window Expired — No SMS",
    desc: "If the 20-minute activation window expires and no SMS was delivered to your rented number, a full refund is automatically credited to your balance."
  },
  {
    icon: RefreshCw,
    title: "Cancelled Before Window Closes",
    desc: "If you cancel an active rental before the 20-minute window expires and no SMS was received, the full rental cost is instantly returned to your balance."
  },
];

const noRefundCases = [
  "Payments processed for adding funds to your account balance",
  "Rentals where an SMS was successfully delivered",
  "Voluntary account closures or terminations due to policy violations",
  "Cryptocurrency transactions that have been confirmed on-chain",
  "Funds spent on rentals that were not cancelled within the active window",
];

const faqs = [
  {
    q: "How long do refunds take?",
    a: "Automatic refunds to your account balance are instant — they appear immediately after the rental is cancelled or the window expires. There is no waiting period."
  },
  {
    q: "Can I get a refund if the number didn't work?",
    a: "If the number expired without receiving an SMS, you are automatically refunded. If you received an SMS but the code was rejected by the platform, this is outside our control and no refund is issued."
  },
  {
    q: "What happens to my balance if I stop using the service?",
    a: "Your balance remains in your account indefinitely. We do not expire or remove unused balances. However, once funds are added, they cannot be cashed out."
  },
  {
    q: "Are crypto payments refundable?",
    a: "No. Cryptocurrency payments are irreversible by nature. Once a top-up payment is confirmed on-chain and credited to your account, it cannot be reversed or refunded under any circumstances."
  },
  {
    q: "What if I'm charged incorrectly?",
    a: "If you believe there's been a billing error, contact our support team within 7 days of the transaction with details. We will investigate and resolve legitimate disputes."
  },
];

export default function RefundPolicy() {
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
            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">Refund Policy</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Last updated: April 2026</p>
          </div>
        </Reveal>

        {/* Critical Notice */}
        <Reveal variant="up" delay={60}>
          <div className="rounded-2xl p-6 mb-8 border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="font-black text-slate-900 dark:text-white text-lg mb-2">No Refunds on Payments</div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">Once a payment has been processed for adding funds to your account, no refund is provided under any circumstances.</strong> Cryptocurrency transactions are irreversible by nature. Please ensure you intend to use the service before making any payment.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Auto Refund Cases */}
        <Reveal variant="up" delay={80}>
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">When You Get an Automatic Refund</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {autoRefundCases.map((item, i) => (
                <Reveal key={i} variant="up" delay={i * 60}>
                  <div className="rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-9 w-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                        <item.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</h3>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>

        {/* No Refund Cases */}
        <Reveal variant="up" delay={120}>
          <div className="rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-8 w-8 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-500" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">No Refunds For</h2>
            </div>
            <ul className="space-y-3">
              {noRefundCases.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* How it works */}
        <Reveal variant="up" delay={140}>
          <div className="rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">How Automatic Refunds Work</h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Rent a number", desc: "Pay from your account balance to activate a number for 20 minutes." },
                { step: "2", title: "Wait for SMS or cancel", desc: "If no SMS arrives and you cancel, or the window expires — the refund triggers automatically." },
                { step: "3", title: "Balance restored instantly", desc: "The exact amount you paid for that rental is returned to your account balance with no delay." },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
                  <div className="h-8 w-8 rounded-full bg-[#4574FF]/10 border border-[#4574FF]/20 flex items-center justify-center shrink-0 font-black text-[#4574FF] text-sm">
                    {item.step}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{item.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* FAQ */}
        <Reveal variant="up" delay={160}>
          <div className="mb-8">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-5">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variant="up" delay={180}>
          <div className="rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/40">
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
              Have a question not covered here? Contact our support team from your account dashboard.
            </p>
            <Link href="/terms">
              <span className="inline-flex items-center gap-2 text-[#4574FF] text-sm font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                View Terms of Service <ChevronRight className="h-4 w-4" />
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
