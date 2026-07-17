import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import { lazy, Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/hooks/useTheme";

// Route-level code splitting — only Landing is eagerly loaded (above-fold critical path)
const Terms        = lazy(() => import("@/pages/Terms"));
const RefundPolicy = lazy(() => import("@/pages/RefundPolicy"));
const StatusPage   = lazy(() => import("@/pages/Status"));
const AppRoutes    = lazy(() => import("./Routes").then(m => ({ default: m.AppRoutes })));
import { Mail, Lock, Eye, EyeOff, User, ChevronLeft, Loader2, X, Shield } from "lucide-react";
import { SkySmsLogo, SkySmsLogoMark } from "@/components/SkySmsLogo";
import { CookieBanner } from "@/components/CookieBanner";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

const queryClient = new QueryClient();

function LoadingSpinner() {
  return (
    <div className="min-h-screen premium-shell flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="h-12 w-12 rounded-2xl bg-white/20 border border-white/40 flex items-center justify-center shadow-lg backdrop-blur-sm">
          <SkySmsLogoMark className="h-7 w-7" />
        </div>
        <div className="h-0.5 w-32 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-[#0a1628] rounded-full" style={{ width: "60%", animation: "loading-bar 1.4s ease-in-out infinite" }} />
        </div>
      </div>
    </div>
  );
}

type AuthMode = "choose" | "email-login" | "email-register" | "2fa";

function AuthPage() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const { isLoading, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<AuthMode>("choose");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [twoFaCode, setTwoFaCode] = useState("");
  const [twoFaSubmitting, setTwoFaSubmitting] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) {
    setLocation("/dashboard", { replace: true });
    return null;
  }

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "email-register") {
      if (!form.name.trim()) { setError("Please enter your full name."); return; }
      if (!form.email) { setError("Please enter your email."); return; }
      if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
      if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    } else {
      if (!form.email) { setError("Please enter your email."); return; }
      if (!form.password) { setError("Please enter your password."); return; }
    }

    setSubmitting(true);
    try {
      const endpoint = mode === "email-register" ? "/api/auth/register" : "/api/auth/login-email";
      const payload = mode === "email-register"
        ? { email: form.email.trim().toLowerCase(), password: form.password, name: form.name.trim() }
        : { email: form.email.trim().toLowerCase(), password: form.password };

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({})) as { error?: string; success?: boolean; requires2fa?: boolean };

      if (data.requires2fa) {
        setMode("2fa");
        setTwoFaCode("");
        return;
      }
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      queryClient.invalidateQueries();
      setLocation("/dashboard", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (twoFaCode.length !== 6) { setError("Enter the 6-digit code from your authenticator app."); return; }
    setTwoFaSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/2fa/verify`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: twoFaCode }),
      });
      const data = await res.json().catch(() => ({})) as { error?: string; success?: boolean };
      if (!res.ok) { setError(data.error || "Invalid code. Please try again."); return; }
      queryClient.invalidateQueries();
      setLocation("/dashboard", { replace: true });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setTwoFaSubmitting(false);
    }
  };

  const inputCls = "w-full h-11 rounded-xl border border-white/[0.14] bg-white/[0.06] text-[14px] text-slate-900 dark:text-white placeholder:text-slate-500 outline-none focus:border-[#4574FF]/60 focus:bg-white/[0.09] focus:ring-2 focus:ring-[#4574FF]/15 transition-all";

  return (
    <div className="min-h-screen premium-shell flex items-center justify-center px-5 py-10">
      {/* Ambient */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(69,116,255,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,196,200,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute inset-0 hero-grid opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md modal-content-enter">
        {/* Shimmer accent */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#4574FF]/50 to-transparent rounded-t-3xl" />

        <div className="rounded-3xl border border-white/[0.15] bg-white/[0.07] shadow-[0_0_0_1px_rgba(69,116,255,0.12),0_8px_60px_rgba(0,0,0,0.25)] p-8 backdrop-blur-xl">

          {/* ── Choose ── */}
          {mode === "choose" && (
            <>
              <div className="text-center mb-7">
                <h1 className="text-[1.75rem] font-black tracking-tight text-[#0a1628] leading-tight">Sign in to SKY SMS</h1>
                <p className="mt-2.5 text-[13.5px] text-[#0a1628]/60 max-w-xs mx-auto leading-relaxed">
                  Rent real phone numbers and receive SMS codes instantly.
                </p>
              </div>

              <div className="space-y-3">
                {/* Google */}
                <button
                  onClick={login}
                  className="group h-12 w-full rounded-xl bg-white px-6 text-[14px] font-bold text-slate-900 shadow-md transition-all hover:bg-slate-50 hover:shadow-lg flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-[#0a1628]/15" />
                  <span className="text-[11px] text-[#0a1628]/50 font-medium">or</span>
                  <div className="flex-1 h-px bg-[#0a1628]/15" />
                </div>

                {/* Email */}
                <button
                  onClick={() => setMode("email-login")}
                  className="h-12 w-full rounded-xl border border-[#0a1628]/15 bg-white/20 px-6 text-[14px] font-semibold text-[#0a1628] hover:bg-white/35 hover:border-[#0a1628]/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98] backdrop-blur-sm"
                >
                  <Mail className="h-4.5 w-4.5 shrink-0" />
                  Continue with email
                </button>

                <p className="text-center text-[12px] text-[#0a1628]/60 pt-1">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("email-register")} className="text-[#0a1628] hover:text-[#4574FF] font-bold transition-colors">
                    Create one
                  </button>
                </p>
              </div>
            </>
          )}

          {/* ── Email login ── */}
          {mode === "email-login" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => { setMode("choose"); setError(""); setForm({ name: "", email: "", password: "", confirmPassword: "" }); }}
                  className="h-8 w-8 flex items-center justify-center rounded-xl border border-[#0a1628]/15 bg-white/15 text-[#0a1628]/60 hover:text-[#0a1628] hover:bg-white/25 transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-[17px] font-bold text-[#0a1628] leading-none">Continue with email</h1>
                  <p className="text-[12px] text-[#0a1628]/55 mt-0.5">Enter your credentials to continue</p>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#0a1628]/60 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1628]/40" />
                    <input type="email" required placeholder="you@example.com" value={form.email} onChange={setField("email")}
                      className={`${inputCls} pl-10 pr-4`} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-[#0a1628]/60 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1628]/40" />
                    <input type={showPass ? "text" : "password"} required placeholder="Your password" value={form.password} onChange={setField("password")}
                      className={`${inputCls} pl-10 pr-11`} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a1628]/40 hover:text-[#0a1628]/70 transition-colors">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && <ErrorBanner message={error} />}

                <button type="submit" disabled={submitting}
                  className="h-12 w-full rounded-xl bg-[#0a1628] text-[14px] font-bold text-white hover:bg-[#162844] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Signing in…" : "Sign in"}
                </button>

                <p className="text-center text-[12px] text-[#0a1628]/55">
                  No account?{" "}
                  <button type="button" onClick={() => { setMode("email-register"); setError(""); }} className="text-[#0a1628] font-bold hover:text-[#4574FF] transition-colors">
                    Create one
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── Email register ── */}
          {mode === "email-register" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <button onClick={() => { setMode("choose"); setError(""); setForm({ name: "", email: "", password: "", confirmPassword: "" }); }}
                  className="h-8 w-8 flex items-center justify-center rounded-xl border border-[#0a1628]/15 bg-white/15 text-[#0a1628]/60 hover:text-[#0a1628] hover:bg-white/25 transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div>
                  <h1 className="text-[17px] font-bold text-[#0a1628] leading-none">Create an account</h1>
                  <p className="text-[12px] text-[#0a1628]/55 mt-0.5">Join SKY SMS in under a minute</p>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-3">
                {[
                  { label: "Full name", key: "name" as const, icon: User, type: "text", ph: "Your name", extra: "" },
                  { label: "Email address", key: "email" as const, icon: Mail, type: "email", ph: "you@example.com", extra: "" },
                ].map(({ label, key, icon: Icon, type, ph }) => (
                  <div key={key}>
                    <label className="block text-[12px] font-bold text-[#0a1628]/60 mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1628]/40" />
                      <input type={type} required placeholder={ph} value={form[key]} onChange={setField(key)}
                        className={`${inputCls} pl-10 pr-4`} />
                    </div>
                  </div>
                ))}
                {[
                  { label: "Password", key: "password" as const, show: showPass, toggle: () => setShowPass(v => !v), ph: "Min. 8 characters", min: 8 },
                  { label: "Confirm password", key: "confirmPassword" as const, show: showConfirmPass, toggle: () => setShowConfirmPass(v => !v), ph: "Repeat password", min: undefined },
                ].map(({ label, key, show, toggle, ph, min }) => (
                  <div key={key}>
                    <label className="block text-[12px] font-bold text-[#0a1628]/60 mb-1.5">{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0a1628]/40" />
                      <input type={show ? "text" : "password"} required minLength={min} placeholder={ph} value={form[key]} onChange={setField(key)}
                        className={`${inputCls} pl-10 pr-11`} />
                      <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0a1628]/40 hover:text-[#0a1628]/70 transition-colors">
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                ))}

                {error && <ErrorBanner message={error} />}

                <button type="submit" disabled={submitting}
                  className="h-12 w-full rounded-xl bg-[#0a1628] text-[14px] font-bold text-white hover:bg-[#162844] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 mt-1">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Creating account…" : "Create account"}
                </button>

                <p className="text-center text-[11.5px] text-[#0a1628]/50 leading-relaxed">
                  By creating an account you agree to our{" "}
                  <a href={`${basePath}/terms`} className="text-[#0a1628]/70 hover:text-[#4574FF] transition-colors font-medium">Terms</a>{" "}
                  and{" "}
                  <a href={`${basePath}/refund-policy`} className="text-[#0a1628]/70 hover:text-[#4574FF] transition-colors font-medium">Refund Policy</a>.
                </p>
                <p className="text-center text-[12px] text-[#0a1628]/55">
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("email-login"); setError(""); }} className="text-[#0a1628] font-bold hover:text-[#4574FF] transition-colors">
                    Sign in
                  </button>
                </p>
              </form>
            </>
          )}

          {/* ── 2FA verification ── */}
          {mode === "2fa" && (
            <>
              <div className="text-center mb-7">
                <div className="h-14 w-14 rounded-2xl bg-[#4574FF]/15 border border-[#4574FF]/30 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-[#0a1628]" />
                </div>
                <h1 className="text-[1.5rem] font-black tracking-tight text-[#0a1628] leading-tight">Two-Factor Auth</h1>
                <p className="mt-2 text-[13px] text-[#0a1628]/60 max-w-xs mx-auto leading-relaxed">
                  Open your authenticator app and enter the 6-digit code.
                </p>
              </div>

              <form onSubmit={handle2FA} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#0a1628]/60 mb-2 text-center">Verification code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={twoFaCode}
                    onChange={e => { setTwoFaCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                    placeholder="000000"
                    autoFocus
                    className="w-full h-14 rounded-xl border border-white/[0.14] bg-white/[0.06] text-center font-mono text-[28px] font-bold text-[#0a1628] tracking-[0.25em] outline-none focus:border-[#4574FF]/60 focus:ring-2 focus:ring-[#4574FF]/15 transition-all backdrop-blur-sm placeholder:text-[#0a1628]/25"
                  />
                </div>

                {error && <ErrorBanner message={error} />}

                <button type="submit" disabled={twoFaSubmitting || twoFaCode.length !== 6}
                  className="h-12 w-full rounded-xl bg-[#0a1628] text-[14px] font-bold text-white hover:bg-[#162844] transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-60">
                  {twoFaSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {twoFaSubmitting ? "Verifying…" : "Verify"}
                </button>

                <button type="button" onClick={() => { setMode("choose"); setError(""); setTwoFaCode(""); }}
                  className="w-full text-center text-[12px] text-[#0a1628]/50 hover:text-[#0a1628]/80 transition-colors">
                  ← Back to sign in
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-300/50 bg-red-100/60 px-3 py-2.5">
      <X className="h-3.5 w-3.5 text-red-600 shrink-0" />
      <span className="text-[12.5px] text-red-700 font-medium">{message}</span>
    </div>
  );
}

function HomeRedirect() {
  const { isLoading, isAuthenticated, login } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <Redirect to="/dashboard" />;
  return <Landing onLogin={login} />;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: "auto" }); }, [location]);
  return null;
}

function AppWithRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/" component={HomeRedirect} />
        <Route path="/sign-in/*?" component={AuthPage} />
        <Route path="/sign-up/*?" component={AuthPage} />
        <Route path="/terms" component={Terms} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/status" component={StatusPage} />

        <Route path="/dashboard" component={AppRoutes} />
        <Route path="/activity" component={AppRoutes} />
        <Route path="/rent" component={AppRoutes} />
        <Route path="/rentals" component={AppRoutes} />
        <Route path="/payments" component={AppRoutes} />
        <Route path="/checkout/:id" component={AppRoutes} />
        <Route path="/settings" component={AppRoutes} />
        <Route path="/support" component={AppRoutes} />
        <Route path="/support/conversation/:id" component={AppRoutes} />
        <Route path="/api-docs" component={AppRoutes} />
        <Route path="/referral" component={AppRoutes} />
        <Route path="/rankings" component={AppRoutes} />
        <Route path="/notifications" component={AppRoutes} />
        <Route path="/admin" component={AppRoutes} />
        <Route path="/admin/users/:id" component={AppRoutes} />
        <Route path="/admin/users" component={AppRoutes} />
        <Route path="/admin/services" component={AppRoutes} />
        <Route path="/admin/transactions" component={AppRoutes} />
        <Route path="/admin/support/conversation/:id" component={AppRoutes} />
        <Route path="/admin/support" component={AppRoutes} />
        <Route path="/admin/coupons" component={AppRoutes} />
        <Route path="/admin/notifications" component={AppRoutes} />
        <Route path="/admin/gateways" component={AppRoutes} />
        <Route path="/admin/status" component={AppRoutes} />

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <QueryClientProvider client={queryClient}>
            <ScrollToTop />
            <AppWithRoutes />
            <CookieBanner />
          </QueryClientProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
