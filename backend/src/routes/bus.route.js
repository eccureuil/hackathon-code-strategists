import express from "express";
import {
  createBusLine,
  getAllBusLines,
  getBusLineById,
  getBusLineDetails,
  updateBusLine,
  deleteBusLine,
  searchRoute,
  searchBusLine,
  getAllLinesSimple,
  exportData,
  importData,
} from "../controllers/bus.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes publiques
router.get("/", getAllBusLines);
router.get("/lines", getAllLinesSimple);
router.get("/lines/search", searchBusLine);
router.get("/lines/:id/details", getBusLineDetails);
router.get("/:id", getBusLineById);
router.post("/search", searchRoute);

// Routes admin (protégées)
router.post("/", protect, adminOnly, createBusLine);
router.put("/:id", protect, adminOnly, updateBusLine);
router.delete("/:id", protect, adminOnly, deleteBusLine);
router.get("/export", protect, adminOnly, exportData);
router.post("/import", protect, adminOnly, importData);

export default router;