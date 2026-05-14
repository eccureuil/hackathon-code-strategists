import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

import userRoutes from "./src/routes/user.route.js";
import busRoutes from "./src/routes/bus.route.js";
import stopRoutes from "./src/routes/stop.route.js";

dotenv.config();

const app = express();

// Connexion MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bus", busRoutes);
app.use("/api/bus/stops", stopRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("API Smart City running ...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});