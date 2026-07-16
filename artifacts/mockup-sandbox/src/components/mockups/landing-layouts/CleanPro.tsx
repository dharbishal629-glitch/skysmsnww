import React, { useState } from 'react';
import { 
  ChevronRight, Shield, Globe, Zap, Smartphone, Check, ChevronDown, 
  Activity, Lock, MessageSquare, CreditCard, ChevronUp, Copy
} from 'lucide-react';

const ACCORDION_DATA = [
  {
    question: "How long does a temporary number last?",
    answer: "Numbers are typically active for 15-20 minutes, giving you plenty of time to receive your SMS verification code. Once the time expires or you receive the code, the number is disposed of securely."
  },
  {
    question: "Do I have to pay if I don't receive the SMS?",
    answer: "No. If you don't receive an SMS within the designated time frame, the transaction is automatically cancelled and your balance is fully refunded instantly."
  },
  {
    question: "Can I use the number for multiple platforms?",
    answer: "Each rental is tied to a specific service (e.g., Telegram or WhatsApp) to ensure maximum delivery rates. You cannot use a single rental for multiple different services."
  },
  {
    question: "What cryptocurrencies do you accept?",
    answer: "We accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT TRC20/ERC20), Litecoin (LTC), and Dogecoin (DOGE) via our automated payment gateway."
  },
  {
    question: "Are these VOIP or real SIM numbers?",
    answer: "We provide non-VOIP, real mobile numbers from actual SIM cards. This ensures 99% success rates even with strict platforms like WhatsApp, Google, and Tinder."
  }
];

const SERVICES = [
  { name: 'Telegram', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://telegram.org&size=128' },
  { name: 'WhatsApp', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://whatsapp.com&size=128' },
  { name: 'Google', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://google.com&size=128' },
  { name: 'Instagram', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://instagram.com&size=128' },
  { name: 'Discord', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://discord.com&size=128' },
  { name: 'TikTok', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tiktok.com&size=128' },
  { name: 'Twitter / X', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://x.com&size=128' },
  { name: 'Netflix', icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://netflix.com&size=128' },
];

const CleanPro = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0f1a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-sky-500 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#0a0f1a] fill-current" />
            </div>
            <span className="text-white font-semibold tracking-tight">SKY SMS</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#services" className="text-slate-400 hover:text-white transition-colors">Services</a>
            <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors">FAQ</a>
            <a href="#api" className="text-slate-400 hover:text-white transition-colors">API</a>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="/login" className="hidden sm:block text-slate-300 hover:text-white font-medium transition-colors">Sign In</a>
            <a href="/register" className="bg-sky-500 hover:bg-sky-400 text-[#0a0f1a] px-4 py-2 rounded-full font-medium transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-medium mb-8">
              <Zap className="w-3.5 h-3.5" />
              Pay per activation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Instant Virtual Numbers for Global Verification.
            </h1>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              Bypass SMS verification on 50+ platforms with temporary, real non-VOIP phone numbers. Top up with crypto and pay only for successful SMS deliveries. Zero subscription fees.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a href="/register" className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-[#0a0f1a] px-6 py-3 rounded-full font-medium transition-colors w-full sm:w-auto">
                Rent a Number <ChevronRight className="w-4 h-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 font-medium transition-colors w-full sm:w-auto">
                How it works
              </a>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-500" /> API Access</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-500" /> Auto-refunds</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-sky-500" /> Real SIMs</span>
            </div>
          </div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-md bg-[#0f1523] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative z-10">
              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#131b2c]">
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <Activity className="w-4 h-4 text-sky-500" />
                  Live Rentals
                </div>
                <div className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md">
                  Balance: $14.50
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                {/* Active Rental */}
                <div className="bg-[#1a2333] border border-sky-500/30 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img src={SERVICES[0].icon} alt="Telegram" className="w-5 h-5 rounded-sm" />
                      <span className="text-sm font-medium text-white">Telegram</span>
                    </div>
                    <span className="text-xs text-sky-400 font-mono animate-pulse">14:59</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-white tracking-wider font-mono">+1 (555) 019-3842</span>
                      <button className="text-slate-500 hover:text-slate-300"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                      Waiting SMS
                    </div>
                  </div>
                </div>
                
                {/* Completed Rental */}
                <div className="bg-[#0a0f1a] border border-white/5 rounded-xl p-4 opacity-75">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <img src={SERVICES[1].icon} alt="WhatsApp" className="w-5 h-5 rounded-sm" />
                      <span className="text-sm font-medium text-white">WhatsApp</span>
                    </div>
                    <span className="text-xs text-slate-500">Completed</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-slate-400 font-mono">+44 7700 900077</span>
                    <div className="bg-[#131b2c] p-2 rounded text-xs font-mono text-emerald-400 border border-emerald-500/20">
                      WhatsApp code: 394-201
                    </div>
                  </div>
                </div>

                {/* Cancelled Rental */}
                <div className="bg-[#0a0f1a] border border-white/5 rounded-xl p-4 opacity-50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={SERVICES[2].icon} alt="Google" className="w-5 h-5 rounded-sm grayscale" />
                      <span className="text-sm font-medium text-white">Google</span>
                    </div>
                    <span className="text-xs text-slate-500">Refunded</span>
                  </div>
                  <span className="text-sm text-slate-500 font-mono line-through">+1 (555) 012-9932</span>
                </div>
              </div>
            </div>
            
            {/* Decorative background element for the mockup */}
            <div className="absolute inset-0 bg-sky-500/5 blur-[100px] rounded-full z-0 transform -translate-x-1/4"></div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-y border-white/5 bg-[#131b2c]/30">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5 border-x border-white/5">
          <div className="py-8 px-6 flex flex-col justify-center items-center text-center">
            <span className="text-3xl font-bold text-white mb-1">50+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Platforms</span>
          </div>
          <div className="py-8 px-6 flex flex-col justify-center items-center text-center">
            <span className="text-3xl font-bold text-white mb-1">10+</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Countries</span>
          </div>
          <div className="py-8 px-6 flex flex-col justify-center items-center text-center">
            <span className="text-3xl font-bold text-white mb-1">~<span className="text-sky-400">$0.10</span></span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Avg Price</span>
          </div>
          <div className="py-8 px-6 flex flex-col justify-center items-center text-center">
            <span className="text-3xl font-bold text-white mb-1">&lt;3s</span>
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Delivery</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Supported Platforms</h2>
            <p className="text-slate-400">We maintain high success rates across all major social media, messaging, and marketplace platforms.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center gap-3 group">
                <div className="w-16 h-16 rounded-2xl bg-[#131b2c] border border-white/5 flex items-center justify-center p-3 group-hover:border-sky-500/30 transition-colors">
                  <img src={service.icon} alt={service.name} className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs font-medium text-slate-400 group-hover:text-white transition-colors">{service.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section id="features" className="py-24 bg-[#0d131f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Built for precision.</h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                We've optimized every part of the verification flow to ensure you get your codes instantly and securely. No bloated features, just raw reliability.
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Real Non-VOIP Numbers</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Our numbers come from physical SIM cards, passing the strictest verification checks on platforms that block VOIP.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Instant Auto-Refunds</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">If you don't receive an SMS within the timeout period, your balance is automatically and instantly refunded.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Crypto Native Payments</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Top up anonymously using BTC, ETH, USDT, LTC, or DOGE. Balances are credited instantly upon network confirmation.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-sky-500/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Developer REST API</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">Integrate SMS verification into your own applications with our simple, well-documented REST API.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-[#131b2c] border border-white/5 rounded-2xl p-8 lg:p-12">
              {/* Abstract code representation */}
              <div className="font-mono text-xs md:text-sm text-slate-400 space-y-4">
                <div className="text-slate-500">// Request a new number for WhatsApp</div>
                <div>
                  <span className="text-sky-400">POST</span> <span className="text-emerald-400">/api/v1/rentals</span>
                </div>
                <div className="pl-4 border-l border-white/10">
                  <span className="text-slate-500">Headers:</span><br/>
                  <span className="text-amber-300">Authorization</span>: Bearer sk_live_...<br/>
                  <br/>
                  <span className="text-slate-500">Body:</span><br/>
                  {'{'}<br/>
                  &nbsp;&nbsp;<span className="text-purple-400">"service"</span>: <span className="text-emerald-300">"whatsapp"</span>,<br/>
                  &nbsp;&nbsp;<span className="text-purple-400">"country"</span>: <span className="text-emerald-300">"uk"</span><br/>
                  {'}'}
                </div>
                
                <div className="text-slate-500 mt-6">// Response: Success</div>
                <div className="pl-4 border-l border-white/10 text-emerald-400/80">
                  {'{'}<br/>
                  &nbsp;&nbsp;"id": "rnt_8932nf9",<br/>
                  &nbsp;&nbsp;"number": "+447700900077",<br/>
                  &nbsp;&nbsp;"status": "waiting_sms",<br/>
                  &nbsp;&nbsp;"expires_at": 1699920192<br/>
                  {'}'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-6 left-12 right-12 h-px bg-white/10 z-0"></div>
            
            <div className="relative z-10 bg-[#0a0f1a] pt-1 pr-6">
              <div className="w-12 h-12 rounded-full border-4 border-[#0a0f1a] bg-[#131b2c] flex items-center justify-center text-sky-400 font-bold mb-6">1</div>
              <h3 className="text-white font-medium text-lg mb-2">Fund Account</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Deposit funds using cryptocurrency. Minimum deposit is just $2.00, instantly credited to your balance.</p>
            </div>
            
            <div className="relative z-10 bg-[#0a0f1a] pt-1 pr-6">
              <div className="w-12 h-12 rounded-full border-4 border-[#0a0f1a] bg-[#131b2c] flex items-center justify-center text-sky-400 font-bold mb-6">2</div>
              <h3 className="text-white font-medium text-lg mb-2">Select Service</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Choose the platform you need to verify (Telegram, Google, etc.) and your preferred country for the number.</p>
            </div>
            
            <div className="relative z-10 bg-[#0a0f1a] pt-1 pr-6">
              <div className="w-12 h-12 rounded-full border-4 border-[#0a0f1a] bg-[#131b2c] flex items-center justify-center text-sky-400 font-bold mb-6">3</div>
              <h3 className="text-white font-medium text-lg mb-2">Receive SMS</h3>
              <p className="text-sm text-slate-400 leading-relaxed">Use the provided number on your chosen platform. The SMS code appears in your dashboard within seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Highlights */}
      <section id="pricing" className="py-24 bg-[#0d131f] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-medium mb-6">
            Pay as you go
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Simple, transparent pricing.</h2>
          <p className="text-slate-400 mb-12">No subscriptions. No hidden fees. Only pay for successful activations.</p>
          
          <div className="flex flex-col items-center justify-center mb-8">
            <span className="text-sm text-slate-500 uppercase tracking-wider font-medium mb-2">Starting at</span>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-bold text-white tracking-tighter">$0.10</span>
              <span className="text-slate-400 font-medium">/ SMS</span>
            </div>
          </div>
          
          <div className="flex justify-center mb-12">
            <a href="/register" className="bg-white hover:bg-slate-100 text-[#0a0f1a] px-8 py-3 rounded-full font-medium transition-colors">
              Create Free Account
            </a>
          </div>
          
          <div className="flex items-center justify-center gap-6 opacity-60">
            <div className="flex items-center gap-2 text-sm font-medium"><img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=029" alt="BTC" className="w-5 h-5 grayscale" /> BTC</div>
            <div className="flex items-center gap-2 text-sm font-medium"><img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=029" alt="ETH" className="w-5 h-5 grayscale" /> ETH</div>
            <div className="flex items-center gap-2 text-sm font-medium"><img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=029" alt="USDT" className="w-5 h-5 grayscale" /> USDT</div>
            <div className="flex items-center gap-2 text-sm font-medium"><img src="https://cryptologos.cc/logos/litecoin-ltc-logo.svg?v=029" alt="LTC" className="w-5 h-5 grayscale" /> LTC</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-10">Frequently Asked Questions</h2>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {ACCORDION_DATA.map((faq, index) => (
              <div key={index} className="py-6">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex items-center justify-between w-full text-left group"
                >
                  <span className="font-medium text-white group-hover:text-sky-400 transition-colors">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-sky-400 flex-shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 group-hover:text-sky-400 transition-colors flex-shrink-0 ml-4" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="mt-4 text-slate-400 text-sm leading-relaxed pr-8">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-sky-500 flex items-center justify-center">
              <MessageSquare className="w-3 h-3 text-[#0a0f1a] fill-current" />
            </div>
            <span className="text-white font-semibold text-sm tracking-tight">SKY SMS</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} SKY SMS Platform.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanPro;
