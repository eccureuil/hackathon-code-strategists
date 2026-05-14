import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../components/ui/Toast";
import Button from "../components/ui/Button";
import Card, { GlassCard } from "../components/ui/Card";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { StatusBadge } from "../components/ui/Badge";
import { TicketCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { API_BASE } from "../services/api";

const services = [
  { id: 1, name: "État Civil", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>, color: "from-indigo-500 to-violet-600" },
  { id: 2, name: "Permis de Construire", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, color: "from-violet-500 to-purple-600" },
  { id: 3, name: "Affaires Sociales", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>, color: "from-purple-500 to-pink-600" },
  { id: 4, name: "Services Techniques", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>, color: "from-blue-500 to-cyan-600" },
  { id: 5, name: "Registre Commerce", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, color: "from-emerald-500 to-teal-600" },
  { id: 6, name: "Contentieux", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>, color: "from-amber-500 to-orange-600" },
];

function generateTimeSlots() {
  const slots = [];
  for (let h = 8; h < 17; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    }
  }
  return slots;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function CitoyenPage() {
  const [activeTab, setActiveTab] = useState("reserve");
  const [step, setStep] = useState("service");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", motif: "" });
  const [submitting, setSubmitting] = useState(false);
  const [lastTicket, setLastTicket] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (selectedService && selectedDate) {
      setLoadingSlots(true);
      setSelectedTime(null);
      fetch(`${API_BASE}/api/reservations/slots/${selectedDate}`)
        .then((r) => r.json())
        .then((data) => setAvailableSlots(data.available || []))
        .catch(() => setAvailableSlots(generateTimeSlots()))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedService, selectedDate]);

  const handleSelectService = (svc) => {
    setSelectedService(svc);
    setStep("datetime");
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.motif) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          serviceName: selectedService.name,
          date: selectedDate,
          time: selectedTime,
          motif: form.motif,
          citizenName: form.name,
          citizenPhone: form.phone,
          citizenEmail: form.email,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erreur lors de la réservation");
      }
      const ticket = await res.json();
      setLastTicket(ticket);
      setShowConfirm(true);
      setForm({ name: "", phone: "", email: "", motif: "" });
      setStep("service");
      setSelectedService(null);
      setSelectedTime(null);
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservations`);
      const data = await res.json();
      setMyTickets(data.slice(0, 20));
    } catch {
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (activeTab === "mytickets") loadTickets();
  }, [activeTab]);

  const tabs = [
    { id: "reserve", label: "Prendre un ticket", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> },
    { id: "mytickets", label: "Mes tickets", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "reserve" && (
        <div className="space-y-6">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs font-medium">
            {["service", "datetime", "info"].map((s, i) => {
              const isComplete = ["datetime", "info"].indexOf(step) >= i;
              const isCurrent = step === s;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 ${isCurrent ? "text-indigo-700" : isComplete ? "text-indigo-500" : "text-slate-400"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 scale-110"
                        : isComplete
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-400"
                    }`}>
                      {isComplete && step !== s ? "✓" : i + 1}
                    </div>
                    <span className={`hidden sm:inline ${isCurrent ? "font-semibold" : ""}`}>
                      {s === "service" ? "Service" : s === "datetime" ? "Date & Heure" : "Informations"}
                    </span>
                  </div>
                  {i < 2 && (
                    <div className={`w-8 sm:w-12 h-px ${isComplete ? "bg-indigo-300" : "bg-slate-200"}`} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Service selection */}
          {step === "service" && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-slate-800">Choisissez un service</h3>
              <div className="grid gap-3">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    onClick={() => handleSelectService(svc)}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all text-left group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${svc.color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 flex-shrink-0`}>
                      {svc.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{svc.name}</p>
                    </div>
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === "datetime" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${selectedService?.color} flex items-center justify-center text-lg shadow-sm`}>
                    {selectedService?.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{selectedService?.name}</h3>
                    <p className="text-xs text-slate-400">Choisissez votre créneau</p>
                  </div>
                </div>
                <button onClick={() => setStep("service")} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Changer →
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:border-indigo-400 focus:shadow-lg focus:shadow-indigo-500/10 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  {loadingSlots ? "Chargement..." : "Créneaux disponibles"}
                </label>
                {loadingSlots ? (
                  <div className="grid grid-cols-4 gap-2">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-10 rounded-xl skeleton-shimmer" />
                    ))}
                  </div>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-slate-400">Aucun créneau disponible pour cette date.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all cursor-pointer ${
                          selectedTime === slot
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm scale-[1.02]"
                            : "border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/50"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button fullWidth disabled={!selectedTime} onClick={() => setStep("info")} size="lg">
                Continuer →
              </Button>
            </div>
          )}

          {/* Step 3: Personal info */}
          {step === "info" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">Vos informations</h3>
                <button onClick={() => setStep("datetime")} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                  Modifier →
                </button>
              </div>

              <GlassCard className="!p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{selectedService?.icon}</span>
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{selectedService?.name}</p>
                    <p className="text-xs text-slate-500">{selectedDate} à {selectedTime}</p>
                  </div>
                </div>
              </GlassCard>

              <Input
                label="Nom complet"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                }
              />
              <Input
                label="Téléphone"
                name="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
              />
              <Input
                label="Email (optionnel)"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <Input
                label="Motif de la visite"
                name="motif"
                value={form.motif}
                onChange={(e) => setForm({ ...form, motif: e.target.value })}
                required
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                }
              />

              <Button fullWidth loading={submitting} onClick={handleSubmit} size="lg">
                Confirmer la réservation
              </Button>
            </div>
          )}

          {/* Confirmation modal - Boarding pass style */}
          <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="" size="md">
            {lastTicket && (
              <div className="text-center space-y-0 -mx-6 -mb-4">
                {/* Boarding pass top */}
                <div className="bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 p-6 sm:p-8">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider mb-1">Réservation confirmée</p>
                  <p className="text-4xl sm:text-5xl font-bold text-white ticket-number tracking-wider mb-2">{lastTicket.ticketNumber}</p>
                  <p className="text-indigo-200 text-xs">Votre numéro de ticket</p>
                </div>

                {/* Tear line */}
                <div className="tear-line" />

                {/* Boarding pass body */}
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Service</p>
                      <p className="font-medium text-slate-800">{lastTicket.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Statut</p>
                      <StatusBadge status={lastTicket.status} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</p>
                      <p className="font-medium text-slate-800">{lastTicket.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Heure</p>
                      <p className="font-medium text-slate-800">{lastTicket.time}</p>
                    </div>
                  </div>

                  {lastTicket.citizenName && (
                    <div className="border-t border-slate-100 pt-4 text-left">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Citoyen</p>
                      <p className="text-sm font-medium text-slate-800">{lastTicket.citizenName}</p>
                    </div>
                  )}

                  {/* QR placeholder */}
                  <div className="flex justify-center pt-2">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400">Veuillez arriver 15 minutes avant votre rendez-vous</p>

                  <div className="flex gap-2 pt-2">
                    <Link to="/my-tickets" className="flex-1">
                      <Button fullWidth variant="secondary">Voir mes tickets</Button>
                    </Link>
                    <Button fullWidth onClick={() => { setShowConfirm(false); setActiveTab("reserve"); }}>
                      Fermer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      )}

      {activeTab === "mytickets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Mes tickets</h3>
            <button onClick={loadTickets} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>

          {loadingTickets ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <TicketCardSkeleton key={i} />)}
            </div>
          ) : myTickets.length === 0 ? (
            <EmptyState
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>}
              title="Aucun ticket"
              description="Vous n'avez pas encore de ticket. Prenez-en un dès maintenant !"
              action={
                <Link to="/ticket">
                  <Button variant="primary" size="sm">Prendre un ticket</Button>
                </Link>
              }
            />
          ) : (
            <div className="space-y-3">
              {myTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TicketCard({ ticket }) {
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Annuler ce ticket ?")) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/api/reservations/${ticket._id}/cancel`, { method: "PUT" });
      if (res.ok) {
        showToast("Ticket annulé", "success");
        ticket.status = "cancelled";
      }
    } catch {
      showToast("Erreur lors de l'annulation", "error");
    } finally {
      setCancelling(false);
    }
  };

  const isPast = new Date(`${ticket.date}T${ticket.time}`) < new Date() && ticket.status === "confirmed";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all animate-scale-in">
      <div className="bg-linear-to-r from-indigo-600 to-violet-600 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-indigo-200 text-xs font-medium uppercase tracking-wider">{ticket.serviceName}</span>
          <StatusBadge status={isPast ? "absent" : ticket.status} />
        </div>
        <p className="text-2xl sm:text-3xl font-bold text-white ticket-number tracking-wider">{ticket.ticketNumber}</p>
      </div>
      <div className="tear-line" />
      <div className="p-4 sm:p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Citoyen</p>
            <p className="text-slate-800 font-medium">{ticket.citizenName}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Téléphone</p>
            <p className="text-slate-800">{ticket.citizenPhone}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Date</p>
            <p className="text-slate-800">{ticket.date}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Heure</p>
            <p className="text-slate-800">{ticket.time}</p>
          </div>
        </div>

        {ticket.motif && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Motif</p>
            <p className="text-sm text-slate-600">{ticket.motif}</p>
          </div>
        )}

        {ticket.responsibleName && ticket.responsibleName !== "À assigner" && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
              {ticket.responsibleName.charAt(0)}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Responsable</p>
              <p className="text-sm text-slate-700">{ticket.responsibleName}</p>
            </div>
          </div>
        )}

        {ticket.status === "confirmed" && !isPast && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="w-full mt-2 py-2.5 rounded-xl text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelling ? "Annulation..." : "Annuler ce ticket"}
          </button>
        )}
      </div>
    </div>
  );
}
