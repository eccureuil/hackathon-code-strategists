import express from "express";
import { Notification } from "../models/Notification.js";

const router = express.Router();

// GET notifications citoyen
router.get("/:citizenId", async (req, res) => {
  const data = await Notification.find({ citizenId: req.params.citizenId });
  res.json(data);
});

// POST notification
router.post("/", async (req, res) => {
  const notif = new Notification(req.body);
  await notif.save();
  res.status(201).json(notif);
});

// MARK AS READ
router.put("/:id/read", async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  );
  res.json(notif);
});

export default router;