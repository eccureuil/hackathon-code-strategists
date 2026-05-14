import { Ticket } from "../models/Ticket.js";
import { Notification } from "../models/Notification.js";

/* ================= CREATE ================= */
export const createReservation = async (req, res) => {
  try {
    const { serviceId, serviceName, date, time, motif, citizenName, citizenPhone, citizenEmail } = req.body;

    const existing = await Ticket.findOne({ date, time, status: "confirmed" });
    if (existing) {
      return res.status(400).json({ error: "Créneau déjà réservé" });
    }

    const ticket = new Ticket({
      ticketNumber: `TKT-${Date.now()}`,
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

/* ================= GET ALL ================= */
export const getAllReservations = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET BY ID ================= */
export const getReservationById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Introuvable" });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= BY DATE ================= */
export const getReservationsByDate = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      date: req.params.date,
      status: "confirmed"
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= BY PHONE ================= */
export const getReservationsByPhone = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      citizenPhone: req.params.phone
    }).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= BY CITIZEN ================= */
export const getReservationsByCitizen = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      citizenId: req.params.citizenId
    });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= CANCEL ================= */
export const cancelReservation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.status = "cancelled";
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= COMPLETE ================= */
export const completeReservation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.status = "completed";
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= ABSENT ================= */
export const absentReservation = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    ticket.status = "absent";
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= START PROCESS ================= */
export const startProcessing = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    ticket.status = "waiting";
    await ticket.save();

    // 🔔 Notification CORRIGÉE
    await Notification.create({
      citizenId: ticket._id,
      message: "🟢 Votre dossier est en cours de traitement",
      type: "info"
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= AUTO ABSENT ================= */
export const autoMarkAbsent = async (req, res) => {
  try {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    const tickets = await Ticket.find({
      date: today,
      status: "confirmed"
    });

    let updated = 0;

    for (const t of tickets) {
      const [h, m] = t.time.split(":").map(Number);
      const diff = now.getHours() * 60 + now.getMinutes() - (h * 60 + m);

      if (diff >= 15) {
        t.status = "absent";
        await t.save();
        updated++;
      }
    }

    res.json({ updatedCount: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.params;

    const tickets = await Ticket.find({
      date,
      status: "confirmed"
    });

    const booked = tickets.map(t => t.time);

    const slots = [];

    for (let h = 8; h < 17; h++) {
      slots.push(`${h}:00`);
      slots.push(`${h}:15`);
      slots.push(`${h}:30`);
      slots.push(`${h}:45`);
    }

    const available = slots.filter(s => !booked.includes(s));

    res.json({
      date,
      available,
      booked
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
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
      available: Math.max(0, 45 - total)
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};