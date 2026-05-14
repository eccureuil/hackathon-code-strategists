// frontend/src/components/admin/TicketQueue.jsx
import { useState } from "react";
import { Phone, User, Calendar, Clock, Search } from "lucide-react";

export const TicketQueue = ({ tickets, onMarkAbsent, onMarkCompleted }) => {
  const [filter, setFilter] = useState("all");
  const [searchLocal, setSearchLocal] = useState("");

  const filters = [
    { id: "all", label: "Tous", count: tickets.length },
    { id: "pending", label: "En attente", count: tickets.filter((t) => t.status === "pending").length },
    { id: "waiting", label: "En cours", count: tickets.filter((t) => t.status === "waiting").length },
    { id: "completed", label: "Terminés", count: tickets.filter((t) => t.status === "completed").length },
    { id: "absent", label: "Absents", count: tickets.filter((t) => t.status === "absent").length },
  ];

  // Filtrage par statut + recherche locale
  const filteredByStatus = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);
  
  const filteredTickets = filteredByStatus.filter((ticket) => {
    if (!searchLocal) return true;
    const searchLower = searchLocal.toLowerCase();
    return (
      ticket.number?.toLowerCase().includes(searchLower) ||
      ticket.citizenName?.toLowerCase().includes(searchLower) ||
      ticket.citizenPhone?.toLowerCase().includes(searchLower) ||
      ticket.service?.toLowerCase().includes(searchLower)
    );
  });

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Barre de recherche locale */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par n° ticket, nom, téléphone ou service..."
            value={searchLocal}
            onChange={(e) => setSearchLocal(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

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

      {/* Résultat de recherche */}
      {searchLocal && (
        <div className="px-4 py-2 bg-blue-50 text-blue-600 text-sm border-b border-blue-100">
          🔍 {filteredTickets.length} résultat(s) trouvé(s) pour "{searchLocal}"
        </div>
      )}

      {/* Liste des tickets */}
      <div className="divide-y divide-gray-100">
        {filteredTickets.map((ticket, idx) => {
          const badge = getStatusBadge(ticket.status);
          return (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Partie gauche - Ticket info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-xl font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                      {ticket.number}
                    </div>
                    <div className="font-semibold text-gray-800 flex items-center gap-1">
                      <User className="w-4 h-4 text-gray-400" />
                      {ticket.citizenName}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {ticket.citizenPhone || "Non renseigné"}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(ticket.date) || "Aujourd'hui"}
                    </span>
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ticket.time}
                    </span>
                    <span className="text-gray-500">
                      {ticket.service} • {ticket.duration} min
                    </span>
                    {ticket.responsible && (
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        👨‍💼 {ticket.responsible}
                      </span>
                    )}
                  </div>
                </div>

                {/* Partie droite - Actions */}
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                  
                  <div className="flex gap-2">
                    {ticket.status === "pending" && (
                      <>
                        <button
                          onClick={() => onMarkCompleted(ticket.id)}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1"
                        >
                          ✅ Terminer
                        </button>
                        <button
                          onClick={() => onMarkAbsent(ticket.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1"
                        >
                          ❌ Absent
                        </button>
                      </>
                    )}
                    {ticket.status === "waiting" && (
                      <button
                        onClick={() => onMarkCompleted(ticket.id)}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition flex items-center gap-1"
                      >
                        ✅ Terminer
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Barre de progression */}
              {ticket.status === "waiting" && (
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "45%" }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">En cours de traitement...</p>
                </div>
              )}
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            {searchLocal ? (
              <>🔍 Aucun ticket ne correspond à "{searchLocal}"</>
            ) : (
              <>📭 Aucun ticket dans cette catégorie</>
            )}
          </div>
        )}
      </div>
    </div>
  );
};