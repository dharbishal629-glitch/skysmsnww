import React, { useState } from 'react';
import { 
  Menu, X, ChevronRight, Zap, Globe, Bitcoin, 
  MessageSquare, RefreshCw, Code, CheckCircle2, 
  ChevronDown, Twitter, Github, Linkedin 
} from 'lucide-react';

const CosmicDark = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const services = [
    { name: 'Telegram', url: 'https://telegram.org' },
    { name: 'WhatsApp', url: 'https://whatsapp.com' },
    { name: 'Google', url: 'https://google.com' },
    { name: 'Instagram', url: 'https://instagram.com' },
    { name: 'Facebook', url: 'https://facebook.com' },
    { name: 'Discord', url: 'https://discord.com' },
    { name: 'Amazon', url: 'https://amazon.com' },
    { name: 'PayPal', url: 'https://paypal.com' },
    { name: 'TikTok', url: 'https://tiktok.com' },
    { name: 'X / Twitter', url: 'https://twitter.com' },
    { name: 'Netflix', url: 'https://netflix.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-violet-400" />,
      title: 'Lightning Fast Delivery',
      description: 'Receive your temporary number and SMS verification code in under 3 seconds.',
    },
    {
      icon: <Globe className="w-6 h-6 text-sky-400" />,
      title: 'Global Coverage',
      description: 'Access numbers from 10+ countries to bypass regional restrictions easily.',
    },
    {
      icon: <Bitcoin className="w-6 h-6 text-violet-400" />,
      title: 'Crypto Friendly',
      description: 'Pay securely and anonymously with BTC, ETH, USDT, LTC, and DOGE.',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-sky-400" />,
      title: 'Live SMS Inbox',
      description: 'Watch incoming messages appear in real-time on your personal dashboard.',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-violet-400" />,
      title: 'Auto-Refund System',
      description: 'If you don\'t receive your SMS within 5 minutes, your balance is automatically refunded.',
    },
    {
      icon: <Code className="w-6 h-6 text-sky-400" />,
      title: 'Developer API',
      description: 'Integrate our REST API into your automated workflows with extensive documentation.',
    },
  ];

  const faqs = [
    {
      question: 'How long does a temporary number last?',
      answer: 'Numbers are typically active for 15-20 minutes, which is more than enough time to receive your verification code. After that, the number is securely discarded.'
    },
    {
      question: 'What if I don\'t receive the SMS code?',
      answer: 'You only pay for successful verifications. If no SMS arrives within the timeout period (usually 5 minutes), your account is automatically refunded.'
    },
    {
      question: 'Can I reuse the same number later?',
      answer: 'No, for security and privacy reasons, all numbers are disposable and cannot be accessed again once your session expires.'
    },
    {
      question: 'Which cryptocurrencies do you accept?',
      answer: 'We currently accept Bitcoin (BTC), Ethereum (ETH), Tether (USDT), Litecoin (LTC), and Dogecoin (DOGE).'
    },
    {
      question: 'Is there a minimum deposit?',
      answer: 'Yes, the minimum deposit is $2.00 USD equivalent in your chosen cryptocurrency, which gives you enough balance for roughly 20 verifications.'
    }
  ];

  const getFavicon = (url: string) => {
    return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=128`;
  };

  return (
    <div className="min-h-screen bg-[#080c18] text-slate-200 font-sans selection:bg-violet-500/30">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50%)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(139, 92, 246, 0.15);
        }
        .glass-panel:hover {
          border-color: rgba(139, 92, 246, 0.3);
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
        }
      `}} />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 border-b border-violet-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-violet-500 fill-violet-500" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 tracking-tight">
                SKY SMS
              </span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Services</a>
              <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
              <button className="px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all duration-300">
                Sign In
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080c18]/95 backdrop-blur-xl pt-24 px-4 md:hidden">
          <div className="flex flex-col space-y-6 text-center">
            <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Services</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Features</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-slate-300">FAQ</a>
            <button className="mx-auto w-full max-w-xs px-6 py-3 rounded-full text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            ✦ Virtual numbers for SMS verification
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 leading-[1.1]">
            Verify any platform,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">instantly & anonymously.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
            Rent temporary phone numbers for WhatsApp, Telegram, Google, and 50+ other services. Pay with crypto, get verified in seconds, and maintain your privacy.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <button className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.6)] transition-all duration-300 flex items-center justify-center gap-2">
              Rent a Number <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:text-white backdrop-blur-md transition-all duration-300">
              How it works
            </button>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Accepted Cryptocurrencies</p>
            <div className="flex items-center gap-6 text-slate-400">
              {['BTC', 'ETH', 'USDT', 'LTC', 'DOGE'].map((crypto) => (
                <div key={crypto} className="flex items-center gap-2 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/50 text-sm font-medium">
                  {crypto}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Marquee */}
      <div id="services" className="py-10 border-y border-violet-500/10 bg-[#0c1222]/50 backdrop-blur-md overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#080c18] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#080c18] to-transparent z-10" />
        
        <div className="flex w-max animate-scroll">
          {[...services, ...services].map((service, idx) => (
            <div 
              key={`${service.name}-${idx}`} 
              className="flex items-center gap-3 px-6 py-3 mx-4 rounded-xl glass-panel whitespace-nowrap"
            >
              <img 
                src={getFavicon(service.url)} 
                alt={service.name} 
                className="w-6 h-6 rounded-md bg-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-medium text-slate-300">{service.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Engineered for speed & privacy</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Everything you need to bypass SMS verification hurdles securely.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="glass-panel p-8 rounded-2xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center mb-6 border border-slate-700 group-hover:border-violet-500/50 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-200 mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="py-24 bg-[#0a0f1d] border-y border-violet-500/10 relative overflow-hidden">
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-sky-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How it works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Get your verification code in three simple steps.</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { step: '1', title: 'Top up balance', desc: 'Deposit funds securely using your favorite cryptocurrency.' },
                { step: '2', title: 'Select service', desc: 'Choose the platform and country you need a number for.' },
                { step: '3', title: 'Receive SMS', desc: 'Get your temporary number and wait for the verification code in your live inbox.' }
              ].map((item, idx) => (
                <div key={idx} className="relative text-center">
                  <div className="w-24 h-24 mx-auto bg-[#080c18] rounded-full flex items-center justify-center border border-violet-500/30 mb-6 shadow-[0_0_30px_rgba(124,58,237,0.15)] relative z-10">
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-violet-400 to-sky-400">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm max-w-[250px] mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Highlight */}
      <div id="pricing" className="py-24 relative">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-3xl p-8 md:p-12 text-center overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-sky-500/20 blur-3xl rounded-full" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Pay as you go</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">No subscriptions. No hidden fees. Only pay for the verifications you successfully receive.</p>
            
            <div className="flex justify-center items-end gap-2 mb-10">
              <span className="text-slate-400 text-xl font-medium mb-2">Starting at</span>
              <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-sky-400">$0.10</span>
              <span className="text-slate-400 text-xl font-medium mb-2">/ SMS</span>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10 text-left">
              {[
                'Instant delivery',
                '10+ Countries available',
                '50+ Platforms supported',
                'Auto-refund for failed SMS',
                'Crypto payments accepted',
                'API access included'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-violet-400 shrink-0" />
                  <span className="text-slate-300">{benefit}</span>
                </div>
              ))}
            </div>
            
            <button className="px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300">
              Create an Account
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-24 bg-[#0a0f1d] border-t border-violet-500/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about SKY SMS.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-medium text-slate-200 pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-violet-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-400 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#050810] py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-violet-500 fill-violet-500" />
              <span className="text-lg font-bold text-white tracking-tight">SKY SMS</span>
            </div>
            
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-violet-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-violet-400 transition-colors">API Docs</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Support</a>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center text-slate-600 text-sm">
            © {new Date().getFullYear()} SKY SMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CosmicDark;
