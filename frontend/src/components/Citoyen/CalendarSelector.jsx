// frontend/src/components/Citoyen/CalendarSelector.jsx
import { useState, useEffect } from "react";

export const CalendarSelector = ({ service, onSelect, bookedSlots = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Générer les jours du mois
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const currentDate = new Date(year, month, i);
      days.push({ date: currentDate, isCurrentMonth: true });
    }
    
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  // Récupérer les créneaux disponibles depuis le backend - VERSION CORRIGÉE
  const fetchAvailableSlots = async (date) => {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split("T")[0];
      const response = await fetch(`http://localhost:3000/api/reservations/slots/${dateStr}`);
      const data = await response.json();
      setAvailableTimes(data.available || []);
    } catch (error) {
      console.error("Erreur chargement créneaux:", error);
      // Fallback : générer des créneaux par défaut
      const slots = [];
      for (let hour = 8; hour < 17; hour++) {
        ["00", "15", "30", "45"].forEach(min => {
          const time = `${hour}:${min}`;
          if (!bookedSlots.includes(time)) slots.push(time);
        });
      }
      setAvailableTimes(slots);
    } finally {
      setLoading(false); // ← CORRECTION : finally garantit que loading repasse à false
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
      setSelectedTime(null);
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    return {
      day: date.toLocaleDateString("fr-FR", { weekday: "short" }).toUpperCase(),
      number: date.getDate(),
      month: date.toLocaleDateString("fr-FR", { month: "short" }),
      full: date.toISOString().split("T")[0],
      isToday: date.toDateString() === new Date().toDateString(),
      isPast: date < new Date().setHours(0, 0, 0, 0)
    };
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(currentMonth.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = ["JANVIER", "FEVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOUT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DECEMBRE"];
  const weekDays = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

  return (
    <div className="space-y-6">
      {/* Calendrier */}
      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="text-white/60 hover:text-white text-2xl">◀</button>
          <h3 className="text-white font-bold text-lg">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <button onClick={() => changeMonth(1)} className="text-white/60 hover:text-white text-2xl">▶</button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-white/50 text-xs py-2">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            const d = formatDate(day.date);
            const isSelected = selectedDate?.toISOString().split("T")[0] === d.full;
            const isDisabled = d.isPast || !day.isCurrentMonth;
            
            return (
              <button
                key={idx}
                onClick={() => !isDisabled && setSelectedDate(day.date)}
                disabled={isDisabled}
                className={`
                  p-2 rounded-lg text-center transition-all
                  ${!day.isCurrentMonth ? "opacity-30" : ""}
                  ${isSelected ? "bg-blue-500 text-white shadow-lg scale-105" : "text-white hover:bg-white/10"}
                  ${d.isToday ? "ring-2 ring-yellow-400" : ""}
                  ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
                `}
              >
                <div className="text-sm">{d.number}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sélection de l'heure - Affiche uniquement les heures disponibles */}
      {selectedDate && (
        <div>
          <label className="block text-white/80 mb-3 text-sm font-medium">
            ⏰ Créneaux disponibles pour le {selectedDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
          </label>
          {loading ? (
            <div className="text-center py-4 text-white/50">Chargement des créneaux...</div>
          ) : availableTimes.length === 0 ? (
            <div className="text-center py-4 text-yellow-400 bg-yellow-400/10 rounded-lg">
              ⚠️ Aucun créneau disponible pour cette date
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-xl">
              {availableTimes.map((time, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedTime(time);
                    onSelect({ date: selectedDate, time: time });
                  }}
                  className={`
                    p-2 rounded-lg text-center transition-all
                    ${selectedTime === time
                      ? "bg-green-500 text-white shadow-md scale-105"
                      : "bg-white/10 text-white hover:bg-white/20"
                    }
                  `}
                >
                  {time}
                </button>
              ))}
            </div>
          )}
          {selectedTime && (
            <div className="mt-3 text-center text-green-400 text-sm animate-pulse">
              ✓ Rendez-vous confirmé le {selectedDate.toLocaleDateString("fr-FR")} à {selectedTime}
            </div>
          )}
        </div>
      )}

      {!selectedDate && (
        <div className="text-center text-white/40 text-sm py-4">
          📅 Sélectionnez une date dans le calendrier
        </div>
      )}
    </div>
  );
};