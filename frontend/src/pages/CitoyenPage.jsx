import { useEffect, useState } from "react";
import { ReservationForm } from "../components/Citoyen/ReservationForm";
import { TicketView } from "../components/Citoyen/TicketView";
import { Toast } from "../components/common/Toast";

export const CitoyenPage = ({ user }) => {
  const [tab, setTab] = useState("reserve");

  const [services, setServices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [activeTicket, setActiveTicket] = useState(null);
  const [toast, setToast] = useState(null);

  // 🔄 LOAD SERVICES FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:3000/api/services")
      .then(res => res.json())
      .then(setServices);
  }, []);

  // 🔄 LOAD USER TICKETS
  useEffect(() => {
    if (!user?.phone) return;

    fetch(`http://localhost:3000/api/reservations/citizen/phone/${user.phone}`)
      .then(res => res.json())
      .then(setTickets);
  }, [user]);

  // 🔄 LOAD NOTIFICATIONS
  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:3000/api/notifications/${user.id}`)
      .then(res => res.json())
      .then(setNotifications);
  }, [user]);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🎯 RESERVATION
  const handleReservation = async (formData) => {
    const res = await fetch("http://localhost:3000/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        citizenName: user?.name,
        citizenPhone: user?.phone
      })
    });

    const data = await res.json();

    if (res.ok) {
      setActiveTicket(data);
      setTab("tickets");
      showToast("Réservation confirmée ✅", "success");
    } else {
      showToast(data.error, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 bg-white shadow">

        <h1 className="font-bold text-lg">🏛️ E-Mairie</h1>

        {/* NAV */}
        <div className="flex gap-4 items-center">

          <button onClick={() => setTab("reserve")}>
            ➕ Réserver
          </button>

          <button onClick={() => setTab("tickets")}>
            🎫 Tickets
          </button>

          {/* 🔔 NOTIF */}
          <button onClick={() => setTab("notif")} className="relative">
            🔔
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* BODY */}
      <div className="p-4">

        {/* RESERVATION */}
        {tab === "reserve" && (
          <ReservationForm
            services={services}
            onSubmit={handleReservation}
          />
        )}

        {/* TICKETS */}
        {tab === "tickets" && (
          <div className="space-y-4">
            {tickets.map(t => (
              <TicketView key={t._id} ticket={t} />
            ))}
          </div>
        )}

        {/* NOTIFICATIONS */}
        {tab === "notif" && (
          <div className="space-y-2">
            {notifications.length === 0 && (
              <p>Aucune notification</p>
            )}

            {notifications.map(n => (
              <div key={n._id} className="p-3 bg-white shadow rounded">
                {n.message}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* TOAST */}
      {toast && (
        <Toast message={toast.msg} type={toast.type} />
      )}
    </div>
  );
};