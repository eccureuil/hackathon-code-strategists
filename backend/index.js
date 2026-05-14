import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

import userRoutes from "./src/routes/user.route.js";
import historicPlaceRoutes from "./src/routes/historicPlace.route.js";
import BusRoutes from "./src/routes/bus.route.js";
import stopRoutes from "./src/routes/stop.route.js";
import reservationRoutes from "./src/routes/reservations.js";
import responsibleRoutes from "./src/routes/responsibles.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";

dotenv.config();

const app = express();

// Connexion MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/historic-places", historicPlaceRoutes);
app.use("/api/buses", BusRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/responsibles", responsibleRoutes);
app.use("/api/notifications", notificationRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("API Smart City running ...");
});

// AUTO CHECK
setInterval(async () => {
  try {
    await fetch("http://localhost:5050/api/reservations/auto-mark-absent", {
      method: "PUT"
    });
  } catch (e) {}
}, 60000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});