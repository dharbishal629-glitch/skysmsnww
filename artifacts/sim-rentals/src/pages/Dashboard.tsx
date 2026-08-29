import {
  useGetDashboard,
  useGetMe,
  getGetDashboardQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Link } from "wouter";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  CreditCard,
  Globe2,
  Phone,
  Plus,
  Receipt,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/useLanguage";
import { AnalyticsChart } from "@/components/AnalyticsChart";

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ElementType;
  tone: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="dash-stat-card">
        <div className={`dash-stat-icon ${tone}`}>
          <Icon />
        </div>
        <div className="dash-stat-meta">
          <span>{label}</span>
          <strong>{value}</strong>
          <small>{detail}</small>
        </div>
        <ArrowUpRight className="dash-card-arrow" />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboard();
  const { data: user } = useGetMe();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    const id = setInterval(
      () =>
        queryClient.invalidateQueries({ queryKey: getGetDashboardQueryKey() }),
      30_000,
    );
    return () => clearInterval(id);
  }, [queryClient]);

  if (isLoading)
    return (
      <div className="dashboard-page page-enter">
        <Skeleton className="h-10 w-64 bg-slate-200 dark:bg-slate-800" />
        <div className="dash-stats-grid">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton
              key={item}
              className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  if (error || !data)
    return (
      <div className="dash-error">
        <ShieldCheck />
        <h2>We could not load your workspace</h2>
        <p>Refresh the page and try again.</p>
      </div>
    );

  const balance = data.account?.credits ?? 0;
  const firstName = user?.name?.split(" ")[0] || "there";
  const recentRentals = data.recentRentals ?? [];
  const recentPayments = data.recentPayments ?? [];

  return (
    <div className="dashboard-page page-enter">
      <div className="dashboard-welcome">
        <div>
          <div className="dash-kicker">
            <Sparkles /> PERSONAL OVERVIEW
          </div>
          <h1>
            {t("welcomeBack")}, <span>{firstName}</span>
          </h1>
          <p>Your private verification workspace, at a glance.</p>
        </div>
        <Link href="/rent">
          <button className="dash-primary-button">
            <Plus /> Rent a number
          </button>
        </Link>
      </div>
      <div className="dash-stats-grid">
        <StatCard
          label={t("balance")}
          value={`$${balance.toFixed(2)}`}
          detail={balance > 0 ? "Available to spend" : "Add credits to begin"}
          icon={Wallet}
          tone="lime"
          href="/payments"
        />
        <StatCard
          label="Active rentals"
          value={String(data.activeRentals ?? 0)}
          detail="Live right now"
          icon={Phone}
          tone="cyan"
          href="/rentals"
        />
        <StatCard
          label="Completed"
          value={String(data.completedRentals ?? 0)}
          detail="Successful sessions"
          icon={CheckCircle2}
          tone="blue"
          href="/rentals"
        />
        <StatCard
          label="Total spent"
          value={`$${(data.totalSpent ?? 0).toFixed(2)}`}
          detail="Across all rentals"
          icon={Receipt}
          tone="peach"
          href="/activity"
        />
      </div>
      <div className="dash-main-grid">
        <section className="dash-panel analytics-panel">
          <div className="dash-panel-heading">
            <div>
              <div className="panel-label">
                <BarChart3 /> USAGE ANALYTICS
              </div>
              <h2>Recent activity</h2>
              <p>Rentals and account funding over the last 7 days.</p>
            </div>
            <div className="chart-legend">
              <span>
                <i className="legend-lime" /> Rentals
              </span>
              <span>
                <i className="legend-cyan" /> Added funds
              </span>
            </div>
          </div>
          <AnalyticsChart rentals={recentRentals} payments={recentPayments} />
        </section>
        <section className="dash-panel quick-panel">
          <div className="panel-label">
            <ZapIcon /> QUICK ACTIONS
          </div>
          <h2>Keep moving</h2>
          <div className="quick-actions">
            <Link href="/rent">
              <span>
                <Phone /> Rent a number
              </span>
              <ArrowUpRight />
            </Link>
            <Link href="/payments">
              <span>
                <CreditCard /> Add credits
              </span>
              <ArrowUpRight />
            </Link>
            <Link href="/settings">
              <span>
                <ShieldCheck /> Secure account
              </span>
              <ArrowUpRight />
            </Link>
          </div>
          <div className="privacy-note">
            <Globe2 />
            <div>
              <strong>Global network</strong>
              <p>Live availability across 10+ countries.</p>
            </div>
          </div>
        </section>
      </div>
      <div className="dash-bottom-grid">
        <section className="dash-panel">
          <div className="dash-panel-heading compact-heading">
            <div>
              <div className="panel-label">
                <Phone /> RECENT RENTALS
              </div>
              <h2>Latest sessions</h2>
            </div>
            <Link href="/rentals">
              View all <ArrowUpRight />
            </Link>
          </div>
          {recentRentals.length ? (
            <div className="dash-list">
              {recentRentals.slice(0, 4).map((rental) => (
                <div className="dash-list-row" key={rental.id}>
                  <span className="row-avatar">
                    <Phone />
                  </span>
                  <div>
                    <strong>{rental.serviceName}</strong>
                    <small>{rental.countryName}</small>
                  </div>
                  <span className="row-price">${rental.price.toFixed(2)}</span>
                  <span
                    className={`row-status ${rental.status === "active" ? "active" : ""}`}
                  >
                    {rental.status === "active" ? "Active" : "Complete"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="dash-empty">
              <Phone />
              <p>No rentals yet. Your sessions will show here.</p>
            </div>
          )}
        </section>
        <section className="dash-panel balance-panel">
          <div className="panel-label">
            <Wallet /> ACCOUNT HEALTH
          </div>
          <h2>Ready to verify</h2>
          <div className="health-meter">
            <span
              style={{ width: `${Math.min(100, Math.max(14, balance * 5))}%` }}
            />
          </div>
          <div className="health-copy">
            <strong>
              {balance > 0 ? "Your balance is ready" : "Your balance is empty"}
            </strong>
            <span>
              {balance > 0
                ? "You can rent a number anytime."
                : "Top up to start your first rental."}
            </span>
          </div>
          <Link href="/payments">
            <button className="dash-outline-button">
              {balance > 0 ? "Manage balance" : "Add credits"} <ArrowUpRight />
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}

function ZapIcon() {
  return <Sparkles />;
}