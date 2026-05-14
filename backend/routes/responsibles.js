import express from "express";
import { Responsible } from "../models/Responsible.js";

const router = express.Router();

// GET tous les responsables
router.get("/", async (req, res) => {
  try {
    const responsibles = await Responsible.find();
    res.json(responsibles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer un responsable
router.post("/", async (req, res) => {
  try {
    const responsible = new Responsible(req.body);
    await responsible.save();
    res.status(201).json(responsible);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT modifier un responsable
router.put("/:id", async (req, res) => {
  try {
    const responsible = await Responsible.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(responsible);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE supprimer un responsable
router.delete("/:id", async (req, res) => {
  try {
    await Responsible.findByIdAndDelete(req.params.id);
    res.json({ message: "Responsable supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;