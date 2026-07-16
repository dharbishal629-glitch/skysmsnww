import { useGetMe } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LogOut, FileText, RefreshCw, Shield,
  ExternalLink, Key, Plus, Trash2, Copy, Check, AlertTriangle,
  Gift, ChevronRight, Mail, User, Lock, Eye, EyeOff, Loader2,
  QrCode, X, Smartphone, Edit2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

interface ApiKey { id: string; name: string; prefix: string; lastUsedAt: string | null; createdAt: string; }

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

function SectionCard({ icon: Icon, title, subtitle, accent, children }: {
  icon: React.ElementType; title: string; subtitle?: string; accent?: string; children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border overflow-hidden shadow-sm ${accent ? "border-[#4574FF]/15 bg-[#4574FF]/2" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"}`}>
      <div className={`flex items-center gap-3 px-5 py-4 border-b ${accent ? "border-[#4574FF]/10" : "border-slate-100 dark:border-slate-700/80"}`}>
        <div className={`h-9 w-9 rounded-xl border flex items-center justify-center shrink-0 ${accent ? "bg-[#4574FF]/10 border-[#4574FF]/20" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"}`}>
          <Icon className={`h-4 w-4 ${accent ? "text-[#4574FF]" : "text-slate-500 dark:text-slate-400"}`} />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-slate-900 dark:text-white">{title}</div>
          {subtitle && <div className="text-[11px] text-slate-500 dark:text-slate-400">{subtitle}</div>}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function FieldInput({ label, icon: Icon, type = "text", value, onChange, placeholder, maxLength, readOnly, disabled, right }: {
  label: string; icon?: React.ElementType; type?: string; value: string; onChange?: (v: string) => void;
  placeholder?: string; maxLength?: number; readOnly?: boolean; disabled?: boolean; right?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />}
        <input
          type={type}
          value={value}
          onChange={onChange ? e => onChange(e.target.value) : undefined}
          placeholder={placeholder}
          maxLength={maxLength}
          readOnly={readOnly}
          disabled={disabled}
          className={`w-full h-11 rounded-xl border text-[13.5px] outline-none transition-all ${Icon ? "pl-10" : "pl-4"} ${right ? "pr-10" : "pr-4"} ${
            readOnly || disabled
              ? "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-default"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-[#4574FF]/50 focus:ring-2 focus:ring-[#4574FF]/10 placeholder:text-slate-400 dark:placeholder:text-slate-600"
          }`}
        />
        {right && <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  );
}

/* ─── Nickname / Profile section ─────────────────────────────────────────── */
function ProfileSection() {
  const { data: user, isLoading, refetch } = useGetMe();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user?.name) setName(user.name); }, [user?.name]);

  const save = async () => {
    if (!name.trim() || name.trim() === user?.name) { setEditing(false); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/account/profile`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      await refetch?.();
      setEditing(false);
      toast({ title: "Name updated" });
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="p-5">
        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-4 w-32 bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        ) : user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-slate-200 dark:border-slate-700 shrink-0">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="text-lg bg-[#4574FF]/10 text-[#4574FF] font-bold">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[16px] font-bold text-slate-900 dark:text-white truncate">{user.name}</span>
                  {user.role === "admin" && (
                    <span className="text-[9px] font-bold text-[#4574FF] border border-[#4574FF]/30 rounded-full px-2 py-0.5 uppercase">Admin</span>
                  )}
                </div>
                <p className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user.email}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[13px] font-bold text-slate-900 dark:text-white">${user.credits.toFixed(2)}</span>
                  <span className="text-[12px] text-slate-500 dark:text-slate-400">balance</span>
                  <Link href="/payments">
                    <span className="text-[12px] text-[#4574FF] hover:text-blue-700 transition-colors cursor-pointer font-medium flex items-center gap-0.5">
                      Add funds <ChevronRight className="h-3 w-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Nickname editor */}
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={64}
                  autoFocus
                  className="flex-1 h-10 px-3 rounded-xl border border-[#4574FF]/50 bg-white dark:bg-slate-800 text-[13.5px] text-slate-900 dark:text-white outline-none ring-2 ring-[#4574FF]/10 transition-all"
                  placeholder="Display name"
                  onKeyDown={e => { if (e.key === "Enter") save(); if (e.key === "Escape") { setEditing(false); setName(user.name || ""); } }}
                />
                <button onClick={save} disabled={saving} className="h-10 px-4 rounded-xl bg-[#4574FF] text-white text-[12.5px] font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-1.5">
                  {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  Save
                </button>
                <button onClick={() => { setEditing(false); setName(user.name || ""); }} className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-[12.5px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <Edit2 className="h-3.5 w-3.5" /> Change display name
              </button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/* ─── Password section ──────────────────────────────────────────────────── */
function PasswordSection() {
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    setErr("");
    if (!current || !next) { setErr("All fields required."); return; }
    if (next.length < 8) { setErr("New password must be at least 8 characters."); return; }
    if (next !== confirm) { setErr("New passwords do not match."); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/account/password`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setErr(data.error || "Failed"); return; }
      toast({ title: "Password changed", description: "Your new password is active." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch { setErr("Network error."); } finally { setSaving(false); }
  };

  return (
    <SectionCard icon={Lock} title="Change Password" subtitle="Update your sign-in password">
      <div className="space-y-3">
        <FieldInput label="Current password" icon={Lock} type={showCurrent ? "text" : "password"}
          value={current} onChange={setCurrent} placeholder="Current password"
          right={<button type="button" onClick={() => setShowCurrent(v => !v)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">{showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
        <FieldInput label="New password" icon={Lock} type={showNext ? "text" : "password"}
          value={next} onChange={setNext} placeholder="Min. 8 characters"
          right={<button type="button" onClick={() => setShowNext(v => !v)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">{showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>} />
        <FieldInput label="Confirm new password" icon={Lock} type="password"
          value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
        {err && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 px-3 py-2.5">
            <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
            <span className="text-[12.5px] text-red-600 dark:text-red-400">{err}</span>
          </div>
        )}
        <button onClick={save} disabled={saving} className="h-10 px-5 rounded-xl bg-[#4574FF] text-white text-[13px] font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
          {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {saving ? "Saving…" : "Update password"}
        </button>
      </div>
    </SectionCard>
  );
}

/* ─── 2FA section ─────────────────────────────────────────────────────────── */
function TwoFASection() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupData, setSetupData] = useState<{ secret: string; qrDataUrl: string } | null>(null);
  const [code, setCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [err, setErr] = useState("");

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/2fa/status`, { credentials: "include" });
      if (res.ok) { const data = await res.json() as { enabled: boolean }; setEnabled(data.enabled); }
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const startSetup = async () => {
    setErr("");
    try {
      const res = await fetch(`${API_URL}/api/2fa/setup`, { credentials: "include" });
      const data = await res.json() as { secret: string; qrDataUrl: string; error?: string };
      if (!res.ok) { setErr(data.error || "Failed"); return; }
      setSetupData(data);
      setCode("");
    } catch { setErr("Network error"); }
  };

  const verifySetup = async () => {
    setErr("");
    if (code.length !== 6) { setErr("Enter a 6-digit code"); return; }
    setVerifying(true);
    try {
      const res = await fetch(`${API_URL}/api/2fa/verify-setup`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) { setErr(data.error || "Invalid code"); return; }
      setEnabled(true);
      setSetupData(null);
      setCode("");
      toast({ title: "2FA enabled", description: "Your account is now protected." });
    } catch { setErr("Network error"); } finally { setVerifying(false); }
  };

  const disable2FA = async () => {
    setErr("");
    if (!disableCode) { setErr("Enter your current 2FA code"); return; }
    setVerifying(true);
    try {
      const res = await fetch(`${API_URL}/api/2fa/disable`, {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: disableCode }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) { setErr(data.error || "Invalid code"); return; }
      setEnabled(false);
      setShowDisable(false);
      setDisableCode("");
      toast({ title: "2FA disabled" });
    } catch { setErr("Network error"); } finally { setVerifying(false); }
  };

  if (loading) return (
    <SectionCard icon={Shield} title="Two-Factor Authentication">
      <Skeleton className="h-10 w-48 bg-slate-100 dark:bg-slate-800" />
    </SectionCard>
  );

  return (
    <SectionCard icon={Shield} title="Two-Factor Authentication" subtitle="Secure your account with Google Authenticator" accent>
      {enabled ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-800/50 flex items-center justify-center shrink-0">
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-[13px] font-bold text-emerald-800 dark:text-emerald-300">2FA is active</div>
              <div className="text-[11.5px] text-emerald-700 dark:text-emerald-400">Your account requires a code on every sign-in.</div>
            </div>
          </div>
          {!showDisable ? (
            <button onClick={() => { setShowDisable(true); setErr(""); }} className="text-[12.5px] text-red-500 hover:text-red-700 font-semibold transition-colors">
              Disable 2FA…
            </button>
          ) : (
            <div className="space-y-3 p-4 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10">
              <p className="text-[12.5px] text-red-700 dark:text-red-400 font-medium">Enter your current authenticator code to disable 2FA:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={disableCode}
                  onChange={e => { setDisableCode(e.target.value.replace(/\D/g, "")); setErr(""); }}
                  placeholder="000000"
                  className="w-32 h-10 rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-slate-800 text-center font-mono text-[16px] text-slate-900 dark:text-white tracking-widest outline-none focus:ring-2 focus:ring-red-400/30 transition-all"
                />
                <button onClick={disable2FA} disabled={verifying} className="h-10 px-4 rounded-xl bg-red-500 text-white text-[12.5px] font-bold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center gap-1.5">
                  {verifying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Confirm
                </button>
                <button onClick={() => { setShowDisable(false); setDisableCode(""); setErr(""); }} className="h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-[12.5px] text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all">
                  Cancel
                </button>
              </div>
              {err && <p className="text-[12px] text-red-600 dark:text-red-400">{err}</p>}
            </div>
          )}
        </div>
      ) : setupData ? (
        <div className="space-y-4">
          <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
            Scan this QR code with <strong>Google Authenticator</strong>, then enter the 6-digit code to confirm.
          </p>
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white shadow-sm inline-block">
              <img src={setupData.qrDataUrl} alt="2FA QR Code" className="w-48 h-48 rounded-lg" />
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-3">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Manual entry key</p>
            <code className="text-[12px] text-slate-700 dark:text-slate-300 font-mono tracking-widest break-all">{setupData.secret}</code>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification code</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, "")); setErr(""); }}
                placeholder="000000"
                className="w-32 h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono text-[18px] text-slate-900 dark:text-white tracking-widest outline-none focus:border-[#4574FF]/50 focus:ring-2 focus:ring-[#4574FF]/10 transition-all"
              />
              <button onClick={verifySetup} disabled={verifying || code.length !== 6} className="h-11 px-5 rounded-xl bg-[#4574FF] text-white text-[13px] font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
                {verifying && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Activate 2FA
              </button>
            </div>
            {err && <p className="text-[12px] text-red-600 dark:text-red-400">{err}</p>}
          </div>
          <button onClick={() => { setSetupData(null); setCode(""); setErr(""); }} className="text-[12px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            Cancel setup
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Add an extra layer of security. After enabling, you'll need your Google Authenticator app when signing in.
          </p>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <Smartphone className="h-5 w-5 text-[#4574FF] shrink-0" />
            <div className="text-[12px] text-slate-600 dark:text-slate-400">
              You'll need the <strong className="text-slate-800 dark:text-slate-200">Google Authenticator</strong> or compatible app (Authy, 1Password, etc.)
            </div>
          </div>
          <button onClick={startSetup} className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#4574FF] text-white text-[13px] font-bold hover:bg-blue-700 transition-all shadow-sm">
            <QrCode className="h-4 w-4" /> Enable 2FA
          </button>
          {err && <p className="text-[12px] text-red-600 dark:text-red-400">{err}</p>}
        </div>
      )}
    </SectionCard>
  );
}

/* ─── API Keys section ─────────────────────────────────────────────────────── */
function ApiKeysSection() {
  const { toast } = useToast();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [revealedKey, setRevealedKey] = useState<{ id: string; key: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/keys`, { credentials: "include" });
      const data = await res.json();
      setKeys(data.keys ?? []);
    } catch { toast({ title: "Failed to load API keys", variant: "destructive" }); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const createKey = async () => {
    const name = newName.trim();
    if (!name) return;
    setCreating(true);
    try {
      const res = await fetch(`${API_URL}/api/keys`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setRevealedKey({ id: data.id, key: data.key });
      setNewName(""); setShowForm(false);
      await fetchKeys();
      toast({ title: "API key created", description: "Save it now — it won't be shown again." });
    } catch (err) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "Try again.", variant: "destructive" });
    } finally { setCreating(false); }
  };

  const revokeKey = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/api/keys/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      setKeys(prev => prev.filter(k => k.id !== id));
      if (revealedKey?.id === id) setRevealedKey(null);
      toast({ title: "Key revoked" });
    } catch { toast({ title: "Failed to revoke key", variant: "destructive" }); }
    finally { setDeletingId(null); }
  };

  const atLimit = keys.length >= 3;

  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Key className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-slate-900 dark:text-white">API Keys</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">{keys.length}/3 keys</div>
          </div>
        </div>
        {!showForm && !atLimit && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[12px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shrink-0">
            <Plus className="h-3.5 w-3.5" /> New Key
          </button>
        )}
      </div>

      <div className="p-5 space-y-3">
        {revealedKey && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10.5px] font-bold text-[#4574FF] uppercase tracking-wider">Copy now — won't be shown again</span>
              <button onClick={async () => { await navigator.clipboard.writeText(revealedKey.key); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="bg-slate-900 dark:bg-slate-950 px-4 py-3.5 rounded-xl border border-slate-700 overflow-x-auto font-mono text-[12px] text-emerald-400 leading-relaxed whitespace-pre">
              {revealedKey.key}
            </pre>
            <button onClick={() => setRevealedKey(null)} className="mt-2 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">I've saved it — dismiss</button>
          </div>
        )}
        {showForm && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 space-y-3">
            <div className="text-[13px] font-semibold text-slate-900 dark:text-white">Name your key</div>
            <input type="text" placeholder="e.g. Production Bot, Testing Script" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && createKey()} maxLength={64} className="w-full h-10 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3.5 text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#4574FF]/50 transition-all" autoFocus />
            <div className="flex gap-2">
              <button onClick={createKey} disabled={creating || !newName.trim()} className="h-9 px-5 rounded-xl bg-[#4574FF] text-[13px] font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-40">{creating ? "Generating…" : "Generate"}</button>
              <button onClick={() => { setShowForm(false); setNewName(""); }} className="h-9 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        )}
        {loading ? (
          <div className="space-y-2">{[1,2].map(i => <Skeleton key={i} className="h-14 rounded-xl bg-slate-100 dark:bg-slate-800" />)}</div>
        ) : keys.length === 0 ? (
          <div className="text-center py-7">
            <Key className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2.5" />
            <p className="text-[13px] text-slate-500 dark:text-slate-400">No API keys yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {keys.map(k => (
              <div key={k.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-slate-100 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40">
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-900 dark:text-white">{k.name}</div>
                  <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                    <code className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{k.prefix}…</code>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{k.lastUsedAt ? `Used ${format(new Date(k.lastUsedAt), "MMM d, yyyy")}` : "Never used"}</span>
                  </div>
                </div>
                <button onClick={() => revokeKey(k.id)} disabled={deletingId === k.id} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shrink-0 disabled:opacity-40" title="Revoke key">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-3.5">
          <AlertTriangle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed">API keys grant full account access. Keep them secret.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── Danger Zone ─────────────────────────────────────────────────────────── */
function DangerZone() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const deleteAccount = async () => {
    if (confirm !== "DELETE") { toast({ title: 'Type "DELETE" to confirm', variant: "destructive" }); return; }
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/account`, {
        method: "DELETE", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation: "DELETE" }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { toast({ title: data.error || "Failed", variant: "destructive" }); return; }
      window.location.href = "/";
    } catch { toast({ title: "Network error", variant: "destructive" }); }
    finally { setDeleting(false); }
  };

  return (
    <section className="rounded-2xl border border-red-200 dark:border-red-800/40 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-red-100 dark:border-red-800/30">
        <div className="h-9 w-9 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-red-700 dark:text-red-400">Danger Zone</div>
          <div className="text-[11px] text-red-500/70 dark:text-red-500/60">Irreversible actions</div>
        </div>
      </div>
      <div className="p-5">
        {!open ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold text-slate-900 dark:text-white">Delete account</div>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">Permanently deletes your account, rentals, and balance. This cannot be undone.</p>
            </div>
            <button onClick={() => setOpen(true)} className="shrink-0 h-9 px-4 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/20 text-[12.5px] font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all">
              Delete account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
              This will <strong>permanently delete</strong> your account, balance, and all rental history. Type <strong className="text-red-600 dark:text-red-400">DELETE</strong> to confirm.
            </p>
            <input
              type="text"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-11 px-4 rounded-xl border border-red-300 dark:border-red-700 bg-white dark:bg-slate-800 text-[13.5px] text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-red-400/30 transition-all"
            />
            <div className="flex gap-2">
              <button onClick={deleteAccount} disabled={deleting || confirm !== "DELETE"} className="h-10 px-5 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 transition-all disabled:opacity-40 flex items-center gap-2">
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deleting ? "Deleting…" : "Delete my account"}
              </button>
              <button onClick={() => { setOpen(false); setConfirm(""); }} className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Main Settings page ─────────────────────────────────────────────────── */
export default function Settings() {
  const { logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-8">

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#4574FF] mb-1">Account</p>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Manage your account and preferences.</p>
      </div>

      <ProfileSection />
      <PasswordSection />
      <TwoFASection />
      <ApiKeysSection />

      {/* Referral */}
      <section className="rounded-2xl border border-[#4574FF]/15 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#4574FF]/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-[#4574FF]/20 bg-[#4574FF]/8 flex items-center justify-center shrink-0">
              <Gift className="h-4 w-4 text-[#4574FF]" />
            </div>
            <div>
              <div className="text-[14px] font-semibold text-slate-900 dark:text-white">Referral Program</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Earn $0.50 per referral</div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#4574FF] bg-[#4574FF]/10 border border-[#4574FF]/20 rounded-full px-2.5 py-0.5 shrink-0">$0.50</span>
        </div>
        <div className="px-5 py-4">
          <p className="text-[12.5px] text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            Invite friends and earn $0.50 credit for every person who signs up through your link.
          </p>
          <Link href="/referral">
            <span className="inline-flex items-center gap-2 h-9 px-4 rounded-xl border border-[#4574FF]/20 bg-[#4574FF]/8 text-[12.5px] font-semibold text-[#4574FF] hover:bg-[#4574FF]/15 transition-all cursor-pointer">
              View Referral Dashboard <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </section>

      {/* Legal */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-700/80">
          <div className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
            <Shield className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-slate-900 dark:text-white">Legal</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Policies & terms</div>
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700/80">
          {[{ href: "/terms", icon: FileText, label: "Terms of Service" }, { href: "/refund-policy", icon: RefreshCw, label: "Refund Policy" }].map(item => (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                <item.icon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                <span className="flex-1 text-[13px] font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{item.label}</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <DangerZone />

      {/* Sign out */}
      <div className="pb-2">
        <button onClick={logout} className="flex items-center gap-2 h-10 px-4 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 text-[13px] font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 transition-all" data-testid="button-settings-signout">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}
