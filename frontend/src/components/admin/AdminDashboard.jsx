// frontend/src/components/admin/AdminDashboard.jsx
import { useState } from "react";
import { TicketQueue } from "./TicketQueue";
import { ResponsibleManager } from "./ResponsibleManager";
import { StatisticsCard } from "./StatisticsCard";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [tickets, setTickets] = useState([
    {
      id: 1,
      number: "#001",
      citizenName: "Rakoto Jean",
      service: "Acte de naissance",
      time: "8:00",
      duration: 15,
      status: "pending",
      responsible: "Mme Rasoa",
    },
    {
      id: 2,
      number: "#002",
      citizenName: "Rabe Marie",
      service: "Certificat résidence",
      time: "8:15",
      duration: 20,
      status: "pending",
      responsible: "M. Andry",
    },
    {
      id: 3,
      number: "#003",
      citizenName: "Rasoa Tiana",
      service: "Légalisation",
      time: "8:35",
      duration: 10,
      status: "waiting",
      responsible: "Mme Rasoa",
    },
  ]);

  const [responsibles, setResponsibles] = useState([
    { id: 1, name: "Mme Rasoa", service: "Acte de naissance", counter: "Guichet 1", status: "active" },
    { id: 2, name: "M. Andry", service: "Certificat résidence", counter: "Guichet 2", status: "active" },
    { id: 3, name: "Mme Vola", service: "Légalisation", counter: "Guichet 3", status: "active" },
  ]);

  const stats = {
    todayTickets: 45,
    waitingTickets: 12,
    completedTickets: 33,
    absentTickets: 2,
    avgWaitTime: 12,
    availableMinutes: 180,
  };

  const handleMarkAbsent = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "absent" } : t
      )
    );
    // Notification aux autres citoyens
  };

  const handleMarkCompleted = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, status: "completed" } : t
      )
    );
  };

  const tabs = [
    { id: "queue", label: "🎫 File d'attente", icon: "🎫" },
    { id: "responsibles", label: "👨‍💼 Responsables", icon: "👨‍💼" },
    { id: "statistics", label: "📊 Statistiques", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Admin */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🏛️ Administration Mairie</h1>
              <p className="text-sm text-gray-400">
                Gestion des tickets et responsables
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm">Admin</div>
              <div className="text-xs text-gray-400">Fianarantsoa</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">{stats.todayTickets}</div>
            <div className="text-xs text-gray-500">Tickets aujourd'hui</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">{stats.waitingTickets}</div>
            <div className="text-xs text-gray-500">En attente</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-2xl font-bold text-green-600">{stats.completedTickets}</div>
            <div className="text-xs text-gray-500">Terminés</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-2xl font-bold text-red-600">{stats.absentTickets}</div>
            <div className="text-xs text-gray-500">Absents</div>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{stats.avgWaitTime}min</div>
            <div className="text-xs text-gray-500">Temps moyen</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "queue" && (
          <TicketQueue
            tickets={tickets}
            onMarkAbsent={handleMarkAbsent}
            onMarkCompleted={handleMarkCompleted}
          />
        )}
        {activeTab === "responsibles" && (
          <ResponsibleManager
            responsibles={responsibles}
            onUpdate={(data) => console.log("Update", data)}
          />
        )}
        {activeTab === "statistics" && (
          <StatisticsCard stats={stats} />
        )}
      </div>
    </div>
  );
};