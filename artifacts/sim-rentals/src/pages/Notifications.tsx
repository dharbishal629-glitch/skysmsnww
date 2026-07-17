import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Info, Check, AlertCircle, Settings, ArrowLeft, CheckCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "lucide-react";
import { format } from "date-fns";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

function typeIcon(type: string) {
  if (type === "success") return <Check className="h-4 w-4 text-emerald-500" />;
  if (type === "warning") return <AlertCircle className="h-4 w-4 text-orange-400" />;
  return <Info className="h-4 w-4 text-[#4574FF]" />;
}

function typeBg(type: string, read: boolean) {
  if (read) return "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
  if (type === "success") return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40";
  if (type === "warning") return "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/40";
  return "bg-[#4574FF]/10 border-[#4574FF]/25 dark:bg-[#4574FF]/15 dark:border-[#4574FF]/30";
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`;
  return format(new Date(d), "MMM d, yyyy");
}

function ThemeButton() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="relative h-9 w-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 overflow-hidden"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="absolute transition-all duration-300 ease-in-out"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.4)" }}
      >
        <Moon className="h-4 w-4" />
      </span>
      <span
        className="absolute transition-all duration-300 ease-in-out"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.4)" : "rotate(0deg) scale(1)" }}
      >
        <Sun className="h-4 w-4" />
      </span>
    </button>
  );
}

export default function Notifications() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/notifications`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { notifications: Notification[] };
        setNotifications(data.notifications ?? []);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/notifications/${id}/read`, { method: "POST", credentials: "include" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    if (unread === 0 || markingAll) return;
    setMarkingAll(true);
    try {
      await fetch(`${API_URL}/api/notifications/read-all`, { method: "POST", credentials: "include" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ } finally {
      setMarkingAll(false);
    }
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) await markRead(n.id);
    if (n.link) setLocation(n.link);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0f1e] flex flex-col">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0a0f1e]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">

          {/* Back + Logo */}
          <button
            onClick={() => window.history.back()}
            className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shrink-0"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <Link href="/dashboard">
            <span className="flex items-center gap-2 cursor-pointer select-none">
              <div className="h-7 w-7 rounded-lg bg-[#0a1628] dark:bg-[#4574FF]/20 dark:border dark:border-[#4574FF]/40 flex items-center justify-center shadow-md shrink-0">
                <span className="text-white font-black text-[12px] tracking-tighter">S</span>
              </div>
              <span className="font-display text-[15px] font-extrabold tracking-tight text-[#0a1628] dark:text-white">
                SKY<span className="text-[#4574FF] ml-0.5">SMS</span>
              </span>
            </span>
          </Link>

          <div className="flex-1" />

          {/* Toolbar */}
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#4574FF] hover:bg-[#4574FF]/8 dark:hover:bg-[#4574FF]/15 transition-all disabled:opacity-50"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <Link href="/settings">
              <span
                className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </span>
            </Link>
            <ThemeButton />
          </div>
        </div>
      </header>

      {/* ── Page title ──────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#4574FF] mb-1">Inbox</p>
            <h1 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">Notifications</h1>
          </div>
          {!loading && notifications.length > 0 && (
            <span className="text-[12px] text-slate-400 dark:text-slate-500 pb-0.5">
              {unread > 0 ? `${unread} unread` : "All read"}
            </span>
          )}
        </div>
      </div>

      {/* ── List ────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-10 flex-1">
        {loading ? (
          <div className="space-y-3 pt-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Skeleton className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                  <Skeleton className="h-3.5 w-36 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-2.5 w-64 bg-slate-100 dark:bg-slate-800" />
                  <Skeleton className="h-2 w-20 bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <Bell className="h-7 w-7 text-slate-300 dark:text-slate-600" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-300">No notifications yet</p>
              <p className="text-[13px] text-slate-400 dark:text-slate-500 mt-1">We'll notify you about activity on your account.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 pt-3">
            {notifications.map(n => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className={`w-full text-left flex gap-3.5 p-4 rounded-2xl border transition-all hover:shadow-sm active:scale-[0.99] ${
                  n.read
                    ? "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    : "border-[#4574FF]/20 bg-[#4574FF]/[0.04] dark:bg-[#4574FF]/10 hover:bg-[#4574FF]/[0.07] dark:hover:bg-[#4574FF]/[0.15]"
                }`}
              >
                {/* Icon */}
                <div className={`h-10 w-10 shrink-0 rounded-xl border flex items-center justify-center mt-0.5 ${typeBg(n.type, n.read)}`}>
                  {typeIcon(n.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[13.5px] font-semibold leading-snug ${n.read ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                      {n.title}
                    </span>
                    <div className="flex items-center gap-2 shrink-0 mt-0.5">
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#4574FF]" />
                      )}
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                        {timeAgo(n.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className={`text-[12.5px] leading-relaxed mt-0.5 ${n.read ? "text-slate-500 dark:text-slate-400" : "text-slate-600 dark:text-slate-300"}`}>
                    {n.message}
                  </p>
                  {n.link && (
                    <span className="inline-block mt-1.5 text-[11px] font-semibold text-[#4574FF]">
                      View →
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
