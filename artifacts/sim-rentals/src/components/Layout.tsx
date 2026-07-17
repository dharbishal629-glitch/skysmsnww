import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useGetMe } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunityLinks } from "@/hooks/useCommunityLinks";
import {
  LayoutDashboard, Phone, History, CreditCard, Settings, Shield, Users,
  Activity, SlidersHorizontal, LogOut, Menu, X, LifeBuoy, Tag, Bell,
  Check, Code2, Bitcoin, Search, Plus, ChevronDown,
  Sun, Moon, Trophy, Info, AlertCircle, CheckCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchPalette } from "@/components/SearchPalette";
import { useLanguage, LANGUAGES, type LangCode } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { SkySmsLogoMark } from "@/components/SkySmsLogo";
import { format } from "date-fns";

const BASE = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

const mainNavItems = [
  { href: "/dashboard", labelKey: "dashboard",   icon: LayoutDashboard },
  { href: "/activity",  labelKey: "activity",    icon: Activity },
  { href: "/rent",      labelKey: "rentNumber",   icon: Phone },
  { href: "/rentals",   labelKey: "myRentals",    icon: History },
  { href: "/payments",  labelKey: "plansBilling", icon: CreditCard },
  { href: "/rankings",  labelKey: null,           icon: Trophy,   label: "Rankings" },
  { href: "/referral",  labelKey: "referrals",    icon: Tag },
  { href: "/api-docs",  labelKey: "apiDocs",      icon: Code2 },
];

const bottomNavItems = [
  { href: "/settings", labelKey: "settings", icon: Settings },
  { href: "/support",  labelKey: "support",  icon: LifeBuoy, badge: true },
];

const adminItems = [
  { href: "/admin",                 labelKey: "admin",  icon: Shield,           label: "Overview"     },
  { href: "/admin/services",        labelKey: null,     icon: SlidersHorizontal,label: "Services"     },
  { href: "/admin/transactions",    labelKey: null,     icon: Activity,         label: "Transactions" },
  { href: "/admin/users",           labelKey: null,     icon: Users,            label: "Users"        },
  { href: "/admin/coupons",         labelKey: null,     icon: Tag,              label: "Coupons"      },
  { href: "/admin/notifications",   labelKey: null,     icon: Bell,             label: "Announcements"},
  { href: "/admin/support",         labelKey: null,     icon: LifeBuoy,         label: "Support"      },
  { href: "/admin/gateways",        labelKey: null,     icon: Bitcoin,          label: "Gateways"     },
  { href: "/admin/status",          labelKey: null,     icon: Activity,         label: "Status Page"  },
];

interface Notification {
  id: number; title: string; message: string; type: string;
  link: string | null; read: boolean; createdAt: string;
}

function typeIcon(type: string) {
  if (type === "success") return <Check className="h-3.5 w-3.5 text-emerald-500" />;
  if (type === "warning") return <AlertCircle className="h-3.5 w-3.5 text-sky-400" />;
  return <Info className="h-3.5 w-3.5 text-[#4574FF]" />;
}

function typeBg(type: string, read: boolean) {
  if (read) return "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
  if (type === "success") return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40";
  if (type === "warning") return "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700/40";
  return "bg-[#4574FF]/10 border-[#4574FF]/25 dark:bg-[#4574FF]/15 dark:border-[#4574FF]/30";
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d`;
  return format(new Date(d), "MMM d");
}

// ── Notification slide-out panel ─────────────────────────────────────────
function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [, setLocation] = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter(n => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!open) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/notifications`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json() as { notifications: Notification[] };
        setNotifications(data.notifications ?? []);
      }
    } catch { /* silent */ } finally {
      setLoading(false);
    }
  }, [open]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => document.addEventListener("mousedown", h), 100);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", h); };
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);

  const markRead = async (id: number) => {
    try {
      await fetch(`${BASE}/api/notifications/${id}/read`, { method: "POST", credentials: "include" });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    if (unread === 0 || markingAll) return;
    setMarkingAll(true);
    try {
      await fetch(`${BASE}/api/notifications/read-all`, { method: "POST", credentials: "include" });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ } finally { setMarkingAll(false); }
  };

  const handleClick = async (n: Notification) => {
    if (!n.read) await markRead(n.id);
    if (n.link) { setLocation(n.link); onClose(); }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[60] bg-black/30 dark:bg-black/50 backdrop-blur-[2px]" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 z-[70] w-full max-w-[360px] flex flex-col bg-white dark:bg-[#0d1117] border-l border-slate-200 dark:border-slate-800 shadow-2xl"
        style={{ animation: "slide-in-right 0.22s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            <span className="font-bold text-[14px] text-slate-800 dark:text-white">Notifications</span>
            {unread > 0 && (
              <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#4574FF] text-[10px] font-bold text-white flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="flex items-center gap-1 h-7 px-2 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-[#4574FF] hover:bg-[#4574FF]/8 transition-all disabled:opacity-50"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">All read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-3 space-y-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <Skeleton className="h-8 w-8 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-32 bg-slate-100 dark:bg-slate-800" />
                    <Skeleton className="h-2.5 w-48 bg-slate-100 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-6">
              <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                <Bell className="h-5 w-5 text-slate-300 dark:text-slate-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-300">No notifications yet</p>
                <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">We'll notify you about account activity.</p>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-1.5">
              {notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full text-left flex gap-3 p-3 rounded-xl border transition-all hover:shadow-sm active:scale-[0.99] ${
                    n.read
                      ? "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      : "border-[#4574FF]/20 bg-[#4574FF]/[0.03] dark:bg-[#4574FF]/10 hover:bg-[#4574FF]/[0.06]"
                  }`}
                >
                  <div className={`h-8 w-8 shrink-0 rounded-lg border flex items-center justify-center mt-0.5 ${typeBg(n.type, n.read)}`}>
                    {typeIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-[12.5px] font-semibold leading-snug ${n.read ? "text-slate-600 dark:text-slate-300" : "text-slate-900 dark:text-white"}`}>
                        {n.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-[#4574FF]" />}
                        <span className="text-[10.5px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                    <p className={`text-[11.5px] leading-relaxed mt-0.5 ${n.read ? "text-slate-400 dark:text-slate-500" : "text-slate-500 dark:text-slate-400"}`}>
                      {n.message}
                    </p>
                    {n.link && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-[#4574FF]">View →</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Notification Bell button ──────────────────────────────────────────────
function NotificationBell({ onOpen }: { onOpen: () => void }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch(`${BASE}/api/notifications`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json() as { notifications: Notification[] };
          setUnreadCount((data.notifications ?? []).filter(n => !n.read).length);
        }
      } catch { /* silent */ }
    };
    fetchCount();
    const i = setInterval(fetchCount, 60_000);
    return () => clearInterval(i);
  }, []);

  return (
    <button
      onClick={onOpen}
      className="relative h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 cursor-pointer"
      title="Notifications"
    >
      <Bell className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#4574FF] text-[9px] font-bold text-white flex items-center justify-center leading-none">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="relative h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 overflow-hidden"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="absolute transition-all duration-300 ease-in-out" style={{ opacity: isDark ? 1 : 0, transform: isDark ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.4)" }}>
        <Moon className="h-4 w-4" />
      </span>
      <span className="absolute transition-all duration-300 ease-in-out" style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.4)" : "rotate(0deg) scale(1)" }}>
        <Sun className="h-4 w-4" />
      </span>
    </button>
  );
}

function LanguageDropdown() {
  const { lang, setLang, current } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    if (open) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[12px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors"
      >
        <span className="text-base leading-none" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))", transform: "perspective(80px) rotateX(8deg)", display: "inline-block" }}>
          {current.flag}
        </span>
        <span className="flex-1 text-left">{current.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 right-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl z-50 overflow-hidden py-1">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as LangCode); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] transition-colors ${lang === l.code ? "text-[#4574FF] bg-blue-50 dark:bg-blue-900/20" : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
              <span className="text-base leading-none">{l.flag}</span>
              <span className="flex-1 text-left font-medium">{l.label}</span>
              <span className="text-[10.5px] text-slate-400 dark:text-slate-500">{l.nativeName}</span>
              {lang === l.code && <Check className="h-3 w-3 text-[#4574FF] shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ href, label, icon: Icon, active, onClick, badge }: {
  href: string; label: string; icon: React.ElementType; active: boolean; onClick?: () => void; badge?: boolean;
}) {
  return (
    <Link href={href}>
      <span
        onClick={onClick}
        className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer select-none ${
          active
            ? "bg-[#4574FF]/10 dark:bg-[#4574FF]/15 text-[#4574FF] shadow-sm"
            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Icon className={`h-[15px] w-[15px] shrink-0 transition-colors ${active ? "text-[#4574FF]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
        <span className="flex-1 leading-none">{label}</span>
        {badge && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-full px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
            Online
          </span>
        )}
      </span>
    </Link>
  );
}

function SidebarContent({ onNav, onSearch, onBell }: { onNav?: () => void; onSearch?: () => void; onBell?: () => void }) {
  const [location] = useLocation();
  const { data: user, isLoading } = useGetMe();
  const { logout } = useAuth();
  const { discord, telegram } = useCommunityLinks();
  const { t } = useLanguage();
  const hasCommunity = discord || telegram;
  const isAdmin = user?.role === "admin";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">

      {/* Logo */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between shrink-0 border-b border-slate-100 dark:border-slate-800">
        <Link href="/dashboard">
          <span className="flex items-center gap-2.5 cursor-pointer" onClick={onNav}>
            <SkySmsLogoMark className="h-8 w-8 shrink-0" />
            <span className="font-display text-[16px] font-extrabold tracking-tight text-[#0a1628] dark:text-white">
              SKY<span className="text-[#4574FF] ml-1">SMS</span>
            </span>
          </span>
        </Link>
        {!onNav && (
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationBell onOpen={onBell ?? (() => {})} />
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="px-3 pt-3 mb-2 shrink-0">
        <button
          onClick={onSearch}
          className="w-full flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150 cursor-pointer"
        >
          <Search className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="text-[12px] flex-1 text-left text-slate-400 dark:text-slate-500">{t("search")}</span>
          <kbd className="hidden sm:flex h-5 items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 text-[9px] font-mono text-slate-400 dark:text-slate-500">⌘K</kbd>
        </button>
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-3 pb-1 space-y-0.5 min-h-0 pt-1">
        {mainNavItems.map(item => {
          const active = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href + "/"));
          const label = item.labelKey ? t(item.labelKey) : (item as { label?: string }).label ?? item.href;
          return <NavItem key={item.href} href={item.href} label={label} icon={item.icon} active={active} onClick={onNav} />;
        })}

        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="mb-1.5 px-3 text-[9.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.22em]">{t("admin")}</div>
            {adminItems.map(item => {
              const active = location === item.href || (item.href !== "/admin" && location.startsWith(item.href + "/"));
              return <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={active} onClick={onNav} />;
            })}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="px-3 pt-2 pb-1 border-t border-slate-100 dark:border-slate-800 space-y-0.5 shrink-0">
        {bottomNavItems.map(item => {
          const active = location === item.href;
          return <NavItem key={item.href} href={item.href} label={t(item.labelKey)} icon={item.icon} active={active} onClick={onNav} badge={item.badge} />;
        })}
      </div>

      {/* Community links */}
      {hasCommunity && (
        <div className="px-3 pb-2 flex gap-2 shrink-0">
          {discord && (
            <a href={discord} target="_blank" rel="noopener noreferrer" onClick={onNav}
              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-indigo-200 dark:border-indigo-800/50 bg-indigo-50 dark:bg-indigo-900/20 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all duration-150">
              <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.01.043.025.06a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              Discord
            </a>
          )}
          {telegram && (
            <a href={telegram} target="_blank" rel="noopener noreferrer" onClick={onNav}
              className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-900/20 text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/40 transition-all duration-150">
              <svg className="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </a>
          )}
        </div>
      )}

      {/* Language */}
      <div className="px-3 pb-2 shrink-0">
        <LanguageDropdown />
      </div>

      {/* Add funds button */}
      <div className="px-3 pb-3 shrink-0">
        <Link href="/payments">
          <span
            onClick={onNav}
            className="flex items-center gap-2 w-full h-11 px-4 rounded-xl bg-[#4574FF]/10 hover:bg-[#4574FF]/18 border border-[#4574FF]/20 text-[13px] font-bold text-[#4574FF] transition-all cursor-pointer"
            data-testid="link-buy-credits"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span className="flex-1">{t("addFunds")}</span>
            {isLoading ? (
              <Skeleton className="h-4 w-12 bg-slate-200 dark:bg-slate-700" />
            ) : (
              <span className="text-slate-500 dark:text-slate-400 font-semibold" data-testid="text-user-credits">
                ${(user?.credits ?? 0).toFixed(2)}
              </span>
            )}
          </span>
        </Link>
      </div>

      {/* User profile */}
      <div className="px-3 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3 shrink-0">
        {isLoading ? (
          <div className="flex items-center gap-3 px-1">
            <Skeleton className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-3 w-20 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-2.5 w-28 bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ) : user ? (
          <div className="flex items-center gap-2.5 px-1">
            <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700 shrink-0">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-[11px] font-bold bg-[#4574FF]/10 text-[#4574FF]">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-semibold text-slate-800 dark:text-white truncate" data-testid="text-username">{user.name}</div>
              <div className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate">{user.email}</div>
            </div>
            <button
              onClick={logout}
              className="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
              data-testid="button-signout"
              title={t("signOut")}
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { data: user } = useGetMe();

  const openSidebar = () => { setClosing(false); setMobileOpen(true); };
  const closeSidebar = () => { setClosing(true); setTimeout(() => { setMobileOpen(false); setClosing(false); }, 260); };

  useEffect(() => { document.body.style.overflow = mobileOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [mobileOpen]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); } };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="app-shell min-h-screen flex">
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] flex-col fixed inset-y-0 left-0 z-30 border-r border-slate-200 dark:border-slate-800 shadow-sm">
        <SidebarContent onSearch={() => setSearchOpen(true)} onBell={() => setNotifOpen(true)} />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className={`absolute inset-0 bg-slate-900/30 dark:bg-slate-900/60 backdrop-blur-sm ${closing ? "overlay-fade-out" : "overlay-fade-in"}`} onClick={closeSidebar} />
          <aside className={`relative z-50 w-[260px] flex flex-col h-full border-r border-slate-200 dark:border-slate-800 shadow-2xl ${closing ? "sidebar-slide-out" : "sidebar-slide-in"}`}>
            <button onClick={closeSidebar} className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 z-10">
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNav={closeSidebar} onSearch={() => { closeSidebar(); setSearchOpen(true); }} onBell={() => { closeSidebar(); setNotifOpen(true); }} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col md:pl-[240px] page-grid bg-[#f7f9ff] dark:bg-[#080c18]">

        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <button
            onClick={openSidebar}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-150 active:scale-95 shrink-0"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-7 w-7 rounded-lg bg-[#0a1628] dark:bg-[#4574FF]/20 flex items-center justify-center">
              <span className="text-white font-black text-[11px] tracking-tighter">S</span>
            </div>
            <span className="font-display text-[15px] font-extrabold tracking-tight text-[#0a1628] dark:text-white">
              SKY<span className="text-[#4574FF] ml-0.5">SMS</span>
            </span>
          </div>
          <div className="flex items-center gap-1 ml-auto">
            {user && <span className="text-[13px] font-bold text-[#0a1628] dark:text-white">${user.credits.toFixed(2)}</span>}
            <ThemeToggle />
            <NotificationBell onOpen={() => setNotifOpen(true)} />
          </div>
        </header>

        <main className="flex-1 min-w-0 p-5 md:p-8 w-full max-w-screen-xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
