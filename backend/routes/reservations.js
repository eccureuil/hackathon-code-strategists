import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationById,
  getReservationsByDate,
  getReservationsByPhone,
  cancelReservation,
  completeReservation,
  absentReservation,
  getDailyStats,
  getAvailableSlots
} from "../controllers/reservationController.js";

const router = express.Router();

// Routes principales
router.post("/", createReservation);
router.get("/", getAllReservations);
router.get("/stats/daily", getDailyStats);
router.get("/slots/:date", getAvailableSlots);
router.get("/date/:date", getReservationsByDate);
router.get("/citizen/:phone", getReservationsByPhone);
router.get("/:id", getReservationById);
router.put("/:id/cancel", cancelReservation);
router.put("/:id/complete", completeReservation);
router.put("/:id/absent", absentReservation);

export default router;