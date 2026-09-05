import { useState } from "react";
import { Cookie } from "lucide-react";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem("cookie-consent") !== null; } catch { return false; }
  });

  if (dismissed) return null;

  const accept = () => { try { localStorage.setItem("cookie-consent", "accepted"); } catch {} setDismissed(true); };
  const decline = () => { try { localStorage.setItem("cookie-consent", "declined"); } catch {} setDismissed(true); };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full px-4 sm:px-0">
      <div className="rounded-2xl border border-slate-800/60 bg-[#0d1117] shadow-[0_8px_40px_rgba(0,0,0,0.7),0_0_0_1px_rgba(69,116,255,0.06)] overflow-hidden">
        <div className="inset-x-0 h-px bg-gradient-to-r from-transparent via-[#4574FF]/30 to-transparent" />
        <div className="p-4 flex gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#4574FF]/12 border border-[#4574FF]/20 flex items-center justify-center shrink-0 mt-0.5">
            <Cookie className="h-4 w-4 text-[#4574FF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-bold text-white mb-0.5">We use cookies</p>
            <p className="text-[11.5px] text-slate-400 leading-relaxed">
              We use essential cookies to keep you logged in and improve your experience. No tracking or advertising cookies.
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-slate-300 transition-colors text-lg leading-none mt-0.5 shrink-0">×</button>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={decline}
            className="flex-1 h-8 rounded-xl border border-slate-700 bg-transparent text-[12.5px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98]"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="flex-1 h-8 rounded-xl bg-[#4574FF] text-[12.5px] font-bold text-white hover:bg-[#3a68f5] transition-all active:scale-[0.98]"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
