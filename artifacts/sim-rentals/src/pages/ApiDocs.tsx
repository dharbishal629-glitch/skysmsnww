import { useState } from "react";
import { Copy, Check, BookOpen, Globe, ShoppingCart, History, User, AlertTriangle, ChevronRight, Terminal, Lock, Zap, Code2 } from "lucide-react";

const BASE = typeof window !== "undefined"
  ? `${window.location.protocol}//${window.location.host}/api`
  : "/api";

const NAV = [
  { id: "overview",  label: "Overview",    icon: BookOpen },
  { id: "services",  label: "Services",    icon: ShoppingCart },
  { id: "countries", label: "Countries",   icon: Globe },
  { id: "rentals",   label: "Rentals",     icon: History },
  { id: "account",   label: "Account",     icon: User },
  { id: "errors",    label: "Error Codes", icon: AlertTriangle },
];

const METHOD_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  GET:    { text: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
  POST:   { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  DELETE: { text: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  PATCH:  { text: "#d97706", bg: "#fffbeb", border: "#fde68a" },
};

function CopyBtn({ text, small }: { text: string; small?: boolean }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text.replace(/\$BASE_URL/g, BASE));
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }}
      className={`inline-flex items-center gap-1 rounded-lg border font-semibold transition-all ${
        small ? "text-[10px] px-2 py-1" : "text-[11px] px-2.5 py-1.5"
      } ${
        ok
          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
      }`}
    >
      {ok ? <Check size={10} /> : <Copy size={10} />}
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ label, children, copyText }: { label: string; children: React.ReactNode; copyText?: string }) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em]">{label}</span>
        {copyText !== undefined && <CopyBtn text={copyText} small />}
      </div>
      <div className="relative rounded-xl border border-slate-800 bg-[#0f172a] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#4574FF]/40 via-[#4574FF]/20 to-transparent" />
        <pre
          style={{
            padding: "14px 18px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontSize: ".8rem",
            lineHeight: 1.65,
            color: "#cbd5e1",
            whiteSpace: "pre",
            margin: 0,
          }}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

function MethodBadge({ m }: { m: "GET" | "POST" | "DELETE" | "PATCH" }) {
  const c = METHOD_COLORS[m];
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-[11px] font-black font-mono tracking-widest border flex-shrink-0"
      style={{ color: c.text, background: c.bg, borderColor: c.border }}
    >
      {m}
    </span>
  );
}

function Endpoint({ method, path, note, payload, response, curl }: {
  method: "GET" | "POST" | "DELETE" | "PATCH";
  path: string;
  note: string;
  payload?: string;
  response: string;
  curl: string;
}) {
  return (
    <div className="space-y-1">
      {/* Endpoint row */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 overflow-x-auto">
        <MethodBadge m={method} />
        <code className="text-[13px] font-mono text-[#4574FF] whitespace-nowrap">{path}</code>
      </div>
      <p className="text-[13px] text-slate-600 leading-relaxed px-1 py-1">{note}</p>

      {payload && (
        <CodeBlock label="Payload" copyText={payload}>{payload}</CodeBlock>
      )}
      <CodeBlock label="Response" copyText={response}>{response}</CodeBlock>
      <CodeBlock label="cURL" copyText={curl}>{curl}</CodeBlock>
    </div>
  );
}

const SECTIONS = [
  {
    id: "services", title: "Services",
    endpoints: [
      {
        method: "GET" as const,
        path: "/api/catalog/services",
        note: "Returns all available SMS services with pricing and categories.",
        response: JSON.stringify({ services: [{ code: "telegram", name: "Telegram", price: 0.15, category: "messaging" }] }, null, 2),
        curl: `curl "$BASE_URL/catalog/services" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
    ],
  },
  {
    id: "countries", title: "Countries",
    endpoints: [
      {
        method: "GET" as const,
        path: "/api/catalog/countries-for-service",
        note: "Returns available countries with live stock for a given service.",
        response: JSON.stringify({ countries: [{ code: "us", name: "United States", available: 4820, price: 0.15 }] }, null, 2),
        curl: `curl "$BASE_URL/catalog/countries-for-service?serviceCode=telegram" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
      {
        method: "GET" as const,
        path: "/api/catalog/availability",
        note: "Real-time availability and price for a service + country combination.",
        response: JSON.stringify({ available: 4820, price: 0.15, estimatedWait: "instant" }, null, 2),
        curl: `curl "$BASE_URL/catalog/availability?serviceCode=telegram&countryCode=us" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
    ],
  },
  {
    id: "rentals", title: "Rentals",
    endpoints: [
      {
        method: "POST" as const,
        path: "/api/rentals",
        note: "Create a rental. Deducts balance and allocates a phone number. Active for 20 minutes.",
        payload: JSON.stringify({ serviceCode: "telegram", countryCode: "us" }, null, 2),
        response: JSON.stringify({ id: "rnt_01J2K4P8", serviceName: "Telegram", phoneNumber: "14158675309", status: "active", price: 0.15, expiresAt: "2026-05-04T10:50:00Z" }, null, 2),
        curl: `curl -X POST "$BASE_URL/rentals" \\\n  -H "X-API-Key: YOUR_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '{"serviceCode":"telegram","countryCode":"us"}'`,
      },
      {
        method: "GET" as const,
        path: "/api/rentals",
        note: "List your rentals, paginated. Filter by status: active, expired, cancelled.",
        response: JSON.stringify({ rentals: [{ id: "rnt_01J2K4P8", serviceName: "Telegram", status: "active" }], total: 1 }, null, 2),
        curl: `curl "$BASE_URL/rentals?status=active&page=1" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
      {
        method: "GET" as const,
        path: "/api/rentals/:id",
        note: "Get a single rental with all received SMS messages.",
        response: JSON.stringify({ id: "rnt_01J2K4P8", status: "sms_received", messages: [{ body: "Your code: 481624", code: "481624" }] }, null, 2),
        curl: `curl "$BASE_URL/rentals/rnt_01J2K4P8" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
      {
        method: "POST" as const,
        path: "/api/rentals/:id/refresh",
        note: "Manually poll for new SMS messages on an active rental.",
        response: JSON.stringify({ id: "rnt_01J2K4P8", status: "active", messages: [] }, null, 2),
        curl: `curl -X POST "$BASE_URL/rentals/rnt_01J2K4P8/refresh" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
      {
        method: "POST" as const,
        path: "/api/rentals/:id/cancel",
        note: "Cancel an active rental. Full refund if cancelled within the free window.",
        response: JSON.stringify({ id: "rnt_01J2K4P8", status: "cancelled", refunded: true, refundAmount: 0.15 }, null, 2),
        curl: `curl -X POST "$BASE_URL/rentals/rnt_01J2K4P8/cancel" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
    ],
  },
  {
    id: "account", title: "Account",
    endpoints: [
      {
        method: "GET" as const,
        path: "/api/me",
        note: "Returns your account information, balance, and current role.",
        response: JSON.stringify({ id: "usr_01J2K4P8", name: "John Doe", email: "john@example.com", credits: 12.50, role: "user" }, null, 2),
        curl: `curl "$BASE_URL/me" \\\n  -H "X-API-Key: YOUR_KEY"`,
      },
    ],
  },
];

const ERROR_ROWS = [
  { code: "200", label: "OK",               type: "success", desc: "Request succeeded." },
  { code: "400", label: "Bad Request",      type: "warning", desc: "Missing or invalid parameters." },
  { code: "401", label: "Unauthorized",     type: "error",   desc: "Invalid or missing API key." },
  { code: "402", label: "Payment Required", type: "warning", desc: "Insufficient balance." },
  { code: "404", label: "Not Found",        type: "error",   desc: "Resource does not exist." },
  { code: "409", label: "Conflict",         type: "warning", desc: "No numbers available right now." },
  { code: "429", label: "Rate Limited",     type: "warning", desc: "60 requests per minute limit exceeded." },
  { code: "500", label: "Server Error",     type: "error",   desc: "Internal error — contact support." },
];

const TYPE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  success: { text: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  warning: { text: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  error:   { text: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

export default function ApiDocs() {
  const [active, setActive] = useState("overview");

  return (
    <div className="flex gap-0" style={{ minHeight: "calc(100vh - 56px)" }}>

      {/* Sidebar */}
      <aside className="hidden lg:flex w-52 flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-4 pt-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.18em] mb-3 px-2">
            Navigation
          </div>
          <nav className="space-y-0.5">
            {NAV.map(n => {
              const isActive = active === n.id;
              return (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setActive(n.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all ${
                    isActive
                      ? "bg-[#4574FF]/10 text-[#4574FF] border border-[#4574FF]/15"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <n.icon className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#4574FF]" : "text-slate-400"}`} />
                  {n.label}
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto" />}
                </a>
              );
            })}
          </nav>

          {/* Quick note */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rate Limit</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">60 requests / minute per API key.</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-6 space-y-6 overflow-x-hidden">

        {/* Overview */}
        <section id="overview">
          <div className="rounded-2xl border border-[#4574FF]/15 bg-gradient-to-br from-[#4574FF]/5 to-transparent overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(rgba(69,116,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(69,116,255,0.04) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
            <div className="relative p-7">
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-[#4574FF] flex items-center justify-center shadow-lg flex-shrink-0">
                  <Terminal className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#4574FF] uppercase tracking-[0.18em] mb-1">Public API · v1</div>
                  <h1 className="font-display text-[1.9rem] font-extrabold text-slate-900 leading-tight">SKY SMS API</h1>
                  <p className="text-[14px] text-slate-500 mt-1">Full REST API for renting numbers, polling SMS, and managing your account.</p>
                </div>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: Zap,      label: "Instant allocation" },
                  { icon: Code2,    label: "JSON responses" },
                  { icon: Lock,     label: "API key auth" },
                  { icon: Globe,    label: "REST endpoints" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm">
                    <Icon className="h-3 w-3 text-[#4574FF]" />
                    {label}
                  </div>
                ))}
              </div>

              {/* Auth box */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#4574FF]/10 border border-[#4574FF]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="h-4 w-4 text-[#4574FF]" />
                  </div>
                  <div className="text-[13px] text-slate-700 leading-relaxed">
                    <p className="mb-1">
                      <strong className="text-slate-900">Authentication:</strong> Every request requires an{" "}
                      <code className="bg-slate-100 text-[#4574FF] px-1.5 py-0.5 rounded text-[12px] font-mono">X-API-Key</code>{" "}
                      header. Generate yours in{" "}
                      <strong className="text-slate-900">Settings → API Keys</strong>.
                    </p>
                    <p>
                      <strong className="text-slate-900">Base URL:</strong>{" "}
                      <code className="bg-slate-100 text-[#4574FF] px-1.5 py-0.5 rounded text-[12px] font-mono">{BASE}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoint sections */}
        {SECTIONS.map(sec => (
          <section key={sec.id} id={sec.id}>
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#4574FF] to-[#00c4c8] flex-shrink-0" />
                <h2 className="font-display text-[15px] font-bold text-slate-900">{sec.title}</h2>
                <span className="ml-auto text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg px-2 py-0.5">
                  {sec.endpoints.length} endpoint{sec.endpoints.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {sec.endpoints.map((ep, i) => (
                  <div key={i} className="p-5">
                    <Endpoint {...ep} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Error Codes */}
        <section id="errors">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-[#4574FF] to-[#00c4c8] flex-shrink-0" />
              <h2 className="font-display text-[15px] font-bold text-slate-900">Error Codes</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {ERROR_ROWS.map((row) => {
                const c = TYPE_COLORS[row.type];
                return (
                  <div key={row.code} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
                    <span
                      className="font-mono font-black text-[12px] rounded-lg px-2.5 py-1 border flex-shrink-0 w-12 text-center"
                      style={{ color: c.text, background: c.bg, borderColor: c.border }}
                    >
                      {row.code}
                    </span>
                    <span className="text-[13px] font-semibold text-slate-700 w-36 flex-shrink-0">{row.label}</span>
                    <span className="text-[13px] text-slate-500">{row.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <style>{`
        @media (max-width: 900px) {
          .docs-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}
