import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Code2,
  Globe2,
  LockKeyhole,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const services = [
  { name: "Telegram", domain: "telegram.org" },
  { name: "WhatsApp", domain: "whatsapp.com" },
  { name: "Google", domain: "google.com" },
  { name: "Instagram", domain: "instagram.com" },
  { name: "Discord", domain: "discord.com" },
  { name: "Amazon", domain: "amazon.com" },
  { name: "PayPal", domain: "paypal.com" },
  { name: "TikTok", domain: "tiktok.com" },
  { name: "Netflix", domain: "netflix.com" },
  { name: "LinkedIn", domain: "linkedin.com" },
];

const features = [
  {
    icon: Zap,
    title: "Numbers in seconds",
    desc: "Choose a service and country, then get a working number without waiting in a queue.",
  },
  {
    icon: MessageSquare,
    title: "A live SMS inbox",
    desc: "Watch your verification code arrive in real time. Copy it once and keep moving.",
  },
  {
    icon: Globe2,
    title: "Global availability",
    desc: "Compare live stock across 10+ countries before you spend a single cent.",
  },
  {
    icon: LockKeyhole,
    title: "Built for privacy",
    desc: "Crypto payments and isolated rental sessions keep your activity discreet.",
  },
  {
    icon: RefreshCw,
    title: "Fair by default",
    desc: "No SMS? Cancel the rental and your balance comes back automatically.",
  },
  {
    icon: Code2,
    title: "Automation ready",
    desc: "Use the REST API to create rentals, read codes, and cancel sessions.",
  },
];

const faqs = [
  [
    "How does renting a number work?",
    "Add credits, choose a service and country, then receive a temporary phone number instantly. SMS messages appear on your dashboard during the activation window.",
  ],
  [
    "Which services are supported?",
    "SKY SMS supports 50+ services including Telegram, WhatsApp, Google, Instagram, Facebook, Discord, Amazon and more. Availability is live.",
  ],
  [
    "What if my SMS never arrives?",
    "Cancel an active rental for an immediate refund. Rentals that expire without a message are refunded automatically.",
  ],
  [
    "Can I use the developer API?",
    "Yes. Generate an API key in Settings and use the REST API to list services, create rentals, poll messages and cancel numbers.",
  ],
];

function iconUrl(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function Logo() {
  return (
    <a href="/" className="landing-logo">
      <img src="/brand-logo.jpg" alt="SKY SMS" />
    </a>
  );
}

function PreviewCard() {
  return (
    <div className="signal-preview" aria-label="SKY SMS live inbox preview">
      <div className="preview-glow" />
      <div className="preview-window">
        <div className="preview-topbar">
          <span className="traffic">
            <i />
            <i />
            <i />
          </span>
          <span className="preview-label">LIVE INBOX</span>
          <span className="preview-dots">...</span>
        </div>
        <div className="preview-content">
          <div className="preview-heading">
            <div>
              <span className="eyebrow">ACTIVE RENTAL</span>
              <strong>Telegram</strong>
            </div>
            <span className="live-pill">
              <i /> LIVE
            </span>
          </div>
          <div className="number-tile">
            <span className="country-flag">US</span>
            <div>
              <span className="eyebrow">UNITED STATES</span>
              <strong>+1 (415) 555-0184</strong>
            </div>
            <button aria-label="Copy number">Copy</button>
          </div>
          <div className="code-message">
            <div className="message-icon">
              <MessageSquare />
            </div>
            <div>
              <span className="eyebrow">NEW MESSAGE - JUST NOW</span>
              <p>
                Your Telegram verification code is <b>482 917</b>
              </p>
            </div>
            <Check className="message-check" />
          </div>
          <div className="preview-footer">
            <span>
              <Clock3 /> Expires in 09:42
            </span>
            <span className="secure-note">
              <ShieldCheck /> Session isolated
            </span>
          </div>
        </div>
      </div>
      <div className="preview-chip chip-top">
        <span className="chip-dot" /> Code received
      </div>
      <div className="preview-chip chip-bottom">
        <Activity /> 2,418 numbers online
      </div>
    </div>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const goSignIn = () => setLocation("/sign-in");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-page green-dashboard-theme">
      <div className="landing-noise" aria-hidden />
      <header className={`landing-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="landing-container nav-inner">
          <Logo />
          <nav>
            <a href="#how-it-works">How it works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <button className="nav-signin" onClick={goSignIn}>
              Sign in
            </button>
            <button className="nav-cta" onClick={goSignIn}>
              Get a number <ArrowRight />
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-container hero-section">
          <div className="hero-copy">
            <Reveal variant="up">
              <div className="live-kicker">
                <span /> <b>LIVE NETWORK</b> 2,418 numbers ready now
              </div>
            </Reveal>
            <Reveal variant="up" delay={80}>
              <h1>
                Verification,
                <br />
                <em>without the wait.</em>
              </h1>
            </Reveal>
            <Reveal variant="up" delay={140}>
              <p className="hero-lede">
                Private phone numbers for the services you use every day.
                Receive your SMS code in seconds, pay only for what you need.
              </p>
            </Reveal>
            <Reveal variant="up" delay={200}>
              <div className="hero-actions">
                <button className="primary-cta" onClick={goSignIn}>
                  Start renting <ArrowRight />
                </button>
                <a className="text-link" href="#how-it-works">
                  See how it works <span>↓</span>
                </a>
              </div>
            </Reveal>
            <Reveal variant="up" delay={260}>
              <div className="trust-line">
                <ShieldCheck /> <span>Private sessions</span>
                <i /> <RefreshCw /> <span>Automatic refunds</span>
                <i /> <Zap /> <span>Under 3 seconds</span>
              </div>
            </Reveal>
          </div>
          <Reveal variant="scale" delay={160}>
            <PreviewCard />
          </Reveal>
        </section>

        <section className="service-band" id="how-it-works">
          <div className="landing-container">
            <div className="section-intro compact">
              <span className="section-tag">READY WHEN YOU ARE</span>
              <h2>
                One number. One code.
                <br />
                <span>Zero friction.</span>
              </h2>
            </div>
            <div className="steps">
              <div>
                <b>01</b>
                <strong>Pick a service</strong>
                <p>Find the app you need from 50+ supported platforms.</p>
              </div>
              <div>
                <b>02</b>
                <strong>Choose a country</strong>
                <p>See live stock and transparent pricing before checkout.</p>
              </div>
              <div>
                <b>03</b>
                <strong>Receive your code</strong>
                <p>Your private SMS inbox updates instantly when it arrives.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="platform-strip">
          <p>Works with the platforms you already use</p>
          <div className="platform-list">
            {services.map((service) => (
              <button key={service.name} onClick={goSignIn}>
                <img src={iconUrl(service.domain)} alt="" />
                {service.name}
              </button>
            ))}
          </div>
        </section>

        <section className="landing-container content-section" id="features">
          <div className="section-intro">
            <span className="section-tag">THE SKY SMS DIFFERENCE</span>
            <h2>
              Simple tools for
              <br />
              <span>temporary access.</span>
            </h2>
            <p>
              Everything is designed to get you from sign-in to verification
              with less noise and more control.
            </p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, title, desc }, index) => (
              <Reveal key={title} variant="up" delay={index * 45}>
                <article className="feature-tile">
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                  <span className="tile-number">0{index + 1}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="landing-container pricing-section" id="pricing">
          <div className="pricing-card">
            <div>
              <span className="section-tag">PAY AS YOU GO</span>
              <h2>
                Start small.
                <br />
                <span>Scale when ready.</span>
              </h2>
              <p>
                No subscriptions or setup fees. Add exactly what you need to
                your balance and keep unused credits until next time.
              </p>
            </div>
            <div className="price-lockup">
              <strong>$0.10</strong>
              <span>
                starting
                <br />
                per SMS
              </span>
              <button onClick={goSignIn}>
                Get started <ArrowRight />
              </button>
              <small>Minimum top-up $1 · Crypto payments via OxaPay</small>
            </div>
          </div>
        </section>

        <section className="landing-container faq-section" id="faq">
          <div className="section-intro">
            <span className="section-tag">NEED TO KNOW</span>
            <h2>
              Questions,
              <br />
              <span>answered.</span>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], index) => (
              <div
                className={`faq-row ${openFaq === index ? "open" : ""}`}
                key={q}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <strong>{q}</strong>
                  <ChevronDown />
                </button>
                <div className="faq-answer">
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-container final-cta">
          <div>
            <span className="section-tag">YOUR NEXT CODE IS CLOSER</span>
            <h2>
              Make verification
              <br />
              <span>the easy part.</span>
            </h2>
            <button className="primary-cta" onClick={goSignIn}>
              Rent your first number <ArrowRight />
            </button>
          </div>
          <div className="cta-orbit" aria-hidden>
            <span />
            <span />
            <span />
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container">
          <Logo />
          <div>
            <a href="/terms">Terms</a>
            <a href="/refund-policy">Refund policy</a>
            <a href="#faq">FAQ</a>
          </div>
          <span>© {new Date().getFullYear()} SKY SMS</span>
        </div>
      </footer>
    </div>
  );
}
