import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

import SignalementRoutes from "./src/routes/signalements.js"

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/signalements", SignalementRoutes);

app.get("/", (req, res) => {
  res.send("API Smart City running ...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});
