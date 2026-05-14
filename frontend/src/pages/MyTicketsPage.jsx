import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import { StatusBadge } from "../components/ui/Badge";
import { TicketCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { API_BASE } from "../services/api";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservations`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch {
      showToast("Impossible de charger les tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTickets(); }, []);

  const filtered = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const counts = {
    all: tickets.length,
    confirmed: tickets.filter((t) => t.status === "confirmed").length,
    completed: tickets.filter((t) => t.status === "completed").length,
    cancelled: tickets.filter((t) => t.status === "cancelled").length,
    absent: tickets.filter((t) => t.status === "absent").length,
  };

  const filters = [
    { id: "all", label: "Tous", count: counts.all },
    { id: "confirmed", label: "Confirmés", count: counts.confirmed },
    { id: "completed", label: "Traités", count: counts.completed },
    { id: "cancelled", label: "Annulés", count: counts.cancelled },
    { id: "absent", label: "Absents", count: counts.absent },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Mes tickets</h1>
          <p className="text-sm text-slate-400 mt-1">Suivez l'état de vos demandes</p>
        </div>
        <Link to="/ticket">
          <Button size="sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau ticket
          </Button>
        </Link>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              filter === f.id
                ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            {f.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
              filter === f.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <TicketCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
          title="Aucun ticket"
          description={filter === "all" ? "Vous n'avez pas encore de ticket." : "Aucun ticket dans cette catégorie."}
          action={
            <Link to="/ticket">
              <Button size="sm">Prendre un ticket</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((ticket) => (
            <TicketCardItem key={ticket._id} ticket={ticket} onUpdate={loadTickets} />
          ))}
        </div>
      )}
    </div>
  );
}

function TicketCardItem({ ticket, onUpdate }) {
  const statusColors = {
    confirmed: "border-l-emerald-500",
    completed: "border-l-blue-500",
    cancelled: "border-l-slate-400",
    absent: "border-l-rose-500",
    processing: "border-l-indigo-500",
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 border-l-4 ${statusColors[ticket.status] || "border-l-indigo-500"} shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all animate-scale-in`}>
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{ticket.serviceName}</span>
          <StatusBadge status={ticket.status} />
        </div>

        <p className="text-xl font-bold text-slate-800 ticket-number tracking-wider">{ticket.ticketNumber}</p>

        <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {ticket.date}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {ticket.time}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {ticket.citizenName}
          </span>
        </div>
      </div>
    </div>
  );
}
