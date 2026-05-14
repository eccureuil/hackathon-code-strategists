// frontend/src/components/Citoyen/CalendarSelector.jsx
import { useState, useEffect } from "react";

export const CalendarSelector = ({ onSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);

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
    }
  }, [selectedDate]);

  const formatDate = (date) => ({
    day: date.toLocaleDateString("fr-FR", { weekday: "short" }).charAt(0).toUpperCase() + 
         date.toLocaleDateString("fr-FR", { weekday: "short" }).slice(1),
    date: date.getDate(),
    month: date.toLocaleDateString("fr-FR", { month: "short" }),
  });

  return (
    <div>
      <label className="block text-white/80 mb-2">📅 Choisissez une date</label>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-6">
        {availableDates.map((date, idx) => {
          const d = formatDate(date);
          const isSelected = selectedDate?.getDate() === date.getDate();
          return (
            <button
              key={idx}
              onClick={() => setSelectedDate(date)}
              className={`p-3 rounded-xl text-center transition-all ${
                isSelected ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <div className="text-xs opacity-80">{d.day}</div>
              <div className="text-2xl font-bold">{d.date}</div>
              <div className="text-xs opacity-60">{d.month}</div>
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <>
          <label className="block text-white/80 mb-2">⏰ Choisissez une heure</label>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2">
            {availableTimes.map((slot, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedTime(slot.time);
                  onSelect({ date: selectedDate, time: slot.time });
                }}
                className={`p-2 rounded-lg text-center transition-all ${
                  selectedTime === slot.time
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};