import {
  Shield, Globe, Lock, MessageSquare, RefreshCw, Clock,
  ArrowRight, Code2, Check, ChevronDown,
  Wifi, Activity, Sparkles, Zap, MessageCircle, Bolt,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SkySmsLogoMark } from "@/components/SkySmsLogo";
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
    title: "Instant Number Delivery",
    desc: "Numbers are allocated in under 3 seconds. No queue, no wait — just pick your service and go.",
  },
  {
    icon: Globe,
    title: "10+ Countries, Live Stock",
    desc: "Real-time availability per country shown before you buy. You never waste a cent on an out-of-stock number.",
  },
  {
    icon: Lock,
    title: "Crypto-Only Payments",
    desc: "Top up with BTC, ETH, USDT, and 30+ coins via OxaPay. Private, borderless, zero chargebacks.",
  },
  {
    icon: MessageSquare,
    title: "Live SMS Inbox",
    desc: "Codes arrive in real time on your rental card. One tap to copy — no manual polling.",
  },
  {
    icon: RefreshCw,
    title: "Automatic Refunds",
    desc: "Cancel before expiry and get your balance back in under a second. Expired with no SMS? Also refunded.",
  },
  {
    icon: Code2,
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
  { value: "10+",   label: "Countries available",  icon: Globe },
  { value: "<3s",   label: "Average delivery",     icon: Clock },
  { value: "100%",  label: "Refund guarantee",     icon: Shield },
];

/** Floating badge used in the hero illustration */
function FloatingBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-2xl bg-white/80 border border-white/90 shadow-lg backdrop-blur-md px-4 py-2.5 text-[12px] font-semibold text-slate-800 ${className}`}>
      {children}
    </div>
  );
}

/** Inline SKY SMS wordmark for the landing */
function LandingLogo() {
  return (
    <img src="/brand-logo.jpg" alt="SKY SMS" className="h-9 w-auto rounded-lg" />
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
    <div className="min-h-screen premium-shell" style={{ overflowX: "hidden" }}>

      {/* ── Ambient grid overlay ── */}
      <div className="pointer-events-none fixed inset-0 z-0 hero-grid opacity-60" aria-hidden />

      {/* ── Navigation ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/30 bg-white/60 backdrop-blur-2xl shadow-sm"
          : "bg-transparent"
      }`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <LandingLogo />

          <nav className="hidden items-center gap-7 text-[13px] font-semibold text-[#0a1628] md:flex">
            <a className="hover:text-[#0a1628] transition-colors duration-150" href="#services">Services</a>
            <a className="hover:text-[#0a1628] transition-colors duration-150" href="#features">Features</a>
            <a className="hover:text-[#0a1628] transition-colors duration-150" href="#pricing">Pricing</a>
            <a className="hover:text-[#0a1628] transition-colors duration-150" href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={goSignIn}
              className="hidden text-[13px] font-semibold text-[#0a1628] hover:text-[#0a1628] transition-colors sm:inline"
            >
              Sign in
            </button>
            <button
              onClick={goSignIn}
              className="h-9 px-5 rounded-xl text-[13px] font-bold btn-flat shadow-md"
            >
              Get a Number
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">

        {/* ── Hero ── */}
        <section className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">

          {/* Floating badges */}
          <div className="hidden lg:block">
            <FloatingBadge className="absolute left-[2%] top-[30%] float-badge">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              SMS received
            </FloatingBadge>
            <FloatingBadge className="absolute right-[2%] top-[55%] float-badge-2">
              <Check className="h-3.5 w-3.5 text-[#4574FF]" />
              Code delivered
            </FloatingBadge>
            <div className="absolute right-[5%] top-[20%] h-11 w-11 rounded-2xl bg-[#4574FF] shadow-lg flex items-center justify-center float-badge-2">
              <Zap className="h-5 w-5 text-white" />
            </div>
          </div>

          <Reveal variant="up" delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/50 backdrop-blur-sm px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#4574FF] mb-7 shadow-sm shimmer-border">
              <span className="h-1.5 w-1.5 rounded-full bg-[#4574FF] status-pulse" />
              Virtual numbers for SMS verification
            </div>
          </Reveal>

          <Reveal variant="up" delay={60}>
            <div className="inline-block mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0a1628]/60 bg-white/40 rounded-full px-3 py-1">
                Pay per activation
              </span>
            </div>
          </Reveal>

          <Reveal variant="up" delay={100}>
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0a1628] mb-6">
              Receive SMS of Any Service Online &amp; API Access
            </h1>
          </Reveal>

          <Reveal variant="up" delay={170}>
            <p className="text-[16px] leading-relaxed text-[#0a1628] mb-10 max-w-[520px] mx-auto">
              Get virtual numbers here to receive SMS codes instantly—either on our site or via API. Easily create accounts on your favorite apps, and unlock cool perks and profits.
            </p>
          </Reveal>

          <Reveal variant="up" delay={230}>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <button
                onClick={goSignIn}
                className="group h-13 px-9 rounded-xl text-[15px] font-bold flex items-center gap-2 btn-flat shadow-lg"
              >
                Get a Number
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <a
                href="#pricing"
                className="h-13 inline-flex items-center justify-center rounded-xl btn-glass border px-7 text-[15px] font-semibold text-[#0a1628] shadow"
              >
                View pricing
              </a>
            </div>
          </Reveal>

          {/* Trust badges */}
          <Reveal variant="up" delay={290}>
            <div className="flex flex-wrap justify-center gap-5">
              {[
                { icon: Shield,    text: "Private & secure" },
                { icon: RefreshCw, text: "Auto-refunds" },
                { icon: Wifi,      text: "Real-time SMS" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-[12px] text-[#0a1628] font-medium">
                  <Icon className="h-3.5 w-3.5 text-[#4574FF] shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── Stats Strip ── */}
        <Reveal variant="up" delay={350}>
          <div className="mx-auto max-w-4xl px-6 pb-16">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white/50 backdrop-blur-sm border border-white/70 p-5 text-center shadow-sm hover:shadow-md hover:bg-white/65 transition-all duration-300">
                  <div className="font-display text-[2rem] font-black text-[#0a1628] mb-1">{stat.value}</div>
                  <div className="text-[12px] text-[#0a1628]/75 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* ── Services Marquee ── */}
        <section id="services" className="py-14 border-y border-white/40">
          <Reveal variant="up">
            <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-[#0a1628]/80 mb-8">
              Works with every major platform
            </p>
          </Reveal>
          <div className="relative overflow-hidden marquee-fade">
            <div className="flex gap-4 marquee-track" style={{ width: "max-content" }}>
              {[...services, ...services].map((svc, i) => (
                <button
                  key={`${svc.name}-${i}`}
                  onClick={goSignIn}
                  className="flex items-center gap-2.5 rounded-xl bg-white/55 backdrop-blur-sm border border-white/70 px-4 py-2.5 hover:bg-white/80 hover:border-white hover:shadow-md transition-all duration-200 shrink-0 group shadow-sm"
                >
                  <div className="h-7 w-7 rounded-lg bg-white/70 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={svcIcon(svc.domain)}
                      alt={svc.name}
                      className="h-5 w-5 object-contain"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <span className="text-[13px] font-semibold text-[#0a1628] group-hover:text-[#0a1628] transition-colors whitespace-nowrap">{svc.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="py-20 border-t border-white/30">
          <div className="mx-auto max-w-6xl px-6">
            <Reveal variant="up">
              <div className="text-center mb-16">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#4574FF] mb-3">Platform Features</p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#0a1628] mb-3">
                  Built for speed & privacy
                </h2>
                <p className="text-[15px] text-[#0a1628]/75 max-w-md mx-auto">
                  Everything you need, nothing you don't. SKY SMS is built to be fast, reliable, and completely private.
                </p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feat, i) => (
                <Reveal key={feat.title} variant="up" delay={i * 60}>
                  <div className="feature-card rounded-2xl p-6 h-full group relative overflow-hidden">
                    <div className="mb-5 h-11 w-11 rounded-xl bg-[#4574FF]/10 border border-[#4574FF]/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                      <feat.icon className="h-5 w-5 text-[#4574FF]" />
                    </div>
                    <h3 className="font-display text-[15px] font-bold text-[#0a1628] mb-2">{feat.title}</h3>
                    <p className="text-[13px] leading-relaxed text-[#0a1628]/75">{feat.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="py-20 border-t border-white/30">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal variant="up">
              <div className="text-center mb-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#4574FF] mb-3">Pricing</p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#0a1628] mb-3">
                  Pay only for what you use
                </h2>
                <p className="text-[15px] text-[#0a1628]/75">No subscriptions. No hidden fees. Top up any amount and spend it when you need it.</p>
              </div>
            </Reveal>

            <Reveal variant="up" delay={80}>
              <div className="relative rounded-3xl overflow-hidden shadow-xl">
                {/* White glass card */}
                <div className="relative bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-8 text-center">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#4574FF]/5 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#4574FF]/20 bg-[#4574FF]/8 px-5 py-1.5 text-[11px] font-bold text-[#4574FF] uppercase tracking-wider mb-6">
                      <Sparkles className="h-3 w-3" />
                      Pay as you go
                    </div>
                    <div className="mb-6">
                      <span className="font-display text-[4.5rem] font-black text-[#0a1628] leading-none">$0.10</span>
                      <span className="text-[#0a1628]/60 text-[16px] ml-2">starting per SMS</span>
                    </div>
                    <ul className="space-y-3 mb-8 text-left max-w-sm mx-auto">
                      {[
                        "Instant number allocation",
                        "Real-time SMS delivery",
                        "Automatic refunds on no SMS",
                        "All 50+ platforms included",
                        "No monthly fees — ever",
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-3 text-[14px] text-[#0a1628]">
                          <div className="h-5 w-5 rounded-full bg-[#4574FF]/12 border border-[#4574FF]/25 flex items-center justify-center shrink-0">
                            <Check className="h-3 w-3 text-[#4574FF]" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={goSignIn}
                      className="h-12 px-10 rounded-xl text-[15px] font-bold btn-flat shadow-lg"
                    >
                      Start for free
                    </button>
                    <p className="text-[12px] text-[#0a1628]/60 mt-4">Minimum top-up from $1 · Crypto only via OxaPay</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="py-20 border-t border-white/30">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal variant="up">
              <div className="text-center mb-14">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#4574FF] mb-3">FAQ</p>
                <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-bold text-[#0a1628]">
                  Common questions
                </h2>
              </div>
            </Reveal>

            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <Reveal key={i} variant="up" delay={i * 40}>
                  <div
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      openFaq === i
                        ? "border-[#4574FF]/20 bg-white/70 shadow-md"
                        : "border-white/60 bg-white/40 hover:border-white/80 hover:bg-white/55"
                    } backdrop-blur-sm`}
                  >
                    <button
                      className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 group"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    >
                      <span className="font-semibold text-[14px] text-[#0a1628] group-hover:text-[#4574FF] transition-colors">{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 shrink-0 transition-all duration-300 ${openFaq === i ? "rotate-180 text-[#4574FF]" : "text-slate-400"}`} />
                    </button>
                    <div
                      style={{
                        maxHeight: openFaq === i ? "300px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.35s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <div className="px-6 pb-5">
                        <p className="text-[13.5px] leading-relaxed text-[#0a1628]/75">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-20 border-t border-white/30">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <Reveal variant="up">
              <div className="relative rounded-3xl overflow-hidden px-8 py-16 bg-white/50 backdrop-blur-xl border border-white/70 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-[#4574FF]/6 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#4574FF] mb-5">Get started today</p>
                  <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-black mb-5 leading-tight text-[#0a1628]">
                    Your first number takes{" "}
                    <span className="text-[#4574FF]">10 seconds.</span>
                  </h2>
                  <p className="text-[15px] text-[#0a1628]/80 mb-8 max-w-md mx-auto">
                    No account approvals. No identity checks. Sign in and rent your first number right away.
                  </p>
                  <button
                    onClick={goSignIn}
                    className="group h-13 px-10 rounded-xl text-[16px] inline-flex items-center gap-2.5 btn-flat shadow-lg"
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
        <footer className="border-t border-white/40 py-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <LandingLogo />
              <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-[#0a1628]/75">
                <a href="/terms" className="hover:text-[#0a1628] transition-colors">Terms of Service</a>
                <a href="/refund-policy" className="hover:text-[#0a1628] transition-colors">Refund Policy</a>
                <a href="#faq" className="hover:text-[#0a1628] transition-colors">FAQ</a>
              </div>
              <div className="text-[12px] text-[#0a1628]/60">
                © {new Date().getFullYear()} SKY SMS. All rights reserved.
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
