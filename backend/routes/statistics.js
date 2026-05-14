import express from "express";
import { Reservation } from "../models/Reservation.js";

const router = express.Router();

// 📊 STATS RÉELLES
router.get("/", async (req, res) => {
  try {
    const tickets = await Reservation.find();

    const today = new Date().toISOString().split("T")[0];

    const todayTickets = tickets.filter(t => t.date === today);
    const completed = tickets.filter(t => t.status === "completed");
    const absent = tickets.filter(t => t.status === "absent");
    const waiting = tickets.filter(t => t.status === "confirmed");

    res.json({
      todayTickets: todayTickets.length,
      completedTickets: completed.length,
      absentTickets: absent.length,
      waitingTickets: waiting.length,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;