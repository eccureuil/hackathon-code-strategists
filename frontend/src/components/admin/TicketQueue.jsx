// frontend/src/components/admin/TicketQueue.jsx
import { useState } from "react";
import { Phone, User, Calendar, Clock } from "lucide-react";

export const TicketQueue = ({ tickets, onMarkAbsent, onMarkCompleted }) => {
  const [filter, setFilter] = useState("all");
  const [confirmAction, setConfirmAction] = useState({ show: false, ticketId: null, action: null });

  const filters = [
    { id: "all", label: "Tous", count: tickets.length },
    { id: "pending", label: "En attente", count: tickets.filter((t) => t.status === "pending").length },
    { id: "waiting", label: "En cours", count: tickets.filter((t) => t.status === "waiting").length },
    { id: "completed", label: "Terminés", count: tickets.filter((t) => t.status === "completed").length },
    { id: "absent", label: "Absents", count: tickets.filter((t) => t.status === "absent").length },
  ];

  const filteredTickets = filter === "all" ? tickets : tickets.filter((t) => t.status === filter);

  const getDelayStatus = (ticketDate, ticketTime) => {
    if (!ticketDate || !ticketTime) return null;
    const now = new Date();
    const ticketDateTime = new Date(`${ticketDate}T${ticketTime}`);
    const diffMinutes = Math.floor((now - ticketDateTime) / 60000);
    if (diffMinutes >= 15 && ticketDateTime < now) {
      return { isLate: true, minutes: diffMinutes };
    }
    return { isLate: false };
  };

  const getStatusBadge = (status, isLate) => {
    if (isLate && status === "pending") {
      return { className: "bg-red-100 text-red-800", label: "⏰ En retard" };
    }
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

 const handleConfirm = () => {

  if (confirmAction.action === "complete") {
    onMarkCompleted(confirmAction.ticketId);
  }

  if (confirmAction.action === "absent") {
    onMarkAbsent(confirmAction.ticketId);
  }

  setConfirmAction({
    show: false,
    ticketId: null,
    action: null
  });
};
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Modal de confirmation */}
      {confirmAction.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirmation</h3>
            <p className="text-gray-600 mb-6">
            
              {confirmAction.action === "complete" && "Voulez-vous vraiment marquer ce ticket comme terminé ?"}
              {confirmAction.action === "absent" && "Voulez-vous vraiment marquer ce ticket comme absent ?"}
            </p>
            <div className="flex gap-3">
              <button onClick={handleConfirm} className="flex-1 py-2 bg-blue-500 text-white rounded-lg">
                Confirmer
              </button>
              <button onClick={() => setConfirmAction({ show: false, ticketId: null, action: null })} className="flex-1 py-2 bg-gray-300 rounded-lg">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres statut */}
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
        {filteredTickets.map((ticket) => {
          const delay = getDelayStatus(ticket.date, ticket.time);
          const badge = getStatusBadge(ticket.status, delay?.isLate);
          
          return (
            <div key={ticket.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
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
                    {delay?.isLate && (
                      <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full">
                        ⚠️ Retard {delay.minutes} min
                      </span>
                    )}
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

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                    {badge.label}
                  </span>
                  <div className="flex gap-2">
                    {ticket.status === "pending" && (
                      <>
                        
                        <button
                          onClick={() => setConfirmAction({ show: true, ticketId: ticket.id, action: "complete" })}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                        >
                          ✅ Terminer
                        </button>
                        <button
                          onClick={() => setConfirmAction({ show: true, ticketId: ticket.id, action: "absent" })}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                        >
                          ❌ Absent
                        </button>
                      </>
                    )}
                    {ticket.status === "waiting" && (
                      <button
                        onClick={() => setConfirmAction({ show: true, ticketId: ticket.id, action: "complete" })}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        ✅ Terminer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredTickets.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            📭 Aucun ticket dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
};