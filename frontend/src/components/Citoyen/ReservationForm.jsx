// frontend/src/components/Citoyen/ReservationForm.jsx
import { useState } from "react";
import { CalendarSelector } from "./CalendarSelector";

const getCardStyle = (color) => {
  const styles = {
    pink:    "from-pink-500 to-rose-600 shadow-pink-500/30",
    purple:  "from-purple-500 to-indigo-600 shadow-purple-500/30",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
    blue:    "from-blue-500 to-cyan-600 shadow-blue-500/30",
    amber:   "from-amber-500 to-orange-600 shadow-amber-500/30",
    red:     "from-red-500 to-rose-600 shadow-red-500/30",
  };
  return styles[color] || styles.blue;
};

export const ReservationForm = ({ services, onSubmit, bookedSlots, isLoading }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({ serviceId: "", motif: "", date: null, time: null });

  const handleDateTimeSelect = (dateTime) => {
    setFormData(prev => ({ ...prev, date: dateTime.date, time: dateTime.time }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.serviceId && formData.date && formData.time && formData.motif) {
      onSubmit(formData);
    }
  };

  if (step === 1) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl animate-pulse">⏳</span>
          Choisissez votre service
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <button
              key={service.id}
              onClick={() => {
                setSelectedService(service);
                setFormData(prev => ({ ...prev, serviceId: service.id }));
                setStep(2);
              }}
              className={`group relative overflow-hidden bg-gradient-to-r ${getCardStyle(service.color)} p-0.5 rounded-2xl hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="relative bg-gray-900/90 backdrop-blur rounded-2xl p-5 h-full hover:bg-gray-900/70 transition">
                <div className="absolute top-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition" />
                <div className="text-5xl mb-3 animate-bounce group-hover:animate-none">{service.icon}</div>
                <h3 className="text-lg font-bold text-white mb-1">{service.name}</h3>
                <p className="text-white/50 text-sm mb-3">{service.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                    ⏱️ {service.duration} min
                  </span>
                  <span className="text-xs text-white/40">Gratuit</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-white/20 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-4xl animate-pulse">{selectedService?.icon}</span>
          <div>
            <h3 className="text-xl font-bold text-white">{selectedService?.name}</h3>
            <p className="text-white/50">Durée estimée : {selectedService?.duration} minutes</p>
          </div>
        </div>
        <button onClick={() => setStep(1)} className="text-white/60 hover:text-white transition text-sm">
          Modifier
        </button>
      </div>

      <CalendarSelector onSelect={handleDateTimeSelect} bookedSlots={bookedSlots} />

      <div className="mt-6">
        <label className="block text-white/80 mb-2">💬 Motif de la demande</label>
        <textarea
          value={formData.motif}
          onChange={(e) => setFormData(prev => ({ ...prev, motif: e.target.value }))}
          rows="3"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500 transition"
          placeholder="Ex: Demande d'acte de naissance..."
          required
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={() => setStep(1)} className="flex-1 px-4 py-3 border border-white/20 rounded-xl text-white hover:bg-white/10 transition">
          Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !formData.date || !formData.time}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:scale-105 transition-all disabled:opacity-50"
        >
          {isLoading ? "Réservation..." : "✅ Confirmer"}
        </button>
      </div>
    </div>
  );
};