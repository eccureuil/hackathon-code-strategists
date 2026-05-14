
import { useState } from "react";
import { CalendarSelector } from "../components/Citoyen/CalendarSelector";


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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => {
              setSelectedService(service);
              setFormData(prev => ({ ...prev, serviceId: service.id }));
              setStep(2);
            }}
            className="group relative bg-white/5 backdrop-blur rounded-2xl p-6 text-left hover:bg-white/10 transition-all hover:scale-105 border border-white/10"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${service.color} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition`} />
            <div className="relative">
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-1">{service.name}</h3>
              <p className="text-white/50 text-sm mb-3">{service.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-white/10 rounded-full px-3 py-1 text-white/70">⏱️ {service.duration} min</span>
                <span className="text-white/40">•</span>
                <span className="text-white/50">Gratuit</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
      {/* Service sélectionné */}
      <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl mb-6">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{selectedService?.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{selectedService?.name}</h3>
            <p className="text-white/50 text-sm">Durée estimée : {selectedService?.duration} minutes</p>
          </div>
        </div>
        <button onClick={() => setStep(1)} className="text-white/60 hover:text-white transition">Modifier</button>
      </div>

      <CalendarSelector service={selectedService} onSelect={handleDateTimeSelect} bookedSlots={bookedSlots} />

      {/* Motif */}
      <div className="mt-6">
        <label className="block text-white/80 mb-2">💬 Motif de la demande</label>
        <textarea
          value={formData.motif}
          onChange={(e) => setFormData(prev => ({ ...prev, motif: e.target.value }))}
          rows="3"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
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
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-semibold hover:opacity-90 disabled:opacity-50 transition"
        >
          {isLoading ? "Réservation..." : "✅ Confirmer la réservation"}
        </button>
      </div>
    </div>
  );
};