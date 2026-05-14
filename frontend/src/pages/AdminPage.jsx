import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Button from "../components/ui/Button";
import { StatCard } from "../components/ui/Card";
import { StatusBadge } from "../components/ui/Badge";
import { TableSkeleton, StatCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { showToast } from "../components/ui/Toast";
import Modal from "../components/ui/Modal";
import Input from "../components/ui/Input";
import { API_BASE } from "../services/api";
import AdminBusPanel from "../components/Bus/AdminBusPanel";

const sidebarItems = [
  {
    path: "/admin",
    label: "Tableau de bord",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    exact: true,
  },
  {
    path: "/admin/queue",
    label: "File d'attente",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    path: "/admin/services",
    label: "Responsables",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    path: "/admin/stats",
    label: "Statistiques",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    path: "/admin/bus",
    label: "Bus & Arrêts",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
];

export default function AdminPage() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="flex gap-6 -mx-4 sm:-mx-6">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-16 left-0 z-50 w-64 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-sm border-r border-slate-100 p-4
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        overflow-y-auto flex flex-col
      `}>
        <div className="flex items-center justify-between mb-6 lg:hidden">
          <span className="text-sm font-bold text-slate-800">Menu Admin</span>
          <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 px-3.5 py-3 mb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Administration</p>
            <p className="text-[10px] text-slate-400 font-medium">Panneau de gestion</p>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item)
                  ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Quick links */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 px-3">Accès rapide</p>
          <div className="space-y-1">
            <Link to="/bus" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transport urbain
            </Link>
            <Link to="/places" className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Lieux historiques
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-30 w-12 h-12 rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0 animate-fade-in">
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="queue" element={<AdminQueue />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="bus" element={<AdminBusPanel />} />
        </Routes>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [resTickets, resStats] = await Promise.all([
        fetch(`${API_BASE}/api/reservations`),
        fetch(`${API_BASE}/api/reservations/stats/daily`),
      ]);
      if (resTickets.ok) setTickets(await resTickets.json());
      if (resStats.ok) setStats(await resStats.json());
    } catch {
      showToast("Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const todayTickets = tickets.filter(
    (t) => t.date === new Date().toISOString().split("T")[0]
  );
  const pending = todayTickets.filter(
    (t) => t.status === "confirmed" && new Date(`${t.date}T${t.time}`) <= new Date()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Tableau de bord</h1>
          <p className="text-sm text-slate-400 mt-0.5">Vue d'ensemble des services municipaux</p>
        </div>
        <button
          onClick={loadData}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard label="Aujourd'hui" value={stats.total || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} color="indigo" />
            <StatCard label="En attente" value={stats.confirmed || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="amber" />
            <StatCard label="Traités" value={stats.completed || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
            <StatCard label="Absents" value={stats.absent || 0} icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="rose" />
          </>
        ) : null}
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Tickets en attente aujourd'hui
          {pending.length > 0 && (
            <span className="ml-2 text-xs font-normal text-amber-500">({pending.length} à traiter)</span>
          )}
        </h2>
        {loading ? (
          <TableSkeleton rows={4} />
        ) : pending.length === 0 ? (
          <EmptyState compact icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} title="Tout est à jour" description="Aucun ticket en attente de traitement." />
        ) : (
          <div className="space-y-2">
            {pending.map((ticket) => (
              <PendingTicketRow key={ticket._id} ticket={ticket} onUpdate={loadData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PendingTicketRow({ ticket, onUpdate }) {
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = async (action) => {
    setActionLoading(true);
    try {
      const endpoint =
        action === "complete"
          ? `${API_BASE}/api/reservations/${ticket._id}/complete`
          : `${API_BASE}/api/reservations/${ticket._id}/start`;
      const res = await fetch(endpoint, { method: "PUT" });
      if (res.ok) {
        showToast(action === "complete" ? "Ticket marqué traité" : "Traitement démarré", "success");
        onUpdate();
      }
    } catch {
      showToast("Erreur", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const isLate =
    new Date(`${ticket.date}T${ticket.time}`) < new Date() && ticket.status === "confirmed";

  return (
    <div className={`flex items-center gap-3 p-3.5 bg-white rounded-xl border shadow-sm transition-all hover:shadow-md ${
      isLate ? "border-rose-200 bg-rose-50/30" : "border-slate-100"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ticket-number flex-shrink-0 ${
        isLate ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
      }`}>
        {ticket.ticketNumber?.replace("TKT-", "").slice(-4)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{ticket.citizenName}</p>
        <p className="text-xs text-slate-400 truncate">{ticket.serviceName} • {ticket.time}</p>
      </div>
      {isLate && <span className="text-[10px] font-semibold text-rose-600 uppercase">En retard</span>}
      <StatusBadge status={ticket.status} />
      <div className="flex gap-1.5">
        <button
          onClick={() => handleAction("start")}
          disabled={actionLoading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Traiter
        </button>
        <button
          onClick={() => handleAction("complete")}
          disabled={actionLoading}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          Terminer
        </button>
      </div>
    </div>
  );
}

function AdminQueue() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservations`);
      if (res.ok) setTickets(await res.json());
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadTickets(); }, []);

  const todayTickets = tickets.filter((t) => t.date === new Date().toISOString().split("T")[0]);
  const filtered = filter === "all" ? todayTickets : todayTickets.filter((t) => t.status === filter);

  const filters = [
    { id: "all", label: "Tous" },
    { id: "confirmed", label: "En attente" },
    { id: "processing", label: "En cours" },
    { id: "completed", label: "Traités" },
    { id: "absent", label: "Absents" },
    { id: "cancelled", label: "Annulés" },
  ];

  const handleStatusChange = async (id, status) => {
    const endpoints = {
      complete: `${API_BASE}/api/reservations/${id}/complete`,
      absent: `${API_BASE}/api/reservations/${id}/absent`,
      cancel: `${API_BASE}/api/reservations/${id}/cancel`,
      start: `${API_BASE}/api/reservations/${id}/start`,
    };
    try {
      const res = await fetch(endpoints[status], { method: "PUT" });
      if (res.ok) {
        showToast("Statut mis à jour", "success");
        loadTickets();
      }
    } catch {
      showToast("Erreur", "error");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-slate-800">File d'attente</h1>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              filter === f.id
                ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                : "bg-white border border-slate-200 text-slate-500 hover:border-indigo-200"
            }`}
          >
            {f.label}
          </button>
        ))}
        <button onClick={loadTickets} className="ml-auto px-3.5 py-2 rounded-xl text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer">
          Actualiser
        </button>
      </div>

      {loading ? (
        <TableSkeleton rows={8} />
      ) : filtered.length === 0 ? (
        <EmptyState compact icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>} title="Aucun ticket" description="Aucun ticket dans cette catégorie aujourd'hui." />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">N°</th>
                  <th className="text-left py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Citoyen</th>
                  <th className="text-left py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Service</th>
                  <th className="text-left py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Horaire</th>
                  <th className="text-left py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Statut</th>
                  <th className="text-right py-3.5 px-4 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((ticket) => (
                  <tr key={ticket._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-bold text-indigo-700 ticket-number">{ticket.ticketNumber}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm font-medium text-slate-800">{ticket.citizenName}</p>
                      <p className="text-xs text-slate-400">{ticket.citizenPhone}</p>
                    </td>
                    <td className="py-3.5 px-4 text-sm text-slate-600">{ticket.serviceName}</td>
                    <td className="py-3.5 px-4">
                      <p className="text-sm text-slate-800">{ticket.time}</p>
                      <p className="text-xs text-slate-400">{ticket.date}</p>
                    </td>
                    <td className="py-3.5 px-4"><StatusBadge status={ticket.status} /></td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ticket.status === "confirmed" && (
                          <>
                            <button onClick={() => handleStatusChange(ticket._id, "start")} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer">
                              Démarrer
                            </button>
                            <button onClick={() => handleStatusChange(ticket._id, "absent")} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer">
                              Absent
                            </button>
                          </>
                        )}
                        {ticket.status === "processing" && (
                          <button onClick={() => handleStatusChange(ticket._id, "complete")} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer">
                            Terminer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminServices() {
  const [responsibles, setResponsibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", service: "", counter: "", status: "active" });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/responsibles`);
      if (res.ok) setResponsibles(await res.json());
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const openEdit = (r) => {
    setEditing(r);
    setForm({ name: r.name, service: r.service, counter: r.counter, status: r.status });
    setShowModal(true);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", service: "", counter: "", status: "active" });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const url = editing
        ? `${API_BASE}/api/responsibles/${editing._id}`
        : `${API_BASE}/api/responsibles`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        showToast(editing ? "Responsable modifié" : "Responsable ajouté", "success");
        setShowModal(false);
        loadData();
      }
    } catch {
      showToast("Erreur", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce responsable ?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/responsibles/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Responsable supprimé", "success");
        loadData();
      }
    } catch {
      showToast("Erreur", "error");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Responsables</h1>
        <Button size="sm" onClick={openCreate}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : responsibles.length === 0 ? (
        <EmptyState compact icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} title="Aucun responsable" description="Ajoutez des responsables de service pour gérer la file d'attente." action={<Button size="sm" onClick={openCreate}>Ajouter</Button>} />
      ) : (
        <div className="grid gap-3">
          {responsibles.map((r) => (
            <div key={r._id} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {r.name?.charAt(0) || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                <p className="text-xs text-slate-400">{r.service} • Guichet {r.counter}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${
                r.status === "active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-50 text-slate-500 border border-slate-200"
              }`}>
                {r.status === "active" ? "Actif" : "Inactif"}
              </span>
              <button onClick={() => openEdit(r)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer">
                Modifier
              </button>
              <button onClick={() => handleDelete(r._id)} className="px-3 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "Modifier le responsable" : "Ajouter un responsable"} size="md">
        <div className="space-y-4">
          <Input label="Nom complet" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Service" name="service" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} required />
          <Input label="Guichet" name="counter" value={form.counter} onChange={(e) => setForm({ ...form, counter: e.target.value })} required />
          <div className="flex gap-2">
            <button onClick={() => setForm({ ...form, status: "active" })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${form.status === "active" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              Actif
            </button>
            <button onClick={() => setForm({ ...form, status: "inactive" })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${form.status === "inactive" ? "border-slate-500 bg-slate-50 text-slate-700" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
              Inactif
            </button>
          </div>
          <div className="flex gap-2 pt-2">
            <Button fullWidth variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
            <Button fullWidth onClick={handleSave}>{editing ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AdminStats() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservations`);
      if (res.ok) setTickets(await res.json());
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const todayTickets = tickets.filter((t) => t.date === new Date().toISOString().split("T")[0]);

  const serviceStats = {};
  todayTickets.forEach((t) => {
    if (!serviceStats[t.serviceName]) serviceStats[t.serviceName] = { total: 0, completed: 0, absent: 0, cancelled: 0, confirmed: 0 };
    serviceStats[t.serviceName].total++;
    serviceStats[t.serviceName][t.status] = (serviceStats[t.serviceName][t.status] || 0) + 1;
  });

  const hourlyData = {};
  todayTickets.forEach((t) => {
    const hour = t.time?.split(":")[0] || "?";
    hourlyData[hour] = (hourlyData[hour] || 0) + 1;
  });

  const maxHourly = Math.max(...Object.values(hourlyData), 1);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800">Statistiques</h1>

      {loading ? (
        <TableSkeleton rows={3} />
      ) : (
        <>
          {/* Service breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Par service</h2>
            <div className="space-y-4">
              {Object.entries(serviceStats).map(([name, stats]) => (
                <div key={name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{name}</span>
                    <span className="text-xs text-slate-400">{stats.total} tickets</span>
                  </div>
                  <div className="flex gap-1 h-2.5 rounded-full overflow-hidden bg-slate-100">
                    {stats.completed > 0 && (
                      <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
                    )}
                    {stats.confirmed > 0 && (
                      <div className="bg-amber-400 transition-all" style={{ width: `${(stats.confirmed / stats.total) * 100}%` }} />
                    )}
                    {stats.absent > 0 && (
                      <div className="bg-rose-400 transition-all" style={{ width: `${(stats.absent / stats.total) * 100}%` }} />
                    )}
                    {stats.cancelled > 0 && (
                      <div className="bg-slate-300 transition-all" style={{ width: `${(stats.cancelled / stats.total) * 100}%` }} />
                    )}
                  </div>
                  <div className="flex gap-3 mt-1.5 text-[10px] text-slate-400">
                    {stats.completed > 0 && <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {stats.completed} traités</span>}
                    {stats.confirmed > 0 && <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {stats.confirmed} en attente</span>}
                    {stats.absent > 0 && <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {stats.absent} absents</span>}
                    {stats.cancelled > 0 && <span className="inline-flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg> {stats.cancelled} annulés</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hourly distribution */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">Par heure</h2>
            <div className="flex items-end gap-2 h-32">
              {Object.entries(hourlyData).sort(([a], [b]) => parseInt(a) - parseInt(b)).map(([hour, count]) => (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-linear-to-t from-indigo-500 to-violet-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(count / maxHourly) * 100}%`, minHeight: "8px" }}
                  />
                  <span className="text-[10px] text-slate-400">{hour}h</span>
                  <span className="text-[10px] font-medium text-slate-600">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
