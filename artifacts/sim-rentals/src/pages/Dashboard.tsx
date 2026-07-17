import { useGetDashboard, useGetMe, getGetDashboardQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboard();
  const { data: user } = useGetMe();
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() });
    }, 30_000);
    return () => clearInterval(id);
  }, [queryClient]);
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 page-enter">
        <div className="space-y-1">
          <Skeleton className="h-7 w-52 bg-slate-200 dark:bg-slate-700" />
          <Skeleton className="h-4 w-40 bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-sm">
              <Skeleton className="h-3 w-16 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-8 w-20 bg-slate-100 dark:bg-slate-800" />
              <Skeleton className="h-3 w-24 bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <AlertCircle className="h-8 w-8 text-red-400 mb-3" />
        <p className="text-[13px] text-slate-500 dark:text-slate-400">Could not load dashboard.</p>
      </div>
    );
  }

  const balance = data?.account?.credits ?? 0;
  const stats = [
    {
      label: t("balance"),
      value: `${balance.toFixed(2)}`,
      sub: balance === 0 ? t("addFunds") : "Available",
      link: "/payments",
      accent: "#4574FF",
    },
    {
      label: t("filterActive"),
      value: String(data?.activeRentals ?? 0),
      sub: t("activeRentals"),
      link: "/rentals",
      accent: "#10b981",
    },
    {
      label: "Completed",
      value: String(data?.completedRentals ?? 0),
      sub: "total rentals",
      link: "/rentals",
      accent: "#6366f1",
    },
    {
      label: "Spent",
      value: `${(data?.totalSpent ?? 0).toFixed(2)}`,
      sub: "total spent",
      link: "/payments",
      accent: "#10b981",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-7 page-enter">

      {/* Header */}
      <div>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-slate-900 dark:text-white">
          {t("welcomeBack")}
          {user?.name ? (
            <span className="text-[#4574FF]">{`, ${user.name.split(" ")[0]}`}</span>
          ) : ""}
        </h1>
        <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Here's an overview of your account.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, sub, link, accent }) => (
          <Link key={label} href={link}>
            <div
              className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 cursor-pointer hover:border-[#4574FF]/30 hover:shadow-md dark:hover:border-[#4574FF]/30 transition-all duration-200 relative overflow-hidden shadow-sm"
              style={{
                boxShadow: "0 1px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(69,116,255,0.04)",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, ${accent}, ${accent}88)` }}
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500 mb-2">{label}</p>
              <p
                className="font-display text-[28px] font-black leading-none tracking-tight mb-1.5"
                style={{ color: accent }}
              >
                {value}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
