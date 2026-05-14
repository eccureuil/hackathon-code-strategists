// frontend/src/components/admin/TicketQueue.jsx
import { useState } from "react";

export const TicketQueue = ({ tickets, onMarkAbsent, onMarkCompleted }) => {
  const [filter, setFilter] = useState("all");

  const filters = [
    { id: "all", label: "Tous", count: tickets.length },
    { id: "pending", label: "En attente", count: tickets.filter((t) => t.status === "pending").length },
    { id: "waiting", label: "En cours", count: tickets.filter((t) => t.status === "waiting").length },
    { id: "completed", label: "Terminés", count: tickets.filter((t) => t.status === "completed").length },
    { id: "absent", label: "Absents", count: tickets.filter((t) => t.status === "absent").length },
  ];

  const filteredTickets =
    filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      waiting: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "⏳ En attente",
      waiting: "🔄 En cours",
      completed: "✅ Terminé",
      absent: "❌ Absent",
    };
    return { className: badges[status] || "bg-gray-100", label: labels[status] || status };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Filtres */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                filter === f.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Liste des tickets */}
      <div className="divide-y divide-gray-100">
        {filteredTickets.map((ticket, idx) => {
          const badge = getStatusBadge(ticket.status);
          return (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-mono font-bold text-gray-400">
                    {ticket.number}
                  </div>
                  <div>
                    <div className="font-medium">{ticket.citizenName}</div>
                    <div className="text-sm text-gray-500">
                      {ticket.service} • {ticket.duration} min
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-lg font-medium text-blue-600">{ticket.time}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex gap-2">
                  {ticket.status === "pending" && (
                    <>
                      <button
                        onClick={() => onMarkCompleted(ticket.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                      >
                        ✅ Terminer
                      </button>
                      <button
                        onClick={() => onMarkAbsent(ticket.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        ❌ Absent
                      </button>
                    </>
                  )}
                  {ticket.status === "waiting" && (
                    <button
                      onClick={() => onMarkCompleted(ticket.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                    >
                      ✅ Terminer
                    </button>
                  )}
                </div>
              </div>

              {/* Barre de progression (pour le ticket en cours) */}
              {ticket.status === "waiting" && (
                <div className="mt-3">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "45%" }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">En traitement...</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            Aucun ticket dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
};