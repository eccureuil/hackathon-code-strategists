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
    { id: 1, name: "Acte de naissance", duration: 15, icon: "👶", gradient: "from-pink-500 to-rose-600", shadow: "shadow-pink-500/30", description: "Premier acte d'état civil" },
    { id: 2, name: "Acte de mariage", duration: 20, icon: "💍", gradient: "from-purple-500 to-indigo-600", shadow: "shadow-purple-500/30", description: "Mariage civil" },
    { id: 3, name: "Certificat de résidence", duration: 20, icon: "🏠", gradient: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/30", description: "Justificatif de domicile" },
    { id: 4, name: "Carte d'identité", duration: 25, icon: "🆔", gradient: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/30", description: "CNI nouvelle génération" },
    { id: 5, name: "Légalisation signature", duration: 10, icon: "✍️", gradient: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/30", description: "Authentification de document" },
    { id: 6, name: "Passeport", duration: 30, icon: "🛂", gradient: "from-red-500 to-rose-600", shadow: "shadow-red-500/30", description: "Passeport biométrique" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      
      {/* Cercles décoratifs animés */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500" />
      
      {/* Header glassmorphism */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-bounce">
                <span className="text-2xl">🏛️</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Mairie de Fianarantsoa
                </h1>
                <p className="text-xs text-white/50">Service de réservation en ligne</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-3 py-2 hover:bg-white/20 transition-all hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm text-white font-bold">{user?.name?.charAt(0) || "J"}</span>
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-sm font-medium text-white">{user?.name || "Citoyen"}</div>
                <div className="text-xs text-white/50">{user?.phone || "034 12 345 67"}</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal avec animation */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in" onClick={() => setShowProfile(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-gradient-to-br from-white to-gray-100 rounded-2xl max-w-md w-full p-6 animate-slide-up shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto text-4xl shadow-lg animate-pulse">
                👤
              </div>
              <h3 className="text-xl font-bold mt-4 text-gray-800">{user?.name || "RAKOTO Jean"}</h3>
              <p className="text-gray-500">{user?.email || "jean.rakoto@email.com"}</p>
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <p className="text-sm"><span className="font-medium">📱 Téléphone :</span> {user?.phone || "034 12 345 67"}</p>
                <p className="text-sm mt-1"><span className="font-medium">🆔 CIN :</span> {user?.cin || "123 456 789 012"}</p>
              </div>
              <button className="mt-4 w-full py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg hover:scale-105 transition-transform">
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section avec animation */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 animate-gradient" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 mb-6 animate-bounce">
            <span className="text-yellow-400 text-xl">⭐</span>
            <span className="text-sm text-white font-medium">Service rapide et simplifié</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Prenez rendez-vous en
            <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent"> quelques clics</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Choisissez votre service, sélectionnez un créneau et obtenez votre ticket.
            Plus besoin de faire la queue à la mairie !
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {!hasReservation ? (
          <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
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