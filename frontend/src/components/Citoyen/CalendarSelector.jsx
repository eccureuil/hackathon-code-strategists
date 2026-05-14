// frontend/src/components/Citoyen/CalendarSelector.jsx
import { useState, useEffect } from "react";

export const CalendarSelector = ({ service, onSelect, bookedSlots = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

  // Générer les 7 prochains jours
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    setAvailableDates(days);
  }, []);

  // Générer les heures disponibles (8h-17h)
  useEffect(() => {
    if (selectedDate) {
      const slots = [];
      for (let hour = 8; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timeStr = `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`;
          slots.push({ time: timeStr, available: true });
        }
      }
      setAvailableTimes(slots);
    }
  }, [selectedDate]);

  const formatDate = (date) => ({
    day: date.toLocaleDateString("fr-FR", { weekday: "short" }),
    date: date.getDate(),
    month: date.toLocaleDateString("fr-FR", { month: "short" }),
    full: date.toISOString().split("T")[0],
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (slot) => {
    setSelectedTime(slot.time);
    onSelect({ date: selectedDate, time: slot.time });
  };

  return (
    <div className="space-y-6">
      {/* Sélection de la date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📅 Choisissez une date
        </label>
        <div className="grid grid-cols-4 gap-2">
          {availableDates.map((date, idx) => {
            const d = formatDate(date);
            const isSelected = selectedDate?.toISOString().split("T")[0] === d.full;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateSelect(date)}
                className={`p-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div className="text-xs capitalize">{d.day}</div>
                <div className="text-lg font-bold">{d.date}</div>
                <div className="text-xs">{d.month}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sélection de l'heure */}
      {selectedDate && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⏰ Choisissez une heure
          </label>
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {availableTimes.map((slot, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTimeSelect(slot)}
                className={`p-2 rounded-lg text-center transition-all ${
                  selectedTime === slot.time
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-gray-100 hover:bg-green-100"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};