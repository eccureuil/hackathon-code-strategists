import express from "express";
import {
  createStop,
  getAllStops,
  updateStop,
  deleteStop,
} from "../controllers/stop.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Routes publiques
router.get("/", getAllStops);

// Routes admin (protégées)
router.post("/", protect, adminOnly, createStop);
router.put("/:id", protect, adminOnly, updateStop);
router.delete("/:id", protect, adminOnly, deleteStop);

export default router;