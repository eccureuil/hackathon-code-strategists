// frontend/src/components/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { TicketQueue } from "./TicketQueue";
import { ResponsibleManager } from "./ResponsibleManager";
import { StatisticsCard } from "./StatisticsCard";
import { Search, User, Phone, Ticket } from "lucide-react";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all"); // all, number, name, phone
  const [stats, setStats] = useState({
    todayTickets: 0,
    waitingTickets: 0,
    completedTickets: 0,
    absentTickets: 0,
    avgWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);

  // Récupérer tous les tickets
  const fetchTickets = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/reservations");
      const data = await response.json();
      setTickets(data);
      setFilteredTickets(data);
      updateStats(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Récupérer les responsables
  const fetchResponsibles = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/responsibles");
      const data = await response.json();
      setResponsibles(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Mettre à jour les statistiques
  const updateStats = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const todayTickets = data.filter(t => t.date === today);
    const waiting = data.filter(t => t.status === "confirmed" && t.date === today);
    const completed = data.filter(t => t.status === "completed");
    const absent = data.filter(t => t.status === "absent");
    
    setStats({
      todayTickets: todayTickets.length,
      waitingTickets: waiting.length,
      completedTickets: completed.length,
      absentTickets: absent.length,
      avgWaitTime: 12,
    });
  };

  // Fonction de recherche
  const handleSearch = (term, type) => {
    setSearchTerm(term);
    setSearchType(type);
    
    if (!term.trim()) {
      setFilteredTickets(tickets);
      return;
    }
    
    const lowerTerm = term.toLowerCase();
    const filtered = tickets.filter(ticket => {
      switch (type) {
        case "number":
          return ticket.ticketNumber?.toLowerCase().includes(lowerTerm);
        case "name":
          return ticket.citizenName?.toLowerCase().includes(lowerTerm);
        case "phone":
          return ticket.citizenPhone?.toLowerCase().includes(lowerTerm);
        default:
          return ticket.ticketNumber?.toLowerCase().includes(lowerTerm) ||
                 ticket.citizenName?.toLowerCase().includes(lowerTerm) ||
                 ticket.citizenPhone?.toLowerCase().includes(lowerTerm);
      }
    });
    setFilteredTickets(filtered);
  };

  // Marquer comme terminé
  const handleMarkCompleted = async (ticketId) => {
    try {
      await fetch(`http://localhost:3000/api/reservations/${ticketId}/complete`, {
        method: "PUT",
      });
      fetchTickets();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Marquer comme absent
  const handleMarkAbsent = async (ticketId) => {
    try {
      await fetch(`http://localhost:3000/api/reservations/${ticketId}/absent`, {
        method: "PUT",
      });
      fetchTickets();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Ajouter un responsable
  const handleAddResponsible = async (data) => {
    try {
      const response = await fetch("http://localhost:3000/api/responsibles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchResponsibles();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  

  // Modifier un responsable
  const handleUpdateResponsible = async (id, data) => {
    try {
      const response = await fetch(`http://localhost:3000/api/responsibles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        fetchResponsibles();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchResponsibles();
  }, []);

  const formattedTickets = filteredTickets.map(ticket => ({
    id: ticket._id,
    number: ticket.ticketNumber,
    citizenName: ticket.citizenName,
    citizenPhone: ticket.citizenPhone,
    service: ticket.serviceName,
    time: ticket.time,
    date: ticket.date,
    duration: 20,
    status: ticket.status === "confirmed" ? "pending" : ticket.status,
    responsible: ticket.responsibleName || "À assigner",
  }));

  const tabs = [
    { id: "queue", label: "🎫 File d'attente", icon: "🎫" },
    { id: "responsibles", label: "👨‍💼 Responsables", icon: "👨‍💼" },
    { id: "statistics", label: "📊 Statistiques", icon: "📊" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">🏛️ Administration Mairie</h1>
              <p className="text-sm text-gray-400">Gestion des tickets et responsables</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => handleSearch(searchTerm, "all")}
                className={`px-3 py-1 rounded-full text-sm ${searchType === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                <Ticket className="w-4 h-4 inline mr-1" /> Tous
              </button>
              <button
                onClick={() => handleSearch(searchTerm, "number")}
                className={`px-3 py-1 rounded-full text-sm ${searchType === "number" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                <Ticket className="w-4 h-4 inline mr-1" /> N° Ticket
              </button>
              <button
                onClick={() => handleSearch(searchTerm, "name")}
                className={`px-3 py-1 rounded-full text-sm ${searchType === "name" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                <User className="w-4 h-4 inline mr-1" /> Citoyen
              </button>
              <button
                onClick={() => handleSearch(searchTerm, "phone")}
                className={`px-3 py-1 rounded-full text-sm ${searchType === "phone" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                <Phone className="w-4 h-4 inline mr-1" /> Téléphone
              </button>
            </div>
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value, searchType)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredTickets.length} / {tickets.length} tickets
            </div>
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

      {/* Contenu */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "queue" && (
          <TicketQueue
            tickets={formattedTickets}
            onMarkAbsent={handleMarkAbsent}
            onMarkCompleted={handleMarkCompleted}
          />
        )}
        {activeTab === "responsibles" && (
          <ResponsibleManager
            responsibles={responsibles}
            onAdd={handleAddResponsible}
            onUpdate={handleUpdateResponsible}
          />
        )}
        {activeTab === "statistics" && (
          <StatisticsCard stats={stats} />
        )}
      </div>
    </div>
  );
};