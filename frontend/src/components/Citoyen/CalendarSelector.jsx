// frontend/src/components/Citoyen/CalendarSelector.jsx
import { useState, useEffect } from "react";

export const CalendarSelector = ({ onSelect, bookedSlots = [] }) => {
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
          const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          slots.push({ time: timeStr, available: true });
        }
      }
      setAvailableTimes(slots);
      setSelectedTime(null);
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const months = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      full: date.toISOString().split("T")[0],
      isToday: date.toDateString() === new Date().toDateString()
    };
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    onSelect({ date: selectedDate, time: time });
  };

  return (
    <div className="space-y-6">
      {/* Sélection de la date */}
      <div>
        <label className="block text-white/80 mb-3 text-sm font-medium">
          📅 Choisissez une date
        </label>
        <div className="grid grid-cols-7 gap-2">
          {availableDates.map((date, idx) => {
            const d = formatDate(date);
            const isSelected = selectedDate?.toISOString().split("T")[0] === d.full;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleDateSelect(date)}
                className={`
                  p-3 rounded-xl text-center transition-all duration-200
                  ${isSelected 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105" 
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }
                  ${d.isToday ? "ring-2 ring-yellow-400/50" : ""}
                `}
              >
                <div className="text-xs opacity-80">{d.day}</div>
                <div className="text-xl font-bold">{d.date}</div>
                <div className="text-xs opacity-60">{d.month}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sélection de l'heure */}
      {selectedDate && (
        <div>
          <label className="block text-white/80 mb-3 text-sm font-medium">
            ⏰ Choisissez une heure
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
            {availableTimes.map((slot, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleTimeSelect(slot.time)}
                className={`
                  p-2 rounded-lg text-center transition-all duration-200
                  ${selectedTime === slot.time
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md scale-105"
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                  }
                `}
              >
                {slot.time}
              </button>
            ))}
          </div>
          {selectedTime && (
            <div className="mt-3 text-center text-green-400 text-sm animate-pulse">
              ✓ Heure sélectionnée : {selectedTime}
            </div>
          )}
        </div>
      )}

      {/* Message si aucune date sélectionnée */}
      {!selectedDate && (
        <div className="text-center text-white/40 text-sm py-4">
          👆 Cliquez sur une date pour voir les horaires disponibles
        </div>
      )}
    </div>
  );
};