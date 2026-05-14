// frontend/src/components/citoyen/TicketView.jsx
import { useRef } from "react";
import QRCode from "qrcode.react";

export const TicketView = ({ ticket, onCancel, onAcceptOffer, pendingOffer }) => {
  const ticketRef = useRef();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return time;
  };

  const downloadTicket = () => {
    // Fonction pour télécharger le ticket en image
    const element = ticketRef.current;
    // Implémentation avec html2canvas si besoin
  };

  return (
    <div className="space-y-4">
      {/* Offre de créneau libéré */}
      {pendingOffer && (
        <div className="bg-yellow-50 border border-yellow-400 rounded-xl p-4 animate-pulse">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⏰</span>
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">
                Un créneau s'est libéré !
              </p>
              <p className="text-sm text-yellow-700">
                Un rendez-vous à {pendingOffer.time} est disponible.
                Voulez-vous avancer votre heure ?
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => onAcceptOffer(pendingOffer)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                >
                  ✅ Accepter et avancer
                </button>
                <button
                  onClick={() => onAcceptOffer(null, false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
                >
                  Garder mon heure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket principal */}
      <div
        ref={ticketRef}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center text-white">
            <div>
              <div className="text-xs opacity-80">MAIRIE DE FIANARANTSOA</div>
              <div className="text-xl font-bold">Ticket de réservation</div>
            </div>
            <div className="text-right">
              <div className="text-xs opacity-80">N°</div>
              <div className="text-2xl font-mono font-bold">{ticket.number}</div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-4">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <QRCode
                value={JSON.stringify({
                  id: ticket.id,
                  number: ticket.number,
                  citizen: ticket.citizenName,
                  service: ticket.serviceName,
                  date: ticket.date,
                  time: ticket.time,
                })}
                size={120}
                level="H"
              />
            </div>
          </div>

          {/* Infos ticket */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500 text-xs">Citoyen</div>
              <div className="font-medium">{ticket.citizenName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Service</div>
              <div className="font-medium">{ticket.serviceName}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Responsable</div>
              <div className="font-medium">
                {ticket.responsibleName || "À assigner"}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Guichet</div>
              <div className="font-medium">{ticket.counter || "—"}</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-500 text-xs">Date</div>
              <div className="font-medium">{formatDate(ticket.date)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Heure</div>
              <div className="text-xl font-bold text-blue-600">
                {formatTime(ticket.time)}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-xs">Durée estimée</div>
              <div className="font-medium">{ticket.duration} minutes</div>
            </div>
            <div className="col-span-2">
              <div className="text-gray-500 text-xs">Motif</div>
              <div className="text-sm">{ticket.motif}</div>
            </div>
          </div>

          {/* Rappel */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <p className="text-amber-800 text-sm">
              ⚠️ Veuillez vous présenter au guichet{" "}
              <span className="font-bold">15 minutes avant</span> votre rendez-vous
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between text-xs text-gray-500">
          <span>Généré le {new Date().toLocaleString()}</span>
          <span>Mairie de Fianarantsoa</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={downloadTicket}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
        >
          📥 Télécharger
        </button>
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          ❌ Annuler
        </button>
      </div>
    </div>
  );
};