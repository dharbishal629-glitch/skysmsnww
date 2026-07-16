import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  LifeBuoy, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle,
  Loader2, Plus, X, Send, ChevronRight, Activity, CheckCheck,
  Info, ShieldAlert, Zap, Server
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

interface TicketMessage {
  id: string; senderRole: string; senderName: string;
  message: string; imageUrl: string | null; createdAt: string;
}
interface Ticket {
  id: string; subject: string; category: string; priority: string;
  message: string; status: string; adminReply: string | null;
  messages: TicketMessage[]; createdAt: string; updatedAt: string;
}

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

async function fetchTickets(): Promise<Ticket[]> {
  const res = await fetch(`${API_URL}/api/support/tickets`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load tickets");
  const data = await res.json() as { tickets: Ticket[] };
  return data.tickets;
}

async function createTicket(body: { subject: string; category: string; priority: string; message: string }): Promise<Ticket> {
  const res = await fetch(`${API_URL}/api/support/tickets`, {
    method: "POST", credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json() as { ticket?: Ticket; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Failed to submit ticket");
  return data.ticket!;
}

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  open:        { label: "Open",        cls: "text-[#4574FF] bg-blue-50 border-blue-200",       icon: Clock },
  in_progress: { label: "In Progress", cls: "text-violet-700 bg-violet-50 border-violet-200",  icon: AlertCircle },
  resolved:    { label: "Resolved",    cls: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  closed:      { label: "Closed",      cls: "text-slate-500 bg-slate-100 border-slate-200",    icon: XCircle },
};

function hasUnread(ticket: Ticket): boolean {
  const msgs = ticket.messages;
  if (!msgs?.length) return false;
  return msgs[msgs.length - 1].senderRole === "admin";
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const [, setLocation] = useLocation();
  const statusCfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open;
  const StatusIcon = statusCfg.icon;
  const unread = hasUnread(ticket);
  const lastMessage = ticket.messages?.[ticket.messages.length - 1];
  const isEnded = ticket.status === "resolved" || ticket.status === "closed";

  return (
    <button
      onClick={() => setLocation(`/support/conversation/${ticket.id}`)}
      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left group"
    >
      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
        unread ? "bg-[#4574FF]/10 border-[#4574FF]/20" : "bg-slate-100 border-slate-200"
      }`}>
        {isEnded ? (
          <XCircle className="h-4.5 w-4.5 text-slate-400" />
        ) : unread ? (
          <MessageSquare className="h-4.5 w-4.5 text-[#4574FF]" />
        ) : (
          <MessageSquare className="h-4.5 w-4.5 text-slate-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[13px] font-semibold truncate ${unread ? "text-slate-900" : "text-slate-700"}`}>
            {ticket.subject}
          </span>
          {unread && <span className="h-2 w-2 rounded-full bg-[#4574FF] shrink-0 animate-pulse" />}
        </div>
        <div className="text-[11px] text-slate-400 truncate">
          {lastMessage ? (
            <span className={lastMessage.senderRole === "admin" ? "text-[#4574FF]/70" : ""}>
              {lastMessage.senderRole === "admin" ? "Support: " : "You: "}
              {lastMessage.imageUrl && !lastMessage.message ? "📷 Image" : lastMessage.message.slice(0, 60)}
            </span>
          ) : ticket.message.slice(0, 60)}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${statusCfg.cls}`}>
          <StatusIcon className="h-2 w-2" />
          {statusCfg.label}
        </span>
        <span className="text-[10px] text-slate-400">
          {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
        </span>
      </div>

      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
    </button>
  );
}

/* ── System Activity Log ── */
const ACTIVITY_LOG = [
  {
    id: 1,
    type: "success",
    title: "All systems operational",
    description: "SMS delivery, number allocation, and payments are running normally.",
    time: "Just now",
    component: "All Services",
  },
  {
    id: 2,
    type: "info",
    title: "Number pool refresh completed",
    description: "Fresh virtual number inventory loaded for US, UK, and DE regions.",
    time: "12 minutes ago",
    component: "Number Pool",
  },
  {
    id: 3,
    type: "info",
    title: "Payment gateway check",
    description: "OxaPay gateway responding with normal latency (< 200ms).",
    time: "1 hour ago",
    component: "Payments",
  },
  {
    id: 4,
    type: "warning",
    title: "Elevated SMS delivery times",
    description: "Telegram verification codes from Russia region experiencing 15–30s delays. Auto-resolving.",
    time: "3 hours ago",
    component: "SMS Delivery",
  },
  {
    id: 5,
    type: "success",
    title: "Scheduled maintenance completed",
    description: "Database index optimization finished. Query performance improved by ~18%.",
    time: "Yesterday, 02:30 UTC",
    component: "Database",
  },
  {
    id: 6,
    type: "info",
    title: "API rate limit reset",
    description: "Per-minute rate limits reset for all API key holders as scheduled.",
    time: "Yesterday, 00:00 UTC",
    component: "API",
  },
];

const ACTIVITY_TYPE_CONFIG = {
  success: {
    icon: CheckCheck,
    iconCls: "text-emerald-600",
    bgCls: "bg-emerald-50 border-emerald-200",
    dotCls: "bg-emerald-500",
  },
  warning: {
    icon: ShieldAlert,
    iconCls: "text-amber-600",
    bgCls: "bg-amber-50 border-amber-200",
    dotCls: "bg-amber-500",
  },
  error: {
    icon: AlertCircle,
    iconCls: "text-red-600",
    bgCls: "bg-red-50 border-red-200",
    dotCls: "bg-red-500",
  },
  info: {
    icon: Info,
    iconCls: "text-[#4574FF]",
    bgCls: "bg-blue-50 border-blue-200",
    dotCls: "bg-[#4574FF]",
  },
};

function SystemActivityLog() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="h-8 w-8 rounded-xl bg-[#4574FF]/10 border border-[#4574FF]/15 flex items-center justify-center">
          <Activity className="h-4 w-4 text-[#4574FF]" />
        </div>
        <div>
          <div className="text-[13px] font-bold text-slate-900">System Activity Log</div>
          <div className="text-[11px] text-slate-400">Real-time platform status and events</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-700">Operational</span>
        </div>
      </div>

      {/* Status tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border-b border-slate-100">
        {[
          { icon: Server,        label: "API",      status: "Online",  color: "text-emerald-600" },
          { icon: Zap,           label: "Numbers",  status: "Online",  color: "text-emerald-600" },
          { icon: MessageSquare, label: "SMS",      status: "Online",  color: "text-emerald-600" },
          { icon: CheckCheck,    label: "Payments", status: "Online",  color: "text-emerald-600" },
        ].map(item => (
          <div key={item.label} className="bg-white px-4 py-3 flex items-center gap-2.5">
            <item.icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-slate-700">{item.label}</div>
              <div className={`text-[10px] font-bold ${item.color}`}>{item.status}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="divide-y divide-slate-100">
        {ACTIVITY_LOG.map((event, idx) => {
          const cfg = ACTIVITY_TYPE_CONFIG[event.type as keyof typeof ACTIVITY_TYPE_CONFIG];
          const Icon = cfg.icon;
          return (
            <div key={event.id} className="flex gap-4 px-5 py-4 hover:bg-slate-50/50 transition-colors">
              {/* Icon */}
              <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${cfg.bgCls}`}>
                <Icon className={`h-3.5 w-3.5 ${cfg.iconCls}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-semibold text-slate-800">{event.title}</span>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                    {event.component}
                  </span>
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed mt-0.5">{event.description}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">{event.time}</span>
              </div>

              {/* Dot indicator */}
              <div className="flex items-center shrink-0">
                <span className={`h-2 w-2 rounded-full ${cfg.dotCls} ${idx === 0 ? "animate-pulse" : "opacity-50"}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50">
        <p className="text-[11px] text-slate-400 text-center">
          Updated automatically · All times in UTC · <a href="#" className="text-[#4574FF] hover:underline">View full status page</a>
        </p>
      </div>
    </div>
  );
}

export default function Support() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"tickets" | "activity">("tickets");

  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: fetchTickets,
    refetchInterval: 10_000,
  });

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: (ticket) => {
      qc.invalidateQueries({ queryKey: ["support-tickets"] });
      setSubject(""); setMessage(""); setShowForm(false);
      setLocation(`/support/conversation/${ticket.id}`);
    },
    onError: (err: Error) => toast({ title: "Could not submit", description: err.message, variant: "destructive" }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    mutation.mutate({ subject, category: "Billing", priority: "medium", message });
  }

  const openCount = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;
  const unreadCount = tickets.filter(t => hasUnread(t)).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#4574FF] mb-1">Help Center</p>
          <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            {t("supportTitle")}
            {unreadCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#4574FF]/10 border border-[#4574FF]/20 text-[#4574FF]">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            {tickets.length === 0
              ? "Submit a ticket and we'll respond within 24 hours."
              : `${tickets.length} conversation${tickets.length !== 1 ? "s" : ""} · ${openCount} open`}
          </p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); if (activeTab !== "tickets") setActiveTab("tickets"); }}
          className={`shrink-0 flex items-center gap-2 h-10 px-4 rounded-xl text-[12px] font-bold transition-all active:scale-95 ${
            showForm
              ? "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800"
              : "bg-[#4574FF] text-white shadow-md hover:bg-[#3361e8]"
          }`}
        >
          {showForm ? <><X className="h-3.5 w-3.5" /> {t("cancel")}</> : <><Plus className="h-3.5 w-3.5" /> {t("newTicket")}</>}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
        {[
          { key: "tickets",  label: "Support Tickets", icon: MessageSquare },
          { key: "activity", label: "System Activity",  icon: Activity },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key as "tickets" | "activity"); setShowForm(false); }}
            className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg text-[12.5px] font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tickets Tab ── */}
      {activeTab === "tickets" && (
        <>
          {/* New Ticket Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="rounded-2xl border border-[#4574FF]/15 bg-blue-50/40 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-8 w-8 rounded-lg bg-[#4574FF]/10 border border-[#4574FF]/20 flex items-center justify-center">
                  <LifeBuoy className="h-4 w-4 text-[#4574FF]" />
                </div>
                <div>
                  <div className="text-[13px] font-bold text-slate-900">Open a support ticket</div>
                  <div className="text-[11px] text-slate-500">We'll get back to you within 24 hours.</div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t("ticketSubject")}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Balance not updated after payment"
                  maxLength={200}
                  required
                  className="w-full h-11 rounded-xl border border-slate-200 bg-white px-4 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#4574FF]/50 focus:ring-2 focus:ring-[#4574FF]/10 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t("ticketMessage")}</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail…"
                  rows={5}
                  maxLength={2000}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#4574FF]/50 focus:ring-2 focus:ring-[#4574FF]/10 transition-all resize-none leading-relaxed shadow-sm"
                />
                <div className="text-right text-[10px] text-slate-400">{message.length}/2000</div>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || !subject.trim() || !message.trim()}
                className="w-full h-11 rounded-xl text-[13px] font-bold text-white bg-[#4574FF] hover:bg-[#3361e8] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
              >
                {mutation.isPending
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
                  : <><Send className="h-4 w-4" /> {t("submitTicket")}</>
                }
              </button>
            </form>
          )}

          {/* Info Cards (empty state) */}
          {!showForm && tickets.length === 0 && !isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Clock,        title: "Response time",  desc: "We reply within 24 hours on business days." },
                { icon: MessageSquare,title: "Image support",  desc: "Attach screenshots to your messages for faster help." },
                { icon: CheckCircle2, title: "Refund policy",  desc: "Rental credits are refunded automatically if no SMS is received." },
              ].map(item => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="h-8 w-8 rounded-lg bg-[#4574FF]/8 border border-[#4574FF]/12 flex items-center justify-center mb-3">
                    <item.icon className="h-4 w-4 text-[#4574FF]" />
                  </div>
                  <div className="text-[12px] font-bold text-slate-800 mb-1">{item.title}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* Ticket list */}
          <div>
            {isLoading && (
              <div className="space-y-2">
                {[1, 2].map(i => (
                  <div key={i} className="h-20 rounded-2xl bg-slate-100 border border-slate-200 animate-pulse" />
                ))}
              </div>
            )}

            {!isLoading && tickets.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Your conversations ({tickets.length})
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {tickets.map(ticket => <TicketRow key={ticket.id} ticket={ticket} />)}
                </div>
              </div>
            )}

            {!isLoading && tickets.length === 0 && !showForm && (
              <div className="rounded-2xl border border-slate-200 bg-white py-14 flex flex-col items-center gap-4 text-center shadow-sm">
                <div className="h-14 w-14 rounded-2xl bg-[#4574FF]/8 border border-[#4574FF]/12 flex items-center justify-center">
                  <LifeBuoy className="h-6 w-6 text-[#4574FF]/60" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-800 mb-1">No support tickets yet</p>
                  <p className="text-[12px] text-slate-500">Open a ticket and our team will get back to you.</p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 h-10 px-5 rounded-xl text-[12px] font-bold text-white bg-[#4574FF] hover:bg-[#3361e8] transition-all shadow-md"
                >
                  <Plus className="h-3.5 w-3.5" /> Open first ticket
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── System Activity Tab ── */}
      {activeTab === "activity" && <SystemActivityLog />}
    </div>
  );
}
