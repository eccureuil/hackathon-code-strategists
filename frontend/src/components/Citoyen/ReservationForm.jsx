// frontend/src/components/citoyen/ReservationForm.jsx
import { useState } from "react";

export const ReservationForm = ({
  user,
  services,
  onSubmit,
  bookedSlots,
  isLoading,
}) => {
  const [formData, setFormData] = useState({
    serviceId: "",
    motif: "",
    date: null,
    time: null,
  });
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setFormData((prev) => ({ ...prev, serviceId: service.id }));
    setStep(2);
  };

  const handleDateTimeSelect = (dateTime) => {
    setFormData((prev) => ({
      ...prev,
      date: dateTime.date,
      time: dateTime.time,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.serviceId && formData.date && formData.time && formData.motif) {
      onSubmit(formData);
    }
  };

  if (step === 1) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          📋 Choisissez votre service
        </h3>
        <div className="grid gap-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{service.icon || "📄"}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-800">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Durée estimée : {service.duration} min
                  </div>
                </div>
              </div>
              <div className="text-blue-500 group-hover:translate-x-1 transition">
                →
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const CalendarSelector = lazy(() => import("./CalendarSelector"));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service sélectionné */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{selectedService?.icon || "📄"}</span>
          <div>
            <div className="font-medium">{selectedService?.name}</div>
            <div className="text-sm text-gray-500">
              {selectedService?.duration} minutes
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-blue-500 text-sm hover:underline"
        >
          Modifier
        </button>
      </div>

      {/* Calendrier */}
      <CalendarSelector
        service={selectedService}
        onSelect={handleDateTimeSelect}
        bookedSlots={bookedSlots}
      />

      {/* Motif */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          💬 Motif de la demande
        </label>
        <textarea
          value={formData.motif}
          onChange={(e) => setFormData((prev) => ({ ...prev, motif: e.target.value }))}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          placeholder="Ex: Demande d'acte de naissance pour mon enfant..."
          required
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
        >
          Retour
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.date || !formData.time}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Réservation..." : "Confirmer la réservation"}
        </button>
      </div>
    </form>
  );
};