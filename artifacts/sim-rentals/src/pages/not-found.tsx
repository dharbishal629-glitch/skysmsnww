import { Link } from "wouter";
import { Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen premium-shell flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="mx-auto mb-6 h-16 w-16 rounded-2xl bg-[#4574FF]/10 border border-[#4574FF]/20 flex items-center justify-center">
          <Phone className="h-8 w-8 text-[#4574FF]/60" />
        </div>
        <h1 className="text-5xl font-black mb-3 text-[#0a1628]">Oops</h1>
        <p className="text-slate-600 text-sm mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#4574FF] px-6 py-3 text-sm font-bold text-white hover:bg-[#3a68f5] transition-colors cursor-pointer">
            ← Back to Home
          </span>
        </Link>
      </div>
    </div>
  );
}
