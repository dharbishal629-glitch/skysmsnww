import { useGetMe } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Lock, CheckCircle2, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ?? "";

interface MonthlyDepositsData {
  monthlyTotal: number;
  allTimeTotal: number;
}

function useMonthlyDeposits() {
  return useQuery<MonthlyDepositsData>({
    queryKey: ["/api/account/monthly-deposits"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/account/monthly-deposits`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    staleTime: 60_000,
  });
}

const TIERS = [
  {
    level: 1,
    label: "Level 1",
    sublabel: "Standard",
    minDeposit: 0,
    discount: 0,
    color: "#64748b",
    accentColor: "#64748b",
    borderClass: "border-slate-200 dark:border-slate-700",
    bgClass: "bg-slate-50 dark:bg-slate-800/50",
    textClass: "text-slate-600 dark:text-slate-300",
    description: "Base access with standard pricing on all numbers.",
  },
  {
    level: 2,
    label: "Level 2",
    sublabel: "Silver",
    minDeposit: 200,
    discount: 5,
    color: "#38bdf8",
    accentColor: "#38bdf8",
    borderClass: "border-sky-200 dark:border-sky-700/50",
    bgClass: "bg-sky-50 dark:bg-sky-900/20",
    textClass: "text-sky-700 dark:text-sky-300",
    description: "5% off every number rental. Priority support access.",
  },
  {
    level: 3,
    label: "Level 3",
    sublabel: "Gold",
    minDeposit: 500,
    discount: 10,
    color: "#4574FF",
    accentColor: "#4574FF",
    borderClass: "border-[#4574FF]/30 dark:border-[#4574FF]/40",
    bgClass: "bg-[#4574FF]/5 dark:bg-[#4574FF]/10",
    textClass: "text-[#4574FF]",
    description: "10% off all rentals and early access to new services.",
  },
  {
    level: 4,
    label: "Level 4",
    sublabel: "Platinum",
    minDeposit: 1000,
    discount: 20,
    color: "#818cf8",
    accentColor: "#818cf8",
    borderClass: "border-indigo-200 dark:border-indigo-700/50",
    bgClass: "bg-indigo-50 dark:bg-indigo-900/20",
    textClass: "text-indigo-600 dark:text-indigo-400",
    description: "20% off all rentals plus a dedicated account manager.",
  },
] as const;

function getCurrentTier(monthlyTotal: number) {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (monthlyTotal >= t.minDeposit) tier = t;
    else break;
  }
  return tier;
}

function getNextTier(currentLevel: number) {
  return TIERS.find(t => t.level === currentLevel + 1) ?? null;
}

export default function Rankings() {
  const { data: user, isLoading: userLoading } = useGetMe();
  const { data: depositsData, isLoading: depositsLoading } = useMonthlyDeposits();

  const isLoading = userLoading || depositsLoading;
  const monthlyTotal = depositsData?.monthlyTotal ?? 0;
  const currentTier = getCurrentTier(monthlyTotal);
  const nextTier = getNextTier(currentTier.level);
  const progressToNext = nextTier
    ? Math.min(100, (monthlyTotal / nextTier.minDeposit) * 100)
    : 100;
  const amountToNext = nextTier ? Math.max(0, nextTier.minDeposit - monthlyTotal) : 0;

  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  return (
    <div className="max-w-lg mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-tight">
          <span className="bg-gradient-to-r from-white to-sky-300 bg-clip-text text-transparent">Ranking System</span>
        </h1>
        <p className="text-slate-500 mt-0.5 text-[13px]">
          Unlock discounts based on your monthly deposits. Resets each calendar month.
        </p>
      </div>

      {/* Current status card */}
      <div className={`rounded-2xl border ${currentTier.borderClass} ${currentTier.bgClass} overflow-hidden`}>
        <div className="p-5">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-40 rounded-lg bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-4 w-64 rounded bg-slate-200 dark:bg-slate-700" />
              <Skeleton className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Tier label */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500 mb-1">
                    Your Rank
                  </div>
                  <div className={`text-[26px] font-black tracking-tight ${currentTier.textClass}`}>
                    {currentTier.label}
                  </div>
                  <div className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentTier.sublabel}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mb-0.5">{monthName} {year}</div>
                  <div className="text-[22px] font-bold text-slate-800 dark:text-white">${monthlyTotal.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500">deposited this month</div>
                </div>
              </div>

              {/* Discount badge */}
              {currentTier.discount > 0 && (
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-white/50 dark:bg-white/[0.05]"
                  style={{ borderColor: currentTier.accentColor + "44" }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" style={{ color: currentTier.accentColor }} />
                  <span className={`text-[12px] font-bold ${currentTier.textClass}`}>
                    {currentTier.discount}% discount active on all rentals
                  </span>
                </div>
              )}

              {/* Progress to next tier */}
              {nextTier ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-slate-500 dark:text-slate-400">Progress to {nextTier.label}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ${amountToNext.toFixed(2)} more needed
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressToNext}%`,
                        backgroundColor: currentTier.accentColor,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
                    <span>${monthlyTotal.toFixed(0)}</span>
                    <span>${nextTier.minDeposit}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Highest rank — maximum discount active
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* All tiers */}
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.05]">
          <div className="font-semibold text-white text-[14px]">All Levels</div>
          <div className="text-[12px] text-slate-500 mt-0.5">Deposit requirements reset on the 1st of each month.</div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {TIERS.map((tier) => {
            const isCurrent = currentTier.level === tier.level;
            const isLocked = monthlyTotal < tier.minDeposit;
            return (
              <div
                key={tier.level}
                className={`flex items-center gap-4 px-4 py-4 transition-colors ${
                  isCurrent ? "bg-white/[0.04]" : ""
                }`}
              >
                {/* Level badge */}
                <div
                  className="h-11 w-11 rounded-xl shrink-0 flex flex-col items-center justify-center border"
                  style={{
                    backgroundColor: isCurrent ? tier.accentColor + "22" : "rgba(255,255,255,0.03)",
                    borderColor: isCurrent ? tier.accentColor + "44" : "rgba(255,255,255,0.07)",
                  }}
                >
                  {isLocked && tier.minDeposit > 0 ? (
                    <Lock className="h-4 w-4 text-slate-600" />
                  ) : (
                    <>
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: isLocked ? "#475569" : tier.accentColor + "aa" }}>LVL</span>
                      <span className="text-[14px] font-black leading-none" style={{ color: isLocked ? "#475569" : tier.accentColor }}>{tier.level}</span>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-bold" style={{ color: isLocked ? "#64748b" : tier.accentColor }}>
                      {tier.label}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-500">
                      {tier.sublabel}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-[0.15em] px-1.5 py-0.5 rounded-md border"
                        style={{ color: tier.accentColor, borderColor: tier.accentColor + "44", backgroundColor: tier.accentColor + "18" }}>
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {tier.description}
                  </div>
                </div>

                {/* Requirement */}
                <div className="text-right shrink-0">
                  {tier.discount > 0 && (
                    <div className="text-[11px] font-bold mb-0.5" style={{ color: isLocked ? "#64748b" : tier.accentColor }}>
                      {tier.discount}% off
                    </div>
                  )}
                  {tier.minDeposit === 0 ? (
                    <div className="text-[12px] font-semibold text-slate-400">Free</div>
                  ) : (
                    <>
                      <div className="text-[13px] font-bold text-slate-300">${tier.minDeposit.toLocaleString()}</div>
                      <div className="text-[10.5px] text-slate-500">/ month</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] px-4 py-3">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-4 w-4 text-[#4574FF] shrink-0 mt-0.5" />
          <div className="text-[12px] text-slate-400 leading-relaxed">
            Monthly deposits include all completed top-ups in the current calendar month.
            Discounts apply automatically at checkout — no code needed.{" "}
            <Link href="/payments">
              <span className="text-[#4574FF] font-semibold cursor-pointer hover:underline">
                Add funds <ChevronRight className="h-3 w-3 inline" />
              </span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
