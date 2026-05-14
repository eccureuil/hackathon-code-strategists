import express from "express";
import upload from "../config/multer.js";
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

router.post("/", upload.array("photos"), createHistoricPlace);
router.get("/", getAllHistoricPlaces);
router.get("/featured", getFeaturedPlaces);
router.get("/nearby", getNearbyPlaces);
router.get("/:id", getHistoricPlaceById);
router.get("/slug/:slug", getHistoricPlaceBySlug);
router.put("/:id", upload.array("photos"), updateHistoricPlace);
router.delete("/:id", deleteHistoricPlace);

export default router;