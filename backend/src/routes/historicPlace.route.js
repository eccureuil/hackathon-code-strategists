import express from "express";
import upload from "../config/multer.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";
import {
  createHistoricPlace,
  getAllHistoricPlaces,
  getFeaturedPlaces,
  getHistoricPlaceById,
  getHistoricPlaceBySlug,
  updateHistoricPlace,
  deleteHistoricPlace,
  getNearbyPlaces
} from "../controllers/historicPlace.controller.js";

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("photos"), createHistoricPlace);
router.get("/", getAllHistoricPlaces);
router.get("/featured", getFeaturedPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/:id", getHistoricPlaceById);
router.get("/slug/:slug", getHistoricPlaceBySlug);
router.put("/:id", protect, adminOnly, upload.array("photos"), updateHistoricPlace);
router.delete("/:id", protect, adminOnly, deleteHistoricPlace);

export default router;