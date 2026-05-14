// frontend/src/pages/CitoyenPage.jsx
import { useState } from "react";
import { ReservationForm } from "../components/Citoyen/ReservationForm";
import { TicketView } from "../components/Citoyen/TicketView";
import { Toast } from "../components/common/Toast";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export const CitoyenPage = ({ user }) => {
  const [activeTicket, setActiveTicket] = useState(null);
  const [hasReservation, setHasReservation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [services] = useState([
    { id: 1, name: "Acte de naissance", duration: 15, icon: "👶", color: "from-pink-500 to-rose-500", description: "Premier acte d'état civil" },
    { id: 2, name: "Acte de mariage", duration: 20, icon: "💍", color: "from-purple-500 to-indigo-500", description: "Mariage civil" },
    { id: 3, name: "Certificat de résidence", duration: 20, icon: "🏠", color: "from-emerald-500 to-teal-500", description: "Justificatif de domicile" },
    { id: 4, name: "Carte d'identité", duration: 25, icon: "🆔", color: "from-blue-500 to-cyan-500", description: "CNI nouvelle génération" },
    { id: 5, name: "Légalisation signature", duration: 10, icon: "✍️", color: "from-amber-500 to-orange-500", description: "Authentification de document" },
    { id: 6, name: "Passeport", duration: 30, icon: "🛂", color: "from-red-500 to-rose-500", description: "Passeport biométrique" },
  ]);
  const [bookedSlots] = useState([]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleReservation = async (formData) => {
    setLoading(true);
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

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Header avec effet glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Mairie de Fianarantsoa
                </h1>
                <p className="text-xs text-white/60">Service de réservation en ligne</p>
              </div>
            </div>
            
            {/* Profile Button */}
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-3 py-2 hover:bg-white/20 transition"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-sm text-white">{user?.name?.charAt(0) || "J"}</span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name || "Citoyen"}</div>
                <div className="text-xs text-white/50">{user?.phone || "034 12 345 67"}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowProfile(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto text-3xl">
                👤
              </div>
              <h3 className="text-xl font-bold mt-4">{user?.name || "RAKOTO Jean"}</h3>
              <p className="text-gray-500">{user?.email || "jean.rakoto@email.com"}</p>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm"><span className="font-medium">📱 Téléphone :</span> {user?.phone || "034 12 345 67"}</p>
                <p className="text-sm mt-1"><span className="font-medium">🆔 CIN :</span> {user?.cin || "123 456 789 012"}</p>
              </div>
              <button className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg">Déconnexion</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm text-white/80">Service rapide et simplifié</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Prenez rendez-vous en
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> quelques clics</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Choisissez votre service, sélectionnez un créneau et obtenez votre ticket en ligne.
            Plus besoin de faire la queue à la mairie !
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        {!hasReservation ? (
          <ReservationForm
            user={user}
            services={services}
            onSubmit={handleReservation}
            bookedSlots={bookedSlots}
            isLoading={loading}
          />
        ) : (
          <TicketView
            ticket={activeTicket}
            onCancel={handleCancelReservation}
            onAcceptOffer={null}
            pendingOffer={null}
          />
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};