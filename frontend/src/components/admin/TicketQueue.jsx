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
      return { className: "bg-red-100 text-red-800", label: "En retard" };
    }
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      waiting: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      absent: "bg-red-100 text-red-800",
    };
    const labels = {
      pending: "En attente",
      waiting: "En cours",
      completed: "Terminé",
      absent: "Absent",
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
                      <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                        Retard {delay.minutes} min
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
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {ticket.responsible}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${badge.className}`}>
                    {ticket.status === "completed" && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {ticket.status === "absent" && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {(ticket.status === "pending" || (badge.label === "En retard")) && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    {ticket.status === "waiting" && <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>}
                    {badge.label}
                  </span>
                  <div className="flex gap-2">
                    {ticket.status === "pending" && (
                      <>
                        
                        <button
                          onClick={() => setConfirmAction({ show: true, ticketId: ticket.id, action: "complete" })}
                          className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Terminer
                        </button>
                        <button
                          onClick={() => setConfirmAction({ show: true, ticketId: ticket.id, action: "absent" })}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition inline-flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Absent
                        </button>
                      </>
                    )}
                    {ticket.status === "waiting" && (
                      <button
                        onClick={() => setConfirmAction({ show: true, ticketId: ticket.id, action: "complete" })}
                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition inline-flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Terminer
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
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
            Aucun ticket dans cette catégorie
          </div>
        )}
      </div>
    </div>
  );
};