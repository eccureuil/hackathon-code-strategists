import { Ticket } from "../models/Ticket.js";

// Créer une réservation
export const createReservation = async (req, res) => {
  try {
    const { serviceId, serviceName, date, time, motif, citizenName, citizenPhone, citizenEmail } = req.body;
    
    // Vérifier si le créneau est déjà pris
    const existingTicket = await Ticket.findOne({ date, time, status: "confirmed" });
    if (existingTicket) {
      return res.status(400).json({ error: "Ce créneau est déjà réservé" });
    }
    
    const ticketNumber = `TKT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const ticket = new Ticket({
      ticketNumber,
      citizenName,
      citizenPhone,
      citizenEmail,
      serviceId,
      serviceName,
      date,
      time,
      motif
    });
    
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les tickets
export const getAllReservations = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer un ticket par ID
export const getReservationById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket non trouvé" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les tickets par date
export const getReservationsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const tickets = await Ticket.find({ date, status: "confirmed" });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Récupérer les tickets par téléphone citoyen
export const getReservationsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const tickets = await Ticket.find({ citizenPhone: phone }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Annuler une réservation
export const cancelReservation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket non trouvé" });
    
    ticket.status = "cancelled";
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marquer comme complété
export const completeReservation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket non trouvé" });
    
    ticket.status = "completed";
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marquer comme absent (manuel)
export const absentReservation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket non trouvé" });
    
    ticket.status = "absent";
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Marquer comme "en cours"
export const startProcessing = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket non trouvé" });
    
    ticket.status = "waiting";
    ticket.updatedAt = Date.now();
    await ticket.save();
    
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⭐ NOUVEAU - Vérifier et marquer automatiquement les tickets en retard
export const autoMarkAbsent = async (req, res) => {
  try {
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Récupérer tous les tickets du jour qui sont encore "confirmed"
    const tickets = await Ticket.find({ 
      date: currentDate, 
      status: "confirmed" 
    });
    
    let updatedCount = 0;
    const updatedTickets = [];
    
    for (const ticket of tickets) {
      const [ticketHour, ticketMinute] = ticket.time.split(":").map(Number);
      const ticketTimeInMinutes = ticketHour * 60 + ticketMinute;
      const delayMinutes = currentTimeInMinutes - ticketTimeInMinutes;
      
      // Si retard >= 15 minutes, passer en "absent"
      if (delayMinutes >= 15) {
        ticket.status = "absent";
        ticket.updatedAt = now;
        await ticket.save();
        updatedCount++;
        updatedTickets.push({
          number: ticket.ticketNumber,
          citizen: ticket.citizenName,
          time: ticket.time,
          delay: delayMinutes
        });
        console.log(`✅ Auto-absent: ${ticket.ticketNumber} (${ticket.citizenName}) - ${delayMinutes} min de retard`);
      }
    }
    
    res.json({ 
      success: true, 
      message: `${updatedCount} ticket(s) marqué(s) absent automatiquement`,
      updatedCount,
      updatedTickets,
      checkedAt: now.toISOString()
    });
  } catch (error) {
    console.error("❌ Erreur autoMarkAbsent:", error);
    res.status(500).json({ error: error.message });
  }
};

// Statistiques du jour
export const getDailyStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    
    const total = await Ticket.countDocuments({ date: today });
    const confirmed = await Ticket.countDocuments({ date: today, status: "confirmed" });
    const completed = await Ticket.countDocuments({ date: today, status: "completed" });
    const cancelled = await Ticket.countDocuments({ date: today, status: "cancelled" });
    const absent = await Ticket.countDocuments({ date: today, status: "absent" });
    
    res.json({ 
      date: today, 
      total, 
      confirmed, 
      completed, 
      cancelled, 
      absent,
      available: 45 - total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Créneaux disponibles par date
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;
    const tickets = await Ticket.find({ date, status: "confirmed" });
    const bookedTimes = tickets.map(t => t.time);
    
    const allSlots = [];
    for (let h = 8; h < 17; h++) {
      allSlots.push(`${h}:00`, `${h}:15`, `${h}:30`, `${h}:45`);
    }
    
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));
    res.json({ date, available: availableSlots, booked: bookedTimes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};