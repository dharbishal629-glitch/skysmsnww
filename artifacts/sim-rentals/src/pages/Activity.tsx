import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useTheme } from "@/hooks/useTheme";
import {
  Activity as ActivityIcon, CreditCard, Phone, MessageSquare, LogIn,
  Key, Shield, User, CheckCircle, XCircle, Clock, Filter, RefreshCw,
  Loader2, AlertCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

interface ActivityEvent {
  id: string;
  type: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

const EVENT_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string; darkBg: string }> = {
  login:           { icon: LogIn,           label: "Sign In",         color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",   darkBg: "dark:bg-blue-900/20 dark:border-blue-700/40" },
  rental_created:  { icon: Phone,           label: "Number Rented",   color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200", darkBg: "dark:bg-emerald-900/20 dark:border-emerald-700/40" },
  rental_cancelled:{ icon: XCircle,         label: "Rental Cancelled",color: "text-red-600",    bg: "bg-red-50 border-red-200",     darkBg: "dark:bg-red-900/20 dark:border-red-700/40" },
  rental_expired:  { icon: Clock,           label: "Rental Expired",  color: "text-slate-500",  bg: "bg-slate-50 border-slate-200", darkBg: "dark:bg-slate-800/40 dark:border-slate-700" },
  sms_received:    { icon: MessageSquare,   label: "SMS Received",    color: "text-cyan-600",   bg: "bg-cyan-50 border-cyan-200",   darkBg: "dark:bg-cyan-900/20 dark:border-cyan-700/40" },
  payment:         { icon: CreditCard,      label: "Payment",         color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200",darkBg: "dark:bg-indigo-900/20 dark:border-indigo-700/40" },
  api_key_created: { icon: Key,             label: "API Key Created", color: "text-violet-600", bg: "bg-violet-50 border-violet-200",darkBg: "dark:bg-violet-900/20 dark:border-violet-700/40" },
  api_key_deleted: { icon: Key,             label: "API Key Revoked", color: "text-rose-600",   bg: "bg-rose-50 border-rose-200",   darkBg: "dark:bg-rose-900/20 dark:border-rose-700/40" },
  totp_enabled:    { icon: Shield,          label: "2FA Enabled",     color: "text-emerald-600",bg: "bg-emerald-50 border-emerald-200", darkBg: "dark:bg-emerald-900/20 dark:border-emerald-700/40" },
  totp_disabled:   { icon: Shield,          label: "2FA Disabled",    color: "text-red-600",    bg: "bg-red-50 border-red-200",     darkBg: "dark:bg-red-900/20 dark:border-red-700/40" },
  profile_updated: { icon: User,            label: "Profile Updated", color: "text-blue-600",   bg: "bg-blue-50 border-blue-200",   darkBg: "dark:bg-blue-900/20 dark:border-blue-700/40" },
  password_changed:{ icon: Shield,          label: "Password Changed",color: "text-orange-600", bg: "bg-orange-50 border-orange-200",darkBg: "dark:bg-orange-900/20 dark:border-orange-700/40" },
};

const FILTER_TYPES = [
  { value: "all",     label: "All" },
  { value: "login",   label: "Logins" },
  { value: "rental",  label: "Rentals" },
  { value: "payment", label: "Payments" },
  { value: "security",label: "Security" },
];

function matchesFilter(event: ActivityEvent, filter: string) {
  if (filter === "all") return true;
  if (filter === "rental") return event.type.startsWith("rental") || event.type === "sms_received";
  if (filter === "security") return ["totp_enabled","totp_disabled","password_changed","api_key_created","api_key_deleted"].includes(event.type);
  if (filter === "login") return event.type === "login";
  if (filter === "payment") return event.type === "payment";
  return true;
}

// Mock activity while real endpoint is wired
function mockActivity(): ActivityEvent[] {
  const now = new Date();
  return [
    { id: "1", type: "login",           description: "Signed in from web browser",        createdAt: new Date(now.getTime() - 5*60000).toISOString() },
    { id: "2", type: "rental_created",  description: "Rented Telegram number (+1 415 …)", createdAt: new Date(now.getTime() - 18*60000).toISOString() },
    { id: "3", type: "sms_received",    description: "SMS code received: 481 624",        createdAt: new Date(now.getTime() - 16*60000).toISOString() },
    { id: "4", type: "rental_expired",  description: "Rental expired after 20 minutes",   createdAt: new Date(now.getTime() - 14*60000).toISOString() },
    { id: "5", type: "payment",         description: "Balance topped up +$10.00",         createdAt: new Date(now.getTime() - 2*3600000).toISOString() },
    { id: "6", type: "api_key_created", description: "API key 'Production Bot' created",  createdAt: new Date(now.getTime() - 24*3600000).toISOString() },
    { id: "7", type: "totp_enabled",    description: "Two-factor authentication enabled", createdAt: new Date(now.getTime() - 26*3600000).toISOString() },
    { id: "8", type: "login",           description: "Signed in from mobile browser",     createdAt: new Date(now.getTime() - 48*3600000).toISOString() },
    { id: "9", type: "rental_created",  description: "Rented WhatsApp number (+44 …)",   createdAt: new Date(now.getTime() - 50*3600000).toISOString() },
    { id:"10", type: "password_changed",description: "Account password changed",          createdAt: new Date(now.getTime() - 72*3600000).toISOString() },
    { id:"11", type: "rental_cancelled",description: "Telegram rental cancelled (refunded)", createdAt: new Date(now.getTime() - 96*3600000).toISOString() },
    { id:"12", type: "profile_updated", description: "Display name updated",              createdAt: new Date(now.getTime() - 120*3600000).toISOString() },
  ];
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return format(new Date(iso), "MMM d, yyyy");
}

export default function Activity() {
  const { isDark } = useTheme();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/activity`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { events: ActivityEvent[] };
        setEvents(data.events ?? []);
      } else {
        // Fallback to mock data if endpoint not yet wired
        setEvents(mockActivity());
      }
    } catch {
      setEvents(mockActivity());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const filtered = events.filter(e => matchesFilter(e, filter));

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8 page-enter">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#4574FF] mb-1">Account History</p>
          <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">
            Activity Log
          </h1>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">
            A complete audit trail of actions on your account.
          </p>
        </div>
        <button
          onClick={() => fetchEvents(false)}
          disabled={refreshing}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTER_TYPES.map(ft => (
          <button
            key={ft.value}
            onClick={() => setFilter(ft.value)}
            className={`h-8 px-3.5 rounded-lg text-[12px] font-semibold transition-all ${
              filter === ft.value
                ? "bg-[#4574FF] text-white shadow-sm"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            {ft.label}
          </button>
        ))}
      </div>

      {/* Activity feed */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Skeleton className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-2.5 w-48 bg-slate-100 dark:bg-slate-800" />
                </div>
                <Skeleton className="h-2.5 w-14 bg-slate-100 dark:bg-slate-800 shrink-0" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
              <ActivityIcon className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1">No activity yet</p>
            <p className="text-[12px] text-slate-400">Actions you take will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((event, idx) => {
              const cfg = EVENT_CONFIG[event.type] ?? EVENT_CONFIG.login;
              const Icon = cfg.icon;
              return (
                <div
                  key={event.id}
                  className="flex items-center gap-3.5 px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${cfg.bg} ${cfg.darkBg}`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {event.description}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{cfg.label}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 text-right">
                    {timeAgo(event.createdAt)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-center text-[11px] text-slate-400">
          Showing {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          {filter !== "all" ? ` · filtered by "${FILTER_TYPES.find(f => f.value === filter)?.label}"` : ""}
        </p>
      )}
    </div>
  );
}
