import { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  AlertCircle,
  Shield,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ??
  "";

function resolveImageUrl(value: string) {
  return value.startsWith("http") || value.startsWith("data:")
    ? value
    : `${BASE}${value}`;
}

interface TicketMessage {
  id: string;
  senderRole: string;
  senderName: string;
  message: string;
  imageUrl: string | null;
  createdAt: string;
}

function compressImage(file: File, maxSizePx = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const scale = Math.min(
          1,
          maxSizePx / Math.max(image.width, image.height),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas
          .getContext("2d")
          ?.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      image.onerror = reject;
      image.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface AdminTicket {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  category: string;
  priority: string;
  message: string;
  status: string;
  adminReply: string | null;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  ticketNumber?: string | number;
  displayId?: string;
}

async function fetchAdminTicket(id: string): Promise<AdminTicket> {
  const res = await fetch(`${BASE}/api/admin/support`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to load");
  const data = (await res.json()) as { tickets: AdminTicket[] };
  const ticket = data.tickets.find((t) => t.id === id);
  if (!ticket) throw new Error("Ticket not found");
  return ticket;
}

async function updateTicket({
  id,
  status,
  adminReply,
}: {
  id: string;
  status?: string;
  adminReply?: string;
}) {
  const res = await fetch(`${BASE}/api/admin/support/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, adminReply }),
  });
  const data = (await res.json()) as { ticket?: AdminTicket; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Update failed");
  return data.ticket!;
}

const statusMap: Record<
  string,
  { label: string; cls: string; icon: React.ElementType; glow: string }
> = {
  open: {
    label: "Open",
    cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    icon: Clock,
    glow: "rgba(245,158,11,0.3)",
  },
  in_progress: {
    label: "In Progress",
    cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    icon: Clock,
    glow: "rgba(59,130,246,0.3)",
  },
  resolved: {
    label: "Resolved",
    cls: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    icon: CheckCircle2,
    glow: "rgba(16,185,129,0.3)",
  },
  closed: {
    label: "Closed",
    cls: "text-slate-500 border-white/10 bg-white/[0.03]",
    icon: XCircle,
    glow: "rgba(100,116,139,0.2)",
  },
};

const priorityCls: Record<string, string> = {
  low: "text-slate-500 border-white/10",
  normal: "text-emerald-400 border-emerald-500/20",
  high: "text-emerald-400 border-emerald-500/20",
  urgent: "text-red-400 border-red-500/20",
};

export default function AdminSupportConversation() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const portalPath = location.startsWith("/supportportal");
  const supportListPath = portalPath ? "/supportportal" : "/admin/support";
  const { toast } = useToast();
  const qc = useQueryClient();
  const [reply, setReply] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [newStatus, setNewStatus] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery<AdminTicket>({
    queryKey: ["admin-ticket", id],
    queryFn: () => fetchAdminTicket(id!),
    enabled: !!id,
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (ticket && newStatus === null) setNewStatus(ticket.status);
  }, [ticket, newStatus]);

  const allMessages = ticket
    ? [
        {
          id: "original",
          senderRole: "user",
          senderName: ticket.userName,
          message: ticket.message,
          imageUrl: null,
          createdAt: ticket.createdAt,
        },
        ...ticket.messages,
      ]
    : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages.length]);

  const mutation = useMutation({
    mutationFn: updateTicket,
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["admin-ticket", id] });
      qc.invalidateQueries({ queryKey: ["admin-tickets"] });
      setReply("");
      toast({ title: "Reply sent" });
    },
    onError: (err: any) =>
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      }),
  });

  const sendReply = () => {
    const text = reply.trim();
    if ((!text && !pendingImage) || !ticket || mutation.isPending) return;
    if (pendingImage) {
      void sendAttachment().catch((err: Error) =>
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        }),
      );
      return;
    }
    mutation.mutate({
      id: ticket.id,
      adminReply: text,
      status: newStatus ?? ticket.status,
    });
  };

  const sendAttachment = async () => {
    if (!ticket || !pendingImage) return;
    const res = await fetch(`${BASE}/api/admin/support/${ticket.id}/messages`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: reply.trim(), imageData: pendingImage }),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) throw new Error(data.error || "Failed to send attachment");
    if (newStatus && newStatus !== ticket.status) {
      await updateTicket({ id: ticket.id, status: newStatus });
    }
    setReply("");
    setPendingImage(null);
    qc.invalidateQueries({ queryKey: ["admin-ticket", id] });
    toast({ title: "Reply sent" });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 page-enter">
        <Skeleton className="h-9 w-24 rounded-xl bg-white/[0.04]" />
        <Skeleton className="h-32 w-full rounded-2xl bg-white/[0.03]" />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton
              key={i}
              className={`h-16 w-2/3 rounded-2xl bg-white/[0.04] ${i % 2 === 1 ? "ml-auto" : ""}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 page-enter">
        <button
           onClick={() => setLocation(supportListPath)}
          className="flex items-center gap-2 text-[13px] text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Support
        </button>
        <div className="rounded-2xl border border-white/[0.06] p-10 text-center">
          <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
          <p className="text-[13px] text-slate-400">Ticket not found.</p>
        </div>
      </div>
    );
  }

  const st = statusMap[ticket.status] ?? statusMap.open;
  const StIcon = st.icon;
  const statusNow = newStatus ?? ticket.status;
  const stNow = statusMap[statusNow] ?? statusMap.open;
  const StNow = stNow.icon;

  return (
    <div
      className="max-w-2xl mx-auto flex flex-col page-enter sky-page"
      data-sky-page="admin-support-conversation"
      style={{ height: "calc(100vh - 120px)", minHeight: 500 }}
    >
      {/* Back */}
      <button
         onClick={() => setLocation(supportListPath)}
        className="flex items-center gap-2 text-[12px] text-slate-500 hover:text-white transition-colors mb-4 self-start"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Support
      </button>

      {/* Ticket info card */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] overflow-hidden mb-4 shrink-0">
        <div className="h-px bg-emerald-500/30" />
        <div className="p-4 flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <User className="h-4.5 w-4.5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="text-[14px] font-bold text-white">
                {ticket.displayId || ticket.ticketNumber ? (
                  <span className="font-mono text-[10px] text-emerald-400 mr-2">
                    #{ticket.displayId ?? ticket.ticketNumber}
                  </span>
                ) : null}
                {ticket.subject}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${st.cls}`}
              >
                <StIcon className="h-2.5 w-2.5" /> {st.label}
              </span>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full border text-[10px] font-semibold capitalize ${priorityCls[ticket.priority] ?? ""}`}
              >
                {ticket.priority}
              </span>
            </div>
            <p className="text-[12px] text-slate-500">
              {ticket.userName} · {ticket.userEmail} ·{" "}
              <span className="capitalize">{ticket.category}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-white/[0.01] px-4 py-4 space-y-3 mb-4 min-h-0">
        {allMessages.map((msg) => {
          const isAdmin = msg.senderRole === "admin";
          return (
            <div
              key={msg.id}
              className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[78%] flex flex-col gap-1 ${isAdmin ? "items-end" : "items-start"}`}
              >
                {!isAdmin && (
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <div className="h-5 w-5 rounded-full bg-slate-700/60 border border-white/[0.06] flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">
                      {msg.senderName.charAt(0)}
                    </div>
                    <span className="text-[10.5px] text-slate-600">
                      {msg.senderName}
                    </span>
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[12.5px] leading-relaxed whitespace-pre-wrap ${
                    isAdmin
                      ? "text-white rounded-br-sm"
                      : "bg-white/[0.05] border border-white/[0.07] text-slate-200 rounded-bl-sm"
                  }`}
                  style={
                    isAdmin
                      ? {
                          background:
                            "linear-gradient(135deg, #10b981, #059669)",
                          boxShadow:
                            "0 4px 16px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
                        }
                      : {}
                  }
                >
                  {isAdmin && (
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Shield className="h-3 w-3 text-emerald-300/80" />
                      <span className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wide">
                        Admin
                      </span>
                    </div>
                  )}
                  {msg.imageUrl && (
                    <button
                      type="button"
                      className="support-attachment"
                      onClick={() =>
                        window.open(resolveImageUrl(msg.imageUrl!), "_blank")
                      }
                    >
                      <img
                        src={resolveImageUrl(msg.imageUrl)}
                        alt="User attachment"
                      />
                      <span>
                        <ImageIcon /> Open image
                      </span>
                    </button>
                  )}
                  {msg.message && <span>{msg.message}</span>}
                </div>
                <span className="text-[9.5px] text-slate-700 px-1">
                  {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply + status */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0d1117] p-4 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10.5px] font-bold text-slate-600 uppercase tracking-wider shrink-0">
            Status
          </span>
          <div className="flex gap-1.5 flex-1 flex-wrap">
            {Object.entries(statusMap).map(([key, s]) => {
              const SI = s.icon;
              const active = statusNow === key;
              return (
                <button
                  key={key}
                  onClick={() => setNewStatus(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10.5px] font-semibold transition-all ${active ? s.cls : "border-white/[0.07] text-slate-600 hover:text-slate-400 hover:border-white/[0.12]"}`}
                  style={active ? { boxShadow: `0 2px 8px ${s.glow}` } : {}}
                >
                  <SI className="h-2.5 w-2.5" /> {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 10 * 1024 * 1024) {
                toast({
                  title: "Image too large",
                  description: "Max 10MB",
                  variant: "destructive",
                });
                return;
              }
              try {
                setPendingImage(await compressImage(file));
              } catch {
                toast({
                  title: "Could not process image",
                  variant: "destructive",
                });
              }
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="h-12 w-12 self-end rounded-xl border border-white/[0.08] bg-white/[0.04] text-slate-500 hover:text-emerald-300 flex items-center justify-center"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          <textarea
            ref={textRef}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendReply();
              }
            }}
            placeholder="Type a reply… (Enter to send, Shift+Enter for newline)"
            rows={3}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-[12.5px] text-white placeholder:text-slate-700 outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/[0.06] resize-none transition-all"
          />
          <button
            onClick={sendReply}
            disabled={(!reply.trim() && !pendingImage) || mutation.isPending}
            className="w-12 self-end flex items-center justify-center rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0 aspect-square"
            style={{
              background: "linear-gradient(135deg, #10b981, #059669)",
              boxShadow: reply.trim()
                ? "0 4px 14px rgba(37,99,235,0.5), inset 0 1px 0 rgba(255,255,255,0.15)"
                : "none",
              height: "48px",
            }}
          >
            {mutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        {pendingImage && (
          <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-300">
            <img
              src={pendingImage}
              alt="Pending attachment"
              className="h-12 w-12 rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={() => setPendingImage(null)}
              className="text-slate-500 hover:text-white"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={sendAttachment}
              className="ml-auto text-emerald-300 font-semibold"
            >
              Send image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
