import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationById,
  getReservationsByDate,
  getReservationsByPhone,
  getReservationsByCitizen,
  cancelReservation,
  completeReservation,
  absentReservation,
  getDailyStats,
  getAvailableSlots,
  startProcessing,
  autoMarkAbsent
} from "../controllers/reservationController.js";

const router = express.Router();

// CREATE
router.post("/", createReservation);

// GET ALL
router.get("/", getAllReservations);

// STATS
router.get("/stats/daily", getDailyStats);

// SLOTS
router.get("/slots/:date", getAvailableSlots);

// BY DATE
router.get("/date/:date", getReservationsByDate);

// BY CITIZEN
router.get("/citizen/id/:citizenId", getReservationsByCitizen);
router.get("/citizen/phone/:phone", getReservationsByPhone);

// BY ID
router.get("/:id", getReservationById);

// ACTIONS
router.put("/:id/cancel", cancelReservation);
router.put("/:id/complete", completeReservation);
router.put("/:id/absent", absentReservation);
router.put("/:id/start", startProcessing);

// AUTO ABSENT
router.put("/auto-mark-absent", autoMarkAbsent);

export default router;