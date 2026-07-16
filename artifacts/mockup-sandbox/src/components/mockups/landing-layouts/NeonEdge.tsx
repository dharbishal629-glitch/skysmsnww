import React, { useState, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Globe2, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Bitcoin, 
  Smartphone, 
  ArrowRight,
  Menu,
  X
} from "lucide-react";

export default function NeonEdge() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [phoneBlink, setPhoneBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhoneBlink((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const faqs = [
    {
      q: "How fast do I get the SMS?",
      a: "Instantly. Once the service sends the SMS, it appears on your dashboard in under 3 seconds."
    },
    {
      q: "Can I reuse the same number later?",
      a: "Our standard numbers are for single-use verification. If you need a permanent number, check out our long-term rentals in the dashboard."
    },
    {
      q: "What if the SMS never arrives?",
      a: "If you don't receive an SMS within 5 minutes, you can cancel the number and you will be auto-refunded immediately. You only pay for successful verifications."
    },
    {
      q: "Do you accept cryptocurrencies?",
      a: "Yes! We accept BTC, ETH, USDT, LTC, DOGE, and other major cryptocurrencies for account top-ups."
    },
    {
      q: "Which countries do you support?",
      a: "We currently offer numbers from 10+ countries including the US, UK, Canada, Germany, France, and more, with new locations added weekly."
    }
  ];

  const services = [
    { name: "Telegram", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://telegram.org&size=128" },
    { name: "WhatsApp", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://whatsapp.com&size=128" },
    { name: "Google", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=128" },
    { name: "Instagram", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://instagram.com&size=128" },
    { name: "Facebook", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://facebook.com&size=128" },
    { name: "Discord", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://discord.com&size=128" },
    { name: "Amazon", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://amazon.com&size=128" },
    { name: "Netflix", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://netflix.com&size=128" },
    { name: "TikTok", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tiktok.com&size=128" },
    { name: "LinkedIn", url: "https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://linkedin.com&size=128" },
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #06b6d4 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="fixed top-0 left-0 w-full h-[500px] bg-cyan-900/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#050810]/80 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_1px_15px_rgba(6,182,212,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              <span className="text-xl font-bold tracking-wider text-white drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                SKY<span className="text-cyan-400">SMS</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-mono hover:text-cyan-400 transition-colors">/features</a>
              <a href="#how-it-works" className="text-sm font-mono hover:text-cyan-400 transition-colors">/guide</a>
              <a href="#pricing" className="text-sm font-mono hover:text-cyan-400 transition-colors">/pricing</a>
              <a href="#faq" className="text-sm font-mono hover:text-cyan-400 transition-colors">/faq</a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button className="text-sm font-mono hover:text-white transition-colors">Sign In</button>
              <button className="px-5 py-2.5 text-sm font-mono font-bold text-[#050810] bg-gradient-to-r from-cyan-400 to-sky-300 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all hover:scale-105 active:scale-95">
                Launch App
              </button>
            </div>

            <button className="md:hidden text-cyan-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#050810]/95 backdrop-blur-xl pt-24 px-6 border-b border-cyan-500/30">
          <div className="flex flex-col space-y-6 font-mono text-lg">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">/features</a>
            <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">/guide</a>
            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">/pricing</a>
            <a href="#faq" onClick={() => setIsMenuOpen(false)} className="hover:text-cyan-400">/faq</a>
            <hr className="border-cyan-500/20" />
            <button className="text-left hover:text-cyan-400">Sign In</button>
            <button className="px-5 py-3 text-center font-bold text-[#050810] bg-cyan-400 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              Launch App
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
              <span className="text-xs font-mono text-cyan-300">SYSTEM.ONLINE // API_READY</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Bypass <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                Verification
              </span>
              <br />
              Instantly.
            </h1>
            
            <p className="text-lg lg:text-xl text-slate-400 max-w-xl leading-relaxed">
              Rent temporary virtual phone numbers for instant SMS verification. 
              No contracts. Crypto accepted. Absolute privacy. 
              Works with 50+ platforms globally.
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <button className="group flex items-center gap-2 px-6 py-3.5 font-mono font-bold text-[#050810] bg-gradient-to-r from-cyan-400 to-sky-300 rounded-sm shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1">
                Rent a Number
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3.5 font-mono font-semibold text-cyan-400 border border-cyan-500/50 rounded-sm bg-cyan-500/5 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                How it works
              </button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[340px] lg:max-w-[400px]">
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-[60px] rounded-full" />
            
            {/* Phone Frame */}
            <div className="relative border-[4px] border-slate-800 rounded-[2.5rem] bg-[#0a0f1c] shadow-2xl overflow-hidden aspect-[9/19]">
              {/* Screen Top Bar */}
              <div className="absolute top-0 w-full h-7 bg-slate-800/50 flex justify-between items-center px-6 z-20 text-[10px] font-mono text-slate-400">
                <span>10:42</span>
                <div className="flex gap-1 items-center">
                  <div className="w-3 h-3 rounded-full border border-slate-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  </div>
                  <span>5G</span>
                </div>
              </div>

              {/* Phone Content */}
              <div className="absolute inset-0 pt-12 pb-6 px-4 flex flex-col z-10">
                <div className="text-center mb-6">
                  <div className="text-xs font-mono text-cyan-500 mb-1">ACTIVE VIRTUAL NUMBER</div>
                  <div className="text-2xl font-mono text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                    +1 (555) 019-8472
                  </div>
                  <div className="inline-block mt-2 px-2 py-0.5 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono rounded-sm">
                    LISTENING...
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-end gap-3 pb-4">
                  {/* SMS Bubbles */}
                  <div className="self-start max-w-[85%] bg-slate-800 border border-slate-700 rounded-lg rounded-tl-sm p-3 shadow-lg opacity-50">
                    <div className="text-[10px] text-slate-400 mb-1 font-mono">Netflix // 10:40</div>
                    <div className="text-sm">Your Netflix verification code is 4920.</div>
                  </div>
                  
                  {/* Animated new SMS */}
                  <div className={`self-start max-w-[85%] bg-[#0f172a] border border-cyan-500/50 rounded-lg rounded-tl-sm p-3 shadow-[0_0_15px_rgba(6,182,212,0.15)] transition-all duration-300 ${phoneBlink ? 'scale-[1.02] shadow-[0_0_25px_rgba(6,182,212,0.3)]' : 'scale-100'}`}>
                    <div className="text-[10px] text-cyan-400 mb-1 font-mono flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      Telegram // JUST NOW
                    </div>
                    <div className="text-sm text-white">
                      Telegram code: <span className="font-mono text-cyan-300 font-bold tracking-widest bg-cyan-900/40 px-1 rounded">82739</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="relative z-10 border-y border-cyan-500/20 bg-[#080c17]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-cyan-500/20">
            {[
              { label: "Platforms Supported", value: "50+" },
              { label: "Global Locations", value: "10+" },
              { label: "Average Price", value: "~$0.10" },
              { label: "Delivery Time", value: "< 3s" }
            ].map((stat, i) => (
              <div key={i} className="py-8 px-4 text-center group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="text-3xl lg:text-4xl font-mono font-bold text-sky-300 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] mb-1">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-slate-500 font-mono">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="relative z-10 py-12 overflow-hidden bg-[#050810]">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-[#050810] to-transparent z-10" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-[#050810] to-transparent z-10" />
        
        <div className="flex w-[200%] animate-marquee">
          <div className="flex w-1/2 justify-around items-center px-4">
            {services.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2 rounded-sm border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all cursor-default">
                <img src={s.url} alt={s.name} className="w-6 h-6 rounded-sm" />
                <span className="font-mono text-sm text-slate-300">{s.name}</span>
              </div>
            ))}
          </div>
          <div className="flex w-1/2 justify-around items-center px-4">
            {services.map((s, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-3 px-4 py-2 rounded-sm border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all cursor-default">
                <img src={s.url} alt={s.name} className="w-6 h-6 rounded-sm" />
                <span className="font-mono text-sm text-slate-300">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">
            System <span className="text-cyan-400">Capabilities</span>
          </h2>
          <p className="text-slate-400 font-mono text-sm max-w-2xl mx-auto">
            // Built for speed, anonymity, and scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Instant Delivery", desc: "Numbers are generated in milliseconds. SMS arrives in under 3 seconds on average." },
            { icon: Globe2, title: "Global Coverage", desc: "Access numbers from US, UK, Canada, and 10+ other regions with premium routing." },
            { icon: ShieldCheck, title: "Absolute Privacy", desc: "No KYC required. Disposable numbers ensure your real identity remains disconnected." },
            { icon: Bitcoin, title: "Crypto Native", desc: "Fund your account anonymously via BTC, ETH, USDT, LTC, or DOGE seamlessly." },
            { icon: Smartphone, title: "Live Inbox", desc: "Watch SMS codes arrive in real-time on your dashboard without refreshing." },
            { icon: Clock, title: "Auto-Refunds", desc: "If the SMS doesn't arrive within the timeout window, funds are instantly returned." },
          ].map((feature, i) => (
            <div key={i} className="group relative bg-[#0a0f1c] border border-slate-800 p-6 rounded-sm hover:bg-[#0d1425] transition-colors">
              <div className="absolute left-0 top-0 h-full w-[2px] bg-cyan-500/0 group-hover:bg-cyan-400 transition-colors shadow-[0_0_10px_rgba(6,182,212,1)]" />
              <feature.icon className="w-8 h-8 text-sky-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="relative z-10 py-24 bg-[#080c17]/50 border-y border-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-4">
                Execute in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">3 Steps</span>
              </h2>
              <p className="text-slate-400 font-mono text-sm mb-12">
                // Quick onboarding. Zero friction.
              </p>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500/50 before:via-cyan-500/20 before:to-transparent">
                {[
                  { step: "01", title: "Select Service & Country", desc: "Choose from 50+ platforms and 10+ regions. The system allocates a fresh number instantly." },
                  { step: "02", title: "Use the Number", desc: "Copy the provided virtual number and paste it into the app or website requesting verification." },
                  { step: "03", title: "Receive Code", desc: "Wait seconds. The SMS code appears in your live dashboard. Use it and you're done." }
                ].map((item, i) => (
                  <div key={i} className="relative flex items-start pl-12 md:pl-0">
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-[#050810] border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10">
                      <span className="font-mono text-xs text-cyan-400">{item.step}</span>
                    </div>
                    <div className="md:w-1/2 md:pr-12 md:text-right md:even:ml-auto md:even:text-left md:even:pr-0 md:even:pl-12 pt-2">
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Code snippet mockup */}
            <div className="bg-[#050810] rounded-sm border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
              <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-xs text-slate-500">api_request.sh</span>
              </div>
              <div className="p-6 text-cyan-300/80 overflow-x-auto whitespace-pre">
                <span className="text-pink-400">curl</span> -X POST https://api.skysms.io/v1/rent \<br/>
                {'  '}-H <span className="text-green-400">"Authorization: Bearer $SKYSMS_KEY"</span> \<br/>
                {'  '}-d <span className="text-green-400">'{'{'}"service":"telegram","country":"US"{'}'}'</span><br/>
                <br/>
                <span className="text-slate-500"># Response</span><br/>
                {'{'}<br/>
                {'  '}<span className="text-sky-300">"status"</span>: <span className="text-green-400">"success"</span>,<br/>
                {'  '}<span className="text-sky-300">"number"</span>: <span className="text-green-400">"+15550198472"</span>,<br/>
                {'  '}<span className="text-sky-300">"id"</span>: <span className="text-green-400">"req_983hf298h"</span><br/>
                {'}'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Highlight */}
      <section id="pricing" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl lg:text-5xl font-extrabold text-white mb-6">
          Pay Per <span className="text-cyan-400">Success</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto mb-12">
          No subscriptions. No hidden fees. Add funds to your balance and pay only when you successfully receive an SMS.
        </p>

        <div className="max-w-md mx-auto bg-[#0a0f1c] border border-cyan-500/30 rounded-sm p-8 relative shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          
          <div className="text-cyan-400 font-mono text-sm mb-4">STARTING AT</div>
          <div className="flex items-baseline justify-center gap-2 mb-6">
            <span className="text-6xl font-bold text-white tracking-tighter">$0.10</span>
            <span className="text-slate-400 font-mono">/ number</span>
          </div>
          
          <ul className="text-left space-y-4 mb-8 font-mono text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-cyan-400" /> Auto-refund on failure
            </li>
            <li className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-cyan-400" /> Full API access included
            </li>
            <li className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-cyan-400" /> 24/7 automated delivery
            </li>
          </ul>

          <button className="w-full py-4 font-mono font-bold text-[#050810] bg-cyan-400 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all hover:-translate-y-1">
            Top Up Balance
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 py-24 bg-[#080c17]/50 border-t border-cyan-500/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-12 text-center">
            System <span className="text-cyan-400">Queries</span>
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-[#050810] border border-slate-800 rounded-sm overflow-hidden transition-colors hover:border-cyan-500/30"
              >
                <button 
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-white pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-24 px-4 text-center border-t border-cyan-500/20">
        <div className="absolute inset-0 bg-cyan-900/10 pointer-events-none" />
        <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Ready to bypass?
        </h2>
        <p className="text-slate-400 font-mono mb-10">
          Join thousands of users generating virtual numbers daily.
        </p>
        <button className="px-8 py-4 font-mono text-lg font-bold text-[#050810] bg-gradient-to-r from-cyan-400 to-sky-300 rounded-sm shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] transition-all hover:scale-105">
          Create Free Account
        </button>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800 bg-[#050810] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
                <span className="text-xl font-bold tracking-wider text-white">
                  SKY<span className="text-cyan-400">SMS</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm max-w-sm mb-6">
                Premium virtual numbers for instant SMS verification. Fast, secure, and purely anonymous.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors cursor-pointer"><MessageSquare className="w-4 h-4" /></div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors cursor-pointer"><Globe2 className="w-4 h-4" /></div>
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Supported Countries</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-mono text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs font-mono">
              © {new Date().getFullYear()} SKY SMS. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-slate-600 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
