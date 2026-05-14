
import { useState, useEffect } from "react";
import { ReservationForm } from "../components/Citoyen/ReservationForm";  // ← Citoyen avec C majuscule
import { TicketView } from "../components/Citoyen/TicketView";            // ← Citoyen avec C majuscule
import { Toast } from "../components/common/Toast";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export const CitoyenPage = ({ user }) => {
  const [activeTicket, setActiveTicket] = useState(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [services, setServices] = useState([
    { id: 1, name: "Acte de naissance", duration: 15, icon: "🍼", price: 0 },
    { id: 2, name: "Acte de mariage", duration: 20, icon: "💍", price: 0 },
    { id: 3, name: "Certificat de résidence", duration: 20, icon: "🏠", price: 0 },
    { id: 4, name: "Carte d'identité", duration: 25, icon: "🪪", price: 0 },
    { id: 5, name: "Légalisation signature", duration: 10, icon: "✍️", price: 0 },
    { id: 6, name: "Passeport", duration: 30, icon: "🛂", price: 0 },
  ]);
  const [bookedSlots, setBookedSlots] = useState([]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReservation = async (formData) => {
    setLoading(true);
    // Simulation appel API
    setTimeout(() => {
      const newTicket = {
        id: Date.now(),
        number: `TKT-${Date.now()}`,
        citizenName: user?.name || "RAKOTO Jean",
        citizenId: user?.id || "CIN-123456",
        serviceId: formData.serviceId,
        serviceName: services.find((s) => s.id === formData.serviceId)?.name,
        date: formData.date.toISOString().split("T")[0],
        time: formData.time,
        duration: services.find((s) => s.id === formData.serviceId)?.duration,
        motif: formData.motif,
        responsibleName: "Mme Rasoa",
        counter: "Guichet 2",
        status: "confirmed",
      };
      setActiveTicket(newTicket);
      setHasReservation(true);
      showToast("✅ Réservation confirmée !", "success");
      setLoading(false);
    }, 1000);
  };

  const handleCancelReservation = async () => {
    if (confirm("Voulez-vous vraiment annuler votre réservation ?")) {
      setLoading(true);
      setTimeout(() => {
        setActiveTicket(null);
        setHasReservation(false);
        showToast("❌ Réservation annulée", "error");
        setLoading(false);
      }, 500);
    }
  };

  const handleAcceptOffer = async (offer) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTicket((prev) => ({
        ...prev,
        time: offer.time,
      }));
      showToast(`✅ Rendez-vous avancé à ${offer.time} !`, "success");
      setLoading(false);
    }, 500);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                🎫 Mairie de Fianarantsoa
              </h1>
              <p className="text-sm text-gray-500">Service de réservation en ligne</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">{user?.name || "Citoyen"}</div>
              <div className="text-xs text-gray-400">{user?.phone || "034 12 345 67"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {!hasReservation ? (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <ReservationForm
              user={user}
              services={services}
              onSubmit={handleReservation}
              bookedSlots={bookedSlots}
              isLoading={loading}
            />
          </div>
        ) : (
          <TicketView
            ticket={activeTicket}
            onCancel={handleCancelReservation}
            onAcceptOffer={handleAcceptOffer}
            pendingOffer={null}
          />
        )}
      </div>

      {/* Toast notifications */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};