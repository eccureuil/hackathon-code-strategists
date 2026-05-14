// frontend/src/components/citoyen/CalendarSelector.jsx
import { useState, useEffect } from "react";

export const CalendarSelector = ({ service, onSelect, bookedSlots = [] }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Générer les 7 prochains jours
  const generateNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  // Vérifier si une date a des créneaux disponibles
  const checkDateAvailability = (date) => {
    // Simulation - à remplacer par appel API
    const dateStr = date.toISOString().split("T")[0];
    const bookedForDate = bookedSlots.filter(
      (slot) => slot.date === dateStr
    );
    const totalMinutesAvailable = 540; // 9h * 60
    const bookedMinutes = bookedForDate.reduce(
      (sum, slot) => sum + (slot.duration || 15),
      0
    );
    return totalMinutesAvailable - bookedMinutes >= (service?.duration || 15);
  };

  // Générer les heures disponibles (8h00 à 17h00 par tranches de 15 min)
  const generateTimeSlots = (date) => {
    const slots = [];
    const startHour = 8;
    const endHour = 17;
    const step = 15; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += step) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const isBooked = bookedSlots.some(
          (slot) => slot.date === date.toISOString().split("T")[0] && slot.time === timeStr
        );
        slots.push({ time: timeStr, available: !isBooked });
      }
    }
    return slots;
  };

  useEffect(() => {
    const days = generateNextDays();
    const available = days.filter((date) => checkDateAvailability(date));
    setAvailableDates(available);
  }, [bookedSlots, service]);

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      setTimeout(() => {
        const slots = generateTimeSlots(selectedDate);
        setAvailableTimes(slots);
        setLoading(false);
      }, 100);
    }
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    if (time.available) {
      setSelectedTime(time.time);
      onSelect({
        date: selectedDate,
        time: time.time,
      });
    }
  };

  const formatDate = (date) => {
    return {
      day: date.toLocaleDateString("fr-FR", { weekday: "short" }),
      date: date.getDate(),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      full: date.toISOString().split("T")[0],
    };
  };

  return (
    <div className="space-y-6">
      {/* Sélection de la date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📅 Choisissez une date
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {availableDates.map((date, idx) => {
            const dateInfo = formatDate(date);
            const isSelected =
              selectedDate?.toISOString().split("T")[0] === dateInfo.full;
            return (
              <button
                key={idx}
                onClick={() => handleDateSelect(date)}
                className={`p-3 rounded-xl text-center transition-all ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-lg scale-105"
                    : "bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
              >
                <div className="text-xs font-medium capitalize">
                  {dateInfo.day}
                </div>
                <div className="text-xl font-bold">{dateInfo.date}</div>
                <div className="text-xs">{dateInfo.month}</div>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {availableTimes.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTimeSelect(slot)}
                  disabled={!slot.available}
                  className={`p-2 rounded-lg text-center transition-all ${
                    selectedTime === slot.time
                      ? "bg-green-500 text-white shadow-md"
                      : slot.available
                      ? "bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50"
                      : "bg-gray-100 text-gray-400 line-through cursor-not-allowed"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};