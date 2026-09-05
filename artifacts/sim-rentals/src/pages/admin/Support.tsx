import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Clock3,
  Filter,
  Inbox,
  LifeBuoy,
  RefreshCw,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface TicketMessage {
  id: string;
  senderRole: string;
  senderName: string;
  message: string;
  imageUrl?: string | null;
  createdAt: string;
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

const BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ??
  "";

async function fetchAdminTickets(): Promise<AdminTicket[]> {
  const response = await fetch(`${BASE}/api/admin/support`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to load tickets");
  return ((await response.json()) as { tickets: AdminTicket[] }).tickets;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  open: { label: "Open", className: "support-status-open" },
  in_progress: { label: "In progress", className: "support-status-pending" },
  resolved: { label: "Resolved", className: "support-status-resolved" },
  closed: { label: "Closed", className: "support-status-closed" },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "support-priority-high" },
  urgent: { label: "Urgent", className: "support-priority-high" },
  medium: { label: "Medium", className: "support-priority-medium" },
  normal: { label: "Normal", className: "support-priority-medium" },
  low: { label: "Low", className: "support-priority-low" },
};

function TicketRow({ ticket }: { ticket: AdminTicket }) {
  const [, setLocation] = useLocation();
  const status = statusConfig[ticket.status] ?? statusConfig.open;
  const priority = priorityConfig[ticket.priority] ?? priorityConfig.low;
  const hasUserReply = ticket.messages.some(
    (message) => message.senderRole === "user",
  );
  const lastMessage = ticket.messages.at(-1);

  return (
    <button
      className="support-ticket-row"
      onClick={() => setLocation(`/admin/support/conversation/${ticket.id}`)}
    >
      <span className="support-ticket-id">
        #{ticket.displayId ?? ticket.ticketNumber ?? ticket.id.slice(0, 8)}
      </span>
      <span className="support-ticket-subject">
        <strong>{ticket.subject}</strong>
        <small>{lastMessage?.message || ticket.message}</small>
      </span>
      <span className={`support-status-badge ${status.className}`}>
        {status.label}
      </span>
      <span className={`support-priority ${priority.className}`}>
        <CircleDot /> {priority.label}
      </span>
      <span className="support-ticket-age">
        {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
      </span>
      <ChevronRight className="support-row-arrow" />
      {hasUserReply && <span className="support-unread-dot" />}
    </button>
  );
}

export default function AdminSupport() {
  const {
    data: tickets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-tickets"],
    queryFn: fetchAdminTickets,
    refetchInterval: 15_000,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const all = tickets ?? [];
  const filtered = useMemo(
    () =>
      all.filter((ticket) => {
        const query = search.toLowerCase();
        return (
          (statusFilter === "all" || ticket.status === statusFilter) &&
          (priorityFilter === "all" || ticket.priority === priorityFilter) &&
          (!query ||
            `${ticket.subject} ${ticket.userName} ${ticket.userEmail} ${ticket.displayId}`
              .toLowerCase()
              .includes(query))
        );
      }),
    [all, priorityFilter, search, statusFilter],
  );
  const openCount = all.filter((ticket) => ticket.status === "open").length;
  const pendingCount = all.filter(
    (ticket) => ticket.status === "in_progress",
  ).length;
  const resolvedCount = all.filter((ticket) =>
    ["resolved", "closed"].includes(ticket.status),
  ).length;

  return (
    <div
      className="support-dashboard page-enter sky-page"
      data-sky-page="admin-support"
    >
      <header className="support-dashboard-header">
        <div className="support-brand-lockup">
          <div className="support-brand-mark">
            <LifeBuoy />
          </div>
          <div>
            <span>SKY SMS</span>
            <small>Support operations</small>
          </div>
        </div>
        <div className="support-header-actions">
          <button aria-label="Search">
            <Search />
          </button>
          <button aria-label="Notifications" className="support-notification">
            <Bell />
            <i />
          </button>
          <div className="support-header-divider" />
          <div className="support-agent">
            <div>
              <strong>Support Desk</strong>
              <small>Admin workspace</small>
            </div>
            <span>SD</span>
          </div>
        </div>
      </header>

      <div className="support-dashboard-body">
        <aside className="support-filter-rail">
          <div>
            <h5>Ticket views</h5>
            {[
              {
                key: "all",
                label: "All tickets",
                icon: Inbox,
                count: all.length,
              },
              { key: "open", label: "Open", icon: CircleDot, count: openCount },
              {
                key: "in_progress",
                label: "Pending",
                icon: Clock3,
                count: pendingCount,
              },
              {
                key: "resolved",
                label: "Resolved",
                icon: CheckCircle2,
                count: resolvedCount,
              },
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                className={statusFilter === key ? "active" : ""}
                onClick={() => setStatusFilter(key)}
              >
                <Icon />
                <span>{label}</span>
                <b>{count}</b>
              </button>
            ))}
          </div>
          <div>
            <h5>Priority filter</h5>
            {[
              { key: "high", label: "High priority", color: "high" },
              { key: "medium", label: "Medium", color: "medium" },
              { key: "low", label: "Low priority", color: "low" },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                className={priorityFilter === key ? "active" : ""}
                onClick={() =>
                  setPriorityFilter(priorityFilter === key ? "all" : key)
                }
              >
                <i className={`support-priority-dot ${color}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="support-live-note">
            <p>
              Need immediate help? Live support is available around the clock.
            </p>
            <a href="/support">
              Open support center <ChevronRight />
            </a>
          </div>
        </aside>

        <main className="support-dashboard-main">
          <div className="support-stats-grid">
            <div>
              <div>
                <span>Open tickets</span>
                <strong>{String(openCount).padStart(2, "0")}</strong>
              </div>
              <AlertCircle />
            </div>
            <div>
              <div>
                <span>Pending action</span>
                <strong>{String(pendingCount).padStart(2, "0")}</strong>
              </div>
              <Clock3 />
            </div>
            <div>
              <div>
                <span>Resolution rate</span>
                <strong>
                  {all.length
                    ? `${Math.round((resolvedCount / all.length) * 100)}%`
                    : "--"}
                </strong>
              </div>
              <TrendingUp />
            </div>
          </div>
          <div className="support-queue-heading">
            <div>
              <span>Support workspace</span>
              <h1>
                Active <em>support queue</em>
              </h1>
            </div>
            <div className="support-queue-actions">
              <button>
                <Filter /> Sort by
              </button>
              <button onClick={() => void refetch()}>
                <RefreshCw /> Sync
              </button>
            </div>
          </div>
          <div className="support-search">
            <Search />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tickets, users, or ticket IDs"
            />
          </div>
          <section className="support-ticket-table">
            <div className="support-table-head">
              <span>ID</span>
              <span>Ticket subject</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Updated</span>
              <span />
            </div>
            {isLoading ? (
              <div className="support-loading">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-16 w-full bg-[#142431]" />
                ))}
              </div>
            ) : error ? (
              <div className="support-empty">
                <AlertCircle />
                <p>Could not load support tickets.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="support-empty">
                <LifeBuoy />
                <p>No tickets match your filters.</p>
              </div>
            ) : (
              filtered.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))
            )}
          </section>
          <footer className="support-dashboard-footer">
            <span>
              Showing <b>{filtered.length}</b> of <b>{all.length}</b> tickets
            </span>
            <span className="support-system-online">
              <i /> Systems online
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
