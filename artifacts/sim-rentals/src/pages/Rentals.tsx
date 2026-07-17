import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useListRentals, useRefreshRental, useCancelRental, getGetDashboardQueryKey, getListRentalsQueryKey } from "@workspace/api-client-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getListRentalsQueryOptions } from "@workspace/api-client-react";
import { format, differenceInSeconds } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, X, MessageSquare, Clock, Copy, Check, Loader2, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function maskSender(sender: string): string {
  if (!sender) return sender;
  const lower = sender.toLowerCase();
  if (lower.includes("hero sms") || lower.includes("herosms")) return "SKY SMS";
  return sender;
}

const statusStyles: Record<string, { label: string; cls: string }> = {
  active:       { label: "Active",    cls: "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/40 bg-emerald-50 dark:bg-emerald-900/20" },
  completed:    { label: "Expired",   cls: "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40" },
  sms_received: { label: "SMS ✓",     cls: "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/40 bg-emerald-50 dark:bg-emerald-900/20" },
  cancelled:    { label: "Cancelled", cls: "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40" },
  expired:      { label: "Expired",   cls: "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40" },
};

function ActiveTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [progress, setProgress] = useState(100);
  const totalRef = useState(() => differenceInSeconds(new Date(expiresAt), new Date()))[0];

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, differenceInSeconds(new Date(expiresAt), new Date()));
      setTimeLeft(diff);
      setProgress(totalRef > 0 ? Math.min(100, (diff / totalRef) * 100) : 0);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [expiresAt, totalRef]);

  const color = timeLeft < 60 ? "red" : timeLeft < 120 ? "sky" : "emerald";
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;

  const colors = {
    red: {
      border: "border-red-200 dark:border-red-700/40",
      bg: "bg-red-50 dark:bg-red-900/20",
      icon: "text-red-500",
      text: "text-red-700 dark:text-red-400",
      bar: "bg-red-500",
      track: "bg-slate-200 dark:bg-slate-700",
    },
    sky: {
      border: "border-sky-200 dark:border-sky-700/40",
      bg: "bg-sky-50 dark:bg-sky-900/20",
      icon: "text-sky-500",
      text: "text-sky-700 dark:text-sky-400",
      bar: "bg-sky-500",
      track: "bg-slate-200 dark:bg-slate-700",
    },
    emerald: {
      border: "border-emerald-200 dark:border-emerald-700/40",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      icon: "text-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
      bar: "bg-emerald-500",
      track: "bg-slate-200 dark:bg-slate-700",
    },
  };
  const c = colors[color];

  return (
    <div className={`rounded-xl border overflow-hidden ${c.border} ${c.bg}`}>
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <Clock className={`h-3.5 w-3.5 ${c.icon}`} />
          <span className={`text-[12.5px] font-semibold ${c.text}`}>
            {timeLeft === 0 ? "Expired…" : "Expires in"}
          </span>
        </div>
        <span className={`font-mono text-[15px] font-bold tabular-nums ${c.text}`}>
          {m}:{s.toString().padStart(2, "0")}
        </span>
      </div>
      <div className={`h-1 w-full ${c.track}`}>
        <div
          className={`h-full transition-all duration-1000 ease-linear rounded-full ${c.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function ActiveRentalCard({ rental }: { rental: any }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const refreshMutation = useRefreshRental();
  const cancelMutation = useCancelRental();
  const [copied, setCopied] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const hasMessages = rental.messages && rental.messages.length > 0;

  const copy = (text: string, isCode = false) => {
    navigator.clipboard.writeText(text);
    if (isCode) { setCopiedCode(text); setTimeout(() => setCopiedCode(null), 2000); }
    else { setCopied(true); setTimeout(() => setCopied(false), 2000); }
    toast({ title: "Copied!", duration: 1500 });
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListRentalsQueryKey() });
    queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
      data-testid={`card-rental-${rental.id}`}
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05), 0 4px 16px rgba(16,185,129,0.06)" }}
    >
      {/* Top accent bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />

      <div className="p-4 space-y-3.5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="font-bold text-slate-900 dark:text-white text-[15px]">{rental.serviceName}</div>
            <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
              {rental.countryName} · {format(new Date(rental.createdAt), "MMM d, HH:mm")}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700/40 bg-emerald-50 dark:bg-emerald-900/20">Active</span>
            <div className="text-[12px] font-bold text-slate-900 dark:text-white mt-1">${rental.price.toFixed(2)}</div>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 px-3.5 py-3">
          <div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1">Your Number</div>
            {rental.phoneNumber ? (
              <div className="font-mono font-bold text-slate-900 dark:text-white text-[16px] tracking-wide" data-testid={`text-rental-number-${rental.id}`}>
                +{rental.phoneNumber}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[13px]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Allocating…
              </div>
            )}
          </div>
          {rental.phoneNumber && (
            <button
              onClick={() => copy(`+${rental.phoneNumber}`)}
              data-testid={`button-copy-number-${rental.id}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all ${
                copied
                  ? "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/40"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              }`}
            >
              {copied ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
            </button>
          )}
        </div>

        {/* Timer */}
        {rental.expiresAt && <ActiveTimer expiresAt={rental.expiresAt} />}

        {/* Messages */}
        {hasMessages ? (
          <div className="space-y-2">
            {rental.messages.map((msg: any) => (
              <div key={msg.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5" data-testid={`row-message-${msg.id}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{maskSender(msg.sender)}</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{format(new Date(msg.receivedAt), "HH:mm:ss")}</span>
                </div>
                <div className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">{msg.message}</div>
                {msg.code && (
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-0.5">Code</div>
                      <span className="font-mono font-bold text-[17px] text-emerald-700 dark:text-emerald-400 tracking-[0.2em]">{msg.code}</span>
                    </div>
                    <button
                      onClick={() => copy(msg.code, true)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all ${
                        copiedCode === msg.code
                          ? "bg-emerald-100 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/40"
                          : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {copiedCode === msg.code ? <><Check className="h-3 w-3" /> Copied</> : <><Copy className="h-3 w-3" /> Copy</>}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3.5 text-[12.5px] text-slate-500 dark:text-slate-400">
            <MessageSquare className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
            Waiting for incoming SMS…
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-0.5">
          <button
            onClick={() => cancelMutation.mutate({ id: rental.id }, {
              onSuccess: () => {
                invalidate();
                toast({ title: "Cancelled", description: "Refund applied if eligible." });
              }
            })}
            disabled={cancelMutation.isPending}
            data-testid={`button-cancel-rental-${rental.id}`}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-red-200 dark:border-red-700/40 bg-red-50 dark:bg-red-900/20 text-[12.5px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
          >
            {cancelMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
            Cancel
          </button>
          <button
            onClick={() => refreshMutation.mutate({ id: rental.id }, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getListRentalsQueryKey() });
                toast({ title: "Refreshed" });
              }
            })}
            disabled={refreshMutation.isPending}
            data-testid={`button-refresh-rental-${rental.id}`}
            className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12.5px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
            Refresh SMS
          </button>
        </div>
      </div>
    </div>
  );
}

function PastRentalRow({ rental }: { rental: any }) {
  const [expanded, setExpanded] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const hasMessages = rental.messages && rental.messages.length > 0;
  const hasCodes = rental.messages?.some((m: any) => m.code);
  const st = statusStyles[rental.status] ?? statusStyles.cancelled;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({ title: "Copied!", duration: 1500 });
  };

  return (
    <div className="border-b border-slate-100 dark:border-slate-700/60 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-left"
        data-testid={`card-rental-${rental.id}`}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200 text-[13.5px] truncate">{rental.serviceName}</span>
            {hasCodes && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
          </div>
          <div className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">
            {rental.countryName} · {format(new Date(rental.createdAt), "MMM d, yyyy · HH:mm")}
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="text-right">
            <div className="text-[13px] font-bold text-slate-900 dark:text-white">${rental.price.toFixed(2)}</div>
            <span className={`inline-flex items-center rounded-full border px-1.5 py-0 text-[10px] font-semibold ${st.cls}`}>
              {st.label}
            </span>
          </div>
          {expanded ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-3.5 space-y-3">
          {/* Phone number */}
          {rental.phoneNumber && (
            <div className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5">
              <div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Number</div>
                <div className="font-mono text-slate-900 dark:text-white text-[14px] font-semibold" data-testid={`text-rental-number-${rental.id}`}>+{rental.phoneNumber}</div>
              </div>
              <button
                onClick={() => copy(`+${rental.phoneNumber}`)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                <Copy className="h-3 w-3" /> Copy
              </button>
            </div>
          )}

          {/* SMS codes */}
          {hasCodes && (
            <div className="space-y-2">
              <div className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">SMS Codes Received</div>
              <div className="flex flex-wrap gap-2">
                {rental.messages.filter((m: any) => m.code).map((m: any) => (
                  <button
                    key={m.id}
                    onClick={() => copy(m.code)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-mono font-bold text-[14px] tracking-widest transition-all ${
                      copiedCode === m.code
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:border-emerald-200 dark:hover:border-emerald-700/40"
                    }`}
                  >
                    {m.code}
                    {copiedCode === m.code ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 opacity-40" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages (no code) */}
          {hasMessages && !hasCodes && (
            <div className="space-y-2">
              {rental.messages.map((msg: any) => (
                <div key={msg.id} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3" data-testid={`row-message-${msg.id}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10.5px] font-bold text-slate-500 dark:text-slate-400">{maskSender(msg.sender)}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{format(new Date(msg.receivedAt), "HH:mm")}</span>
                  </div>
                  <div className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed">{msg.message}</div>
                </div>
              ))}
            </div>
          )}

          {!hasMessages && (
            <div className="text-[12px] text-slate-400 dark:text-slate-500 text-center py-3 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
              No messages received during this rental.
            </div>
          )}

          {/* Rent Again */}
          <Link href={`/rent?service=${rental.serviceCode}&country=${rental.countryCode}`}>
            <button className="w-full h-8 rounded-xl bg-[#4574FF]/8 dark:bg-[#4574FF]/10 border border-[#4574FF]/20 text-[12px] font-semibold text-[#4574FF] hover:bg-[#4574FF]/15 transition-all flex items-center justify-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5" /> Rent Again
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Rentals() {
  const { data, isLoading, error } = useQuery({
    ...getListRentalsQueryOptions(),
    refetchInterval: 10_000,
  });

  if (isLoading) {
    return (
      <div className="space-y-4 max-w-lg mx-auto">
        <Skeleton className="h-6 w-32 bg-slate-200 dark:bg-slate-700" />
        <div className="space-y-3">
          {[1, 2].map(i => <Skeleton key={i} className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800" />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 mb-1">Could not load rentals</h2>
        <p className="text-slate-400 dark:text-slate-500 text-[13px]">Please refresh the page.</p>
      </div>
    );
  }

  const activeRentals = data.rentals.filter((r: any) => r.status === "active");
  const pastRentals = data.rentals.filter((r: any) => r.status !== "active");

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">
          My Rentals
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[13px]">
          {data.rentals.length === 0 ? "No rentals yet." : `${activeRentals.length} active · ${pastRentals.length} past`}
        </p>
      </div>

      {/* Active Rentals */}
      {activeRentals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">Active Now</span>
            <span className="text-[12px] text-slate-400 dark:text-slate-500">({activeRentals.length})</span>
          </div>
          {activeRentals.map((rental: any) => (
            <ActiveRentalCard key={rental.id} rental={rental} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {data.rentals.length === 0 && (
        <div
          className="flex flex-col items-center justify-center py-14 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
            <Inbox className="h-6 w-6 text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-[14px] mb-1">No rentals yet</h3>
          <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mb-5 max-w-[200px]">Rent a temporary number to receive SMS verification codes.</p>
          <Link href="/rent">
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#4574FF] px-4 py-2.5 text-[12.5px] font-bold text-white hover:bg-[#3361e8] transition-colors cursor-pointer shadow-sm">
              <ArrowRight className="h-3.5 w-3.5" /> Rent Now
            </span>
          </Link>
        </div>
      )}

      {/* Past Rentals */}
      {pastRentals.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[13px] font-bold text-slate-500 dark:text-slate-400">Past Rentals</span>
            <span className="text-[12px] text-slate-400 dark:text-slate-500">({pastRentals.length})</span>
          </div>
          <div
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
          >
            {pastRentals.map((rental: any) => (
              <PastRentalRow key={rental.id} rental={rental} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
