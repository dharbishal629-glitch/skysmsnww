import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { LifeBuoy, Search, ShieldCheck, Ticket, UserRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/+$/, "") ??
  "";

type TicketItem = {
  id: string;
  displayId?: string;
  ticketNumber?: string | number;
  userName: string;
  userEmail: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  claimedByUserId?: string | null;
  claimedByName?: string | null;
  claimedAt?: string | null;
  updatedAt: string;
};

async function getTickets() {
  const response = await fetch(`${API_URL}/api/admin/support`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Unable to load support tickets.");
  return ((await response.json()) as { tickets: TicketItem[] }).tickets;
}

async function claimTicket(id: string) {
  const response = await fetch(`${API_URL}/api/admin/support/${id}/claim`, {
    method: "POST",
    credentials: "include",
  });
  const data = (await response.json()) as {
    ticket?: TicketItem;
    error?: string;
  };
  if (!response.ok) throw new Error(data.error ?? "Unable to claim ticket.");
  return data.ticket;
}

export default function SupportPortal() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const {
    data: tickets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["support-portal-tickets"],
    queryFn: getTickets,
    refetchInterval: 15_000,
  });
  const claim = useMutation({
    mutationFn: claimTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-portal-tickets"] });
      toast({
        title: "Ticket claimed",
        description: "You can now reply to this ticket.",
      });
    },
    onError: (claimError: Error) =>
      toast({
        title: "Could not claim ticket",
        description: claimError.message,
        variant: "destructive",
      }),
  });

  const filtered = tickets.filter((ticket) => {
    const query = search.toLowerCase();
    return (
      !query ||
      `${ticket.subject} ${ticket.userName} ${ticket.userEmail} ${ticket.displayId}`
        .toLowerCase()
        .includes(query)
    );
  });
  const open = tickets.filter((ticket) =>
    ["open", "in_progress"].includes(ticket.status),
  ).length;
  const unclaimed = tickets.filter(
    (ticket) =>
      !ticket.claimedByUserId &&
      ["open", "in_progress"].includes(ticket.status),
  ).length;

  return (
    <main className="support-portal-shell min-h-screen px-4 py-6 text-emerald-50 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col justify-between gap-4 border-b border-emerald-500/15 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-500/15 text-emerald-300">
              <LifeBuoy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-300">
                Support operations
              </p>
              <h1 className="font-display text-2xl font-extrabold text-white">
                Support Portal
              </h1>
            </div>
          </div>
          <button
            onClick={() => setLocation("/dashboard")}
            className="h-10 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 text-sm font-bold text-emerald-200 hover:bg-emerald-500/20"
          >
            Return to user portal
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["Open queue", open, "Active conversations"],
            ["Needs ownership", unclaimed, "Unclaimed tickets"],
            ["Total tickets", tickets.length, "All conversations"],
          ].map(([label, value, note]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-emerald-500/15 bg-[#0d1915] p-5"
            >
              <p className="text-sm text-emerald-100/55">{label}</p>
              <p className="mt-2 text-3xl font-black text-white">{value}</p>
              <p className="mt-1 text-xs text-emerald-100/45">{note}</p>
            </div>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-emerald-500/15 bg-[#0d1915]">
          <div className="flex flex-col gap-3 border-b border-emerald-500/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-white">
                <Ticket className="h-4 w-4 text-emerald-300" />
                <h2 className="font-bold">Support tickets</h2>
              </div>
              <p className="mt-1 text-xs text-emerald-100/45">
                Claim a conversation before replying when ownership is enabled.
              </p>
            </div>
            <div className="relative sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-100/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tickets"
                className="h-10 w-full rounded-xl border border-emerald-500/15 bg-[#08100d] pl-9 pr-3 text-sm text-white placeholder:text-emerald-100/30"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="p-8 text-sm text-emerald-100/55">
              Loading support queue...
            </div>
          ) : error ? (
            <div className="p-8 text-sm text-red-300">
              Unable to load support queue.
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-sm text-emerald-100/55">
              No tickets match your search.
            </div>
          ) : (
            <div className="divide-y divide-emerald-500/10">
              {filtered.map((ticket) => {
                const active = ["open", "in_progress"].includes(ticket.status);
                return (
                  <div
                    key={ticket.id}
                    className="flex flex-col gap-4 p-5 transition-colors hover:bg-emerald-500/[0.03] sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/15 bg-emerald-500/10 text-emerald-300">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">
                          {ticket.subject}
                        </p>
                        <p className="mt-1 text-xs text-emerald-100/50">
                          #
                          {ticket.displayId ?? ticket.ticketNumber ?? ticket.id}{" "}
                          · {ticket.userName} · {ticket.category}
                        </p>
                        <p className="mt-1 text-xs text-emerald-100/35">
                          {ticket.claimedByName
                            ? `Claimed by ${ticket.claimedByName}`
                            : active
                              ? "Waiting for a support owner"
                              : "No active action required"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:shrink-0">
                      {active && !ticket.claimedByUserId && (
                        <button
                          disabled={claim.isPending}
                          onClick={() => claim.mutate(ticket.id)}
                          className="flex h-9 items-center gap-2 rounded-xl bg-emerald-500 px-3 text-xs font-extrabold text-[#052e16] hover:bg-emerald-400 disabled:opacity-50"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" /> CLAIM
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setLocation(
                            `/supportportal/conversation/${ticket.id}`,
                          )
                        }
                        className="h-9 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-200 hover:bg-emerald-500/20"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
