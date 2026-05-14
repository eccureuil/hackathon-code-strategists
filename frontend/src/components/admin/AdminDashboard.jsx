import { useState, useEffect } from "react";
import { TicketQueue } from "./TicketQueue";
import { ResponsibleManager } from "./ResponsibleManager";
import { StatisticsCard } from "./StatisticsCard";
import { Search, User, Phone, Ticket } from "lucide-react";
import { API_BASE } from "../../services/api";

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("queue");
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [responsibles, setResponsibles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    todayTickets: 0,
    waitingTickets: 0,
    completedTickets: 0,
    absentTickets: 0,
    avgWaitTime: 0,
  });
  const [loading, setLoading] = useState(true);

  // Horloge temps réel
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chargement initial
  useEffect(() => {
    fetchTickets();
    fetchResponsibles();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/reservations`);
      const data = await response.json();
      setTickets(data);
      setFilteredTickets(data);
      updateStats(data);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResponsibles = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/responsibles`);
      const data = await response.json();
      setResponsibles(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

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

  const handleMarkCompleted = async (ticketId) => {
    try {
      await fetch(`${API_BASE}/api/reservations/${ticketId}/complete`, { method: "PUT" });
      fetchTickets();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleMarkAbsent = async (ticketId) => {
    try {
      await fetch(`${API_BASE}/api/reservations/${ticketId}/absent`, { method: "PUT" });
      fetchTickets();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleStartProcessing = async (ticketId) => {
    try {
      await fetch(`${API_BASE}/api/reservations/${ticketId}/start`, { method: "PUT" });
      fetchTickets();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleAddResponsible = async (data) => {
    try {
      const response = await fetch(`${API_BASE}/api/responsibles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Responsable ajouté avec succès !");
      fetchResponsibles();
    } else {
      alert("Erreur lors de l'ajout !");
    }

  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur serveur !");
  }
  };

  const handleUpdateResponsible = async (id, data) => {
    try {
      const response = await fetch(`${API_BASE}/api/responsibles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) fetchResponsibles();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

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
  const handleDeleteResponsible = async (id) => {

  const confirmDelete = window.confirm(
    "Voulez-vous vraiment supprimer ce responsable ?"
  );

  if (!confirmDelete) return;

  try {

    await fetch(
      `${API_BASE}/api/responsibles/${id}`,
      {
        method: "DELETE"
      }
    );

    alert("Responsable supprimé avec succès");

    fetchResponsibles();

  } catch (error) {

    console.error("Erreur:", error);

    alert("Erreur lors de la suppression");

  }
};

  // Auto-absent après 15 min — placé APRÈS formattedTickets
useEffect(() => {

  const checkAbsent = async () => {
    const now = new Date();

    for (const ticket of tickets) {

      // Seulement les tickets confirmés
      if (ticket.status !== "confirmed") continue;

      // Vérification sécurité
      if (!ticket.date || !ticket.time) continue;

      // Extraire seulement YYYY-MM-DD
      const onlyDate = new Date(ticket.date)
        .toISOString()
        .split("T")[0];

      // Recréer une vraie date valide
      const ticketDateTime = new Date(
        `${onlyDate}T${ticket.time}`
      );

      // Vérifier si la date est valide
      if (isNaN(ticketDateTime.getTime())) {
        console.log("Date invalide :", ticket);
        continue;
      }

      // Différence en minutes
      const diffMinutes = Math.floor(
        (now - ticketDateTime) / 60000
      );

      console.log(
        ticket.ticketNumber,
        diffMinutes,
        "minutes"
      );

      // Après 15 minutes
      if (diffMinutes >= 15 && now > ticketDateTime) {

        try {

            await fetch(
              `${API_BASE}/api/reservations/${ticket._id}/absent`,
              {
                method: "PUT"
              }
            );

          console.log(
            `Ticket ${ticket.ticketNumber} marqué absent`
          );

        } catch (error) {

          console.error(
            "Erreur auto-absent:",
            error
          );

        }
      }
    }

    // Rafraîchir
    fetchTickets();
  };

  // Vérification immédiate
  checkAbsent();

  // Vérification toutes les minutes
  const interval = setInterval(
    checkAbsent,
    60000
  );

  return () => clearInterval(interval);

}, []);

  const tabs = [
    { id: "queue", label: <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg> File d'attente</> },
    { id: "responsibles", label: <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> Responsables</> },
    { id: "statistics", label: <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> Statistiques</> },
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
              <h1 className="text-2xl font-bold"><svg className="w-6 h-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> Administration Mairie</h1>
              <p className="text-sm text-gray-400">Gestion des tickets et responsables</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono bg-blue-500/20 px-3 py-1 rounded-lg">
                <svg className="w-4 h-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> {currentTime.toLocaleTimeString("fr-FR")}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {currentTime.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
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
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-2 flex-wrap">
              {[
                { type: "all", label: "Tous" },
                { type: "number", label: "N° Ticket" },
                { type: "name", label: "Citoyen" },
                { type: "phone", label: "Téléphone" },
              ].map(btn => (
                <button
                  key={btn.type}
                  onClick={() => handleSearch(searchTerm, btn.type)}
                  className={`px-3 py-1 rounded-full text-sm ${searchType === btn.type ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value, searchType)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-gray-500">
              {filteredTickets.length} / {tickets.length} tickets
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
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
    onDelete={handleDeleteResponsible}
  />

        )}
        {activeTab === "statistics" && (
          <StatisticsCard tickets={tickets} />
        )}
      </div>
    </div>
  );
};