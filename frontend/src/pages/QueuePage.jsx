import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card, { StatCard } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badge";
import { TableSkeleton, StatCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { API_BASE } from "../services/api";

const services = [
  { id: 1, name: "État Civil", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  { id: 2, name: "Permis de Construire", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
  { id: 3, name: "Affaires Sociales", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
  { id: 4, name: "Services Techniques", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg> },
  { id: 5, name: "Registre Commerce", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  { id: 6, name: "Contentieux", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg> },
];

function getServiceIcon(id) {
  return services.find((s) => s.id === id)?.icon || <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
}

export default function QueuePage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTickets, resStats] = await Promise.all([
          fetch(`${API_BASE}/api/reservations`),
          fetch(`${API_BASE}/api/reservations/stats/daily`),
        ]);
        if (resTickets.ok) setTickets(await resTickets.json());
        if (resStats.ok) setStats(await resStats.json());
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const todayTickets = tickets.filter((t) => t.date === new Date().toISOString().split("T")[0]);
  const filtered = serviceFilter === "all" ? todayTickets : todayTickets.filter((t) => t.serviceId === parseInt(serviceFilter));

  const waiting = todayTickets.filter((t) => t.status === "confirmed").length;
  const processing = todayTickets.filter((t) => t.status === "waiting" || t.status === "processing").length;
  const completed = todayTickets.filter((t) => t.status === "completed").length;

  const timeStr = currentTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const dateStr = currentTime.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-soft" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">File d'attente en direct</h1>
          </div>
          <p className="text-sm text-slate-400 mt-1 capitalize">{dateStr}</p>
        </div>
        <div className="flex items-center gap-3">
          <GlassClock time={timeStr} />
          <Link to="/ticket">
            <Button size="sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Prendre un ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard label="Aujourd'hui" value={stats.total || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} color="indigo" />
            <StatCard label="En attente" value={stats.confirmed || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="amber" />
            <StatCard label="En cours" value={processing} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>} color="purple" />
            <StatCard label="Traités" value={stats.completed || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
          </>
        ) : (
          <div className="col-span-4 text-center py-8 text-sm text-slate-400 bg-white/50 rounded-2xl border border-dashed border-slate-200">
            Connectez le serveur de réservation
          </div>
        )}
      </div>

      {/* Service filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0">
        <button
          onClick={() => setServiceFilter("all")}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
            serviceFilter === "all"
              ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md"
              : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
          }`}
        >
          Tous les services
        </button>
        {services.map((svc) => (
          <button
            key={svc.id}
            onClick={() => setServiceFilter(svc.id.toString())}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              serviceFilter === svc.id.toString()
                ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            <span>{svc.icon}</span>
            {svc.name}
          </button>
        ))}
      </div>

      {/* Queue list */}
      {loading ? (
        <TableSkeleton rows={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
          title="Aucun ticket dans la file"
          description="Il n'y a actuellement aucun ticket en attente pour ce service."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((ticket, idx) => (
            <div
              key={ticket._id}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all animate-scale-in"
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {/* Position number */}
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center flex-shrink-0">
                <p className="text-sm font-bold text-indigo-700 ticket-number">{idx + 1}</p>
              </div>

              {/* Service icon */}
              <div className="text-xl flex-shrink-0">{getServiceIcon(ticket.serviceId)}</div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{ticket.serviceName}</p>
                <p className="text-xs text-slate-400 truncate">{ticket.citizenName}</p>
              </div>

              {/* Time + ticket number */}
              <div className="text-right flex-shrink-0 hidden sm:block">
                <p className="text-xs font-medium text-slate-600">{ticket.time}</p>
                <p className="text-[10px] text-slate-400 ticket-number">{ticket.ticketNumber}</p>
              </div>

              {/* Status */}
              <StatusBadge status={ticket.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GlassClock({ time }) {
  return (
    <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Heure</p>
      <p className="text-lg font-bold text-slate-800 tabular-nums">{time}</p>
    </div>
  );
}
