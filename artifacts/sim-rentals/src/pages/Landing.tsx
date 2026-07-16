import {
  Shield, Globe, Lock, MessageSquare, RefreshCw, Clock,
  Phone, ArrowRight, Code2, Check, ChevronDown,
  Wifi, Activity, Sparkles, Zap
} from "lucide-react";
import { SkySmsLogo } from "@/components/SkySmsLogo";
import HowItWorks from "@/components/HowItWorks";
import { Reveal } from "@/components/Reveal";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

function svcIcon(domain: string) {
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;
}

const services = [
  { name: "Telegram",  domain: "telegram.org" },
  { name: "WhatsApp",  domain: "web.whatsapp.com" },
  { name: "Google",    domain: "google.com" },
  { name: "Instagram", domain: "instagram.com" },
  { name: "Facebook",  domain: "facebook.com" },
  { name: "Discord",   domain: "discord.com" },
  { name: "Amazon",    domain: "amazon.com" },
  { name: "PayPal",    domain: "paypal.com" },
  { name: "TikTok",    domain: "tiktok.com" },
  { name: "Twitter/X", domain: "x.com" },
  { name: "Netflix",   domain: "netflix.com" },
  { name: "LinkedIn",  domain: "linkedin.com" },
  { name: "Snapchat",  domain: "snapchat.com" },
  { name: "Microsoft", domain: "microsoft.com" },
  { name: "Uber",      domain: "uber.com" },
  { name: "Airbnb",    domain: "airbnb.com" },
];

const features = [
  {
    icon: Zap,
    color: "sky",
    title: "Instant Number Delivery",
    desc: "Numbers are allocated in under 3 seconds. No queue, no wait — just pick your service and go.",
  },
  {
    icon: Globe,
    color: "blue",
    title: "10+ Countries, Live Stock",
    desc: "Real-time availability per country shown before you buy. You never waste a cent on an out-of-stock number.",
  },
  {
    icon: Lock,
    color: "violet",
    title: "Crypto-Only Payments",
    desc: "Top up with BTC, ETH, USDT, and 30+ coins via OxaPay. Private, borderless, zero chargebacks.",
  },
  {
    icon: MessageSquare,
    color: "emerald",
    title: "Live SMS Inbox",
    desc: "Codes arrive in real time on your rental card. One tap to copy — no manual polling.",
  },
  {
    icon: RefreshCw,
    color: "sky",
    title: "Automatic Refunds",
    desc: "Cancel before expiry and get your balance back in under a second. Expired with no SMS? Also refunded.",
  },
  {
    icon: Code2,
    color: "blue",
    title: "Full REST API",
    desc: "API key authentication. Create rentals, poll messages, cancel numbers — fully automated.",
  },
];

const faqs = [
  {
    q: "How does renting a phone number work?",
    a: "Add credits to your account, pick a service (e.g. Telegram) and a country, then get a real temporary phone number instantly. Any SMS sent to that number appears on your dashboard in real time. Each rental has a set activation window.",
  },
  {
    q: "Which platforms are supported?",
    a: "We support 50+ platforms — Telegram, WhatsApp, Google, Instagram, Facebook, Discord, Amazon, PayPal, TikTok, and many more. Live availability is shown per service and country before you spend.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cryptocurrency payments only, processed via OxaPay. We accept BTC, ETH, USDT (TRC20 & ERC20), LTC, DOGE, TRX, and 30+ other coins. All transactions are private and borderless.",
  },
  {
    q: "What happens if I don't receive an SMS?",
    a: "Cancel an active rental before the window closes for an immediate full refund. If the window expires without an SMS, we automatically refund your balance — no questions asked.",
  },
  {
    q: "Are numbers shared with other users?",
    a: "Numbers are pooled between sessions, but each rental is completely isolated. You only ever see messages that arrive during your active window. No shared inboxes, no history leakage.",
  },
  {
    q: "Is there a developer API?",
    a: "Yes. Generate an API key in Settings and use our REST API to list services, create rentals, poll for incoming SMS, and cancel — fully scriptable for automation.",
  },
];

const stats = [
  { value: "50+",   label: "Supported platforms", icon: Activity },
  { value: "10+",   label: "Countries available", icon: Globe },
  { value: "<3s",   label: "Average delivery",    icon: Clock },
  { value: "100%",  label: "Refund guarantee",    icon: Shield },
];

const colorMap: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  sky:     { bg: "bg-sky-500/10",     border: "border-sky-500/20",     icon: "text-sky-400",     glow: "shadow-[0_0_24px_rgba(14,165,233,0.15)]" },
  blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    icon: "text-blue-400",    glow: "shadow-[0_0_24px_rgba(96,165,250,0.12)]" },
  violet:  { bg: "bg-violet-500/10",  border: "border-violet-500/20",  icon: "text-violet-400",  glow: "shadow-[0_0_24px_rgba(167,139,250,0.12)]" },
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "text-emerald-400", glow: "shadow-[0_0_24px_rgba(52,211,153,0.12)]" },
};

function LiveDashboardMockup() {
  return (
    <div className="rounded-2xl border border-white/[0.1] bg-[#111c30] shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(14,165,233,0.1)] overflow-hidden text-left w-full max-w-lg mx-auto">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.07] bg-white/[0.02]">
        <div className="h-2.5 w-2.5 rounded-full bg-rose-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        <div className="ml-3 flex-1 flex items-center justify-center">
          <div className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-3 py-1 border border-white/[0.08]">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 status-pulse" />
            <span className="text-[10px] text-slate-400 font-mono">sky-sms.xyz — dashboard</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3">
        {/* Active rental — static waiting state */}
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.05]">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center overflow-hidden">
                  <Phone className="h-4 w-4 text-sky-400" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">Virtual Number</div>
                  <div className="text-[11px] text-slate-500 font-mono">+1 (555) 012-3456</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold font-mono text-sky-400">14:22 left</div>
                <div className="text-[10px] text-slate-600 mt-0.5">United States</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <div className="h-1.5 w-1.5 rounded-full bg-sky-400 status-pulse" />
              Waiting for verification SMS…
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Balance",  val: "$4.85",  color: "text-sky-400" },
            { label: "Rentals",  val: "12",     color: "text-white" },
            { label: "Refunds",  val: "100%",   color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 text-center">
              <div className={`text-[15px] font-bold ${s.color}`}>{s.val}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default function Landing({ onLogin }: { onLogin?: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  const goSignIn = () => setLocation("/sign-in");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen premium-shell text-white" style={{ overflowX: "hidden" }}>

      {/* ── Ambient Background ── */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        {/* Grid lines (draxon-style dark version) */}
        <div className="absolute inset-0 hero-grid" />
        {/* Top gradient bloom */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 55% at 50% -5%, rgba(14,165,233,0.15) 0%, rgba(37,99,235,0.07) 40%, transparent 70%)" }} />
        {/* Side orbs */}
        <div className="absolute top-[8%] left-[-8%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(14,165,233,0.07) 0%, transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[-12%] right-[-8%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-[45%] right-[20%] w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(14,165,233,0.04) 0%, transparent 70%)", filter: "blur(70px)" }} />
      </div>

      {/* ── Navigation ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-sky-900/20 bg-[#050914]/90 backdrop-blur-2xl" : "bg-transparent"}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <SkySmsLogo size="md" />
          </div>

          <nav className="hidden items-center gap-7 text-[13px] font-medium text-slate-400 md:flex">
            <a className="hover:text-white transition-colors duration-150" href="#services">Services</a>
            <a className="hover:text-white transition-colors duration-150" href="#features">Features</a>
            <a className="hover:text-white transition-colors duration-150" href="#how-it-works">How It Works</a>
            <a className="hover:text-white transition-colors duration-150" href="#pricing">Pricing</a>
            <a className="hover:text-white transition-colors duration-150" href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={goSignIn}
              className="hidden text-[13px] font-medium text-slate-400 hover:text-white transition-colors sm:inline"
            >
              Sign in
            </button>
            <button
              onClick={goSignIn}
              className="h-9 px-5 rounded-xl text-[13px] font-bold btn-flat"
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left: Text */}
            <div>
              <Reveal variant="up" delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/[0.08] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-sky-300 mb-7 shimmer-border">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400 status-pulse" />
                  Live numbers · 50+ platforms
                </div>
              </Reveal>

              <Reveal variant="up" delay={80}>
                <h1 className="font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-white mb-6">
                  Instant Virtual Numbers{" "}
                  <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-sky-300 via-blue-300 to-sky-400 bg-clip-text text-transparent">
                    for Any Service
                  </span>
                </h1>
              </Reveal>

              <Reveal variant="up" delay={150}>
                <p className="text-[16px] leading-relaxed text-slate-400 mb-8 max-w-[460px]">
                  Rent a real phone number from anywhere in the world. Get verification codes instantly. No identity required, crypto payments only.
                </p>
              </Reveal>

              <Reveal variant="up" delay={220}>
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={goSignIn}
                    className="group h-12 px-8 rounded-xl text-[15px] font-bold flex items-center gap-2 btn-flat"
                  >
                    Rent a number
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a
                    href="#how-it-works"
                    className="h-12 inline-flex items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/[0.08] px-7 text-[15px] font-semibold text-sky-300 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/[0.15] transition-all duration-200"
                  >
                    How it works
                  </a>
                </div>
              </Reveal>

              <Reveal variant="up" delay={280}>
                <div className="flex flex-wrap gap-5">
                  {[
                    { icon: Shield,    text: "Private & secure" },
                    { icon: RefreshCw, text: "Auto-refunds" },
                    { icon: Wifi,      text: "Real-time SMS" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-2 text-[12px] text-slate-400">
                      <Icon className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right: Live Dashboard Mockup */}
            <Reveal variant="up" delay={120}>
              <LiveDashboardMockup />
            </Reveal>
          </div>

          {/* Stats strip */}
          <Reveal variant="up" delay={360}>
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-center hover:border-sky-500/15 hover:bg-sky-500/[0.02] transition-all duration-300">
                  <div className="font-display text-[2rem] font-bold bg-gradient-to-br from-sky-400 to-blue-400 bg-clip-text text-transparent mb-1">{stat.value}</div>
                  <div className="text-[12px] text-slate-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Services Marquee ── */}
        <section id="services" className="py-14 border-y border-white/[0.05]">
          <Reveal variant="up">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-slate-600 mb-8">
              Works with every major platform
            </p>
          </Reveal>
          <div className="relative overflow-hidden marquee-fade">
            <div className="flex gap-4 marquee-track" style={{ width: "max-content" }}>
              {[...services, ...services].map((svc, i) => (
                <button
                  key={`${svc.name}-${i}`}
                  onClick={goSignIn}
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 hover:border-sky-500/30 hover:bg-sky-500/[0.08] transition-all duration-200 shrink-0 group"
                >
                  <div className="h-7 w-7 rounded-lg bg-white/[0.06] flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={svcIcon(svc.domain)}
                      alt={svc.name}
                      className="h-5 w-5 object-contain"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <span className="text-[13px] font-medium text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">{svc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ── */}
        <HowItWorks />

        {/* ── Features ── */}
        <section id="features" className="py-24 border-t border-white/[0.04]">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal variant="up">
              <div className="text-center mb-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-500 mb-3">Platform Features</p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">
                  <span className="text-white">Built for </span>
                  <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">speed & privacy</span>
                </h2>
                <p className="text-[15px] text-slate-400 max-w-md mx-auto">Everything you need, nothing you don't. SKY SMS is built to be fast, reliable, and completely private.</p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feat, i) => {
                const c = colorMap[feat.color];
                return (
                  <Reveal key={feat.title} variant="up" delay={i * 60}>
                    <div className="feature-card rounded-2xl p-6 h-full group relative overflow-hidden">
                      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent via-current opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${c.icon}`} />
                      <div className={`mb-5 h-11 w-11 rounded-xl border flex items-center justify-center ${c.bg} ${c.border} ${c.glow} group-hover:scale-105 transition-transform duration-300`}>
                        <feat.icon className={`h-5 w-5 ${c.icon}`} />
                      </div>
                      <h3 className="font-display text-[15px] font-bold text-white mb-2">{feat.title}</h3>
                      <p className="text-[13px] leading-relaxed text-slate-500">{feat.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-24 border-t border-white/[0.04]">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal variant="up">
              <div className="text-center mb-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-500 mb-3">Pricing</p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold mb-3">
                  <span className="text-white">Pay only for </span>
                  <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">what you use</span>
                </h2>
                <p className="text-[15px] text-slate-400">No subscriptions. No hidden fees. Top up any amount and spend it when you need it.</p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={80}>
              <div className="relative rounded-3xl border border-sky-500/20 bg-gradient-to-br from-sky-500/[0.06] to-transparent p-8 text-center overflow-hidden"
                style={{ boxShadow: "0 0 80px rgba(14,165,233,0.06), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% -20%, rgba(14,165,233,0.1) 0%, transparent 65%)" }} />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-5 py-1.5 text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-6">
                    <Sparkles className="h-3 w-3" />
                    Pay as you go
                  </div>
                  <div className="mb-6">
                    <span className="font-display text-[4.5rem] font-black text-white leading-none">$0.10</span>
                    <span className="text-slate-400 text-[16px] ml-2">starting per SMS</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                    {[
                      "Instant number allocation",
                      "Real-time SMS delivery",
                      "Automatic refunds on no SMS",
                      "All 50+ platforms included",
                      "No monthly fees — ever",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-slate-300">
                        <div className="h-5 w-5 rounded-full bg-sky-500/15 border border-sky-500/25 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-sky-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={goSignIn}
                    className="h-12 px-10 rounded-xl text-[15px] font-bold btn-flat"
                  >
                    Start for free
                  </button>
                  <p className="text-[12px] text-slate-600 mt-4">Minimum top-up from $1 · Crypto only via OxaPay</p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-24 border-t border-white/[0.04]">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal variant="up">
              <div className="text-center mb-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-sky-500 mb-3">FAQ</p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold">
                  <span className="text-white">Common </span>
                  <span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">questions</span>
                </h2>
              </div>
            </Reveal>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <Reveal key={i} variant="up" delay={i * 40}>
                  <div
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      openFaq === i
                        ? "border-sky-500/20 bg-sky-500/[0.03]"
                        : "border-white/[0.06] bg-white/[0.015] hover:border-sky-500/10"
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-[14px] text-white group-hover:text-sky-200 transition-colors">{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-all duration-300 ${openFaq === i ? "rotate-180 text-sky-400" : "text-slate-600"}`} />
                    </button>
                    <div className={`faq-body ${openFaq === i ? "faq-body-open" : ""}`}>
                      <div className="faq-inner px-6 pb-5">
                        <p className="text-[13.5px] leading-relaxed text-slate-400">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-24 border-t border-white/[0.04]">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Reveal variant="up">
              <div className="relative rounded-3xl border border-sky-500/15 overflow-hidden px-8 py-16"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(14,165,233,0.08) 0%, transparent 60%)" }}>
                <div className="absolute inset-0 grid-pattern opacity-30" />
                <div className="relative z-10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-sky-500 mb-5">Get started today</p>
                  <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-black mb-5 leading-tight">
                    <span className="text-white">Your first number takes </span>
                    <span className="bg-gradient-to-r from-sky-300 via-sky-400 to-blue-400 bg-clip-text text-transparent">10 seconds.</span>
                  </h2>
                  <p className="text-[15px] text-slate-400 mb-8 max-w-md mx-auto">
                    No account approvals. No identity checks. Sign in and rent your first number right away.
                  </p>
                  <button
                    onClick={goSignIn}
                    className="group h-13 px-10 rounded-xl text-[16px] inline-flex items-center gap-2.5 btn-flat"
                  >
                    Start renting now
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-white/[0.04] py-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <SkySmsLogo size="sm" />
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-slate-500">
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </div>
              <div className="text-[12px] text-slate-600">
                © {new Date().getFullYear()} SKY SMS. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
