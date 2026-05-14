import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./src/config/db.js";

import userRoutes from "./src/routes/user.route.js";
import historicPlaceRoutes from "./src/routes/historicPlace.route.js";

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

// Route test
app.get("/", (req, res) => {
  res.send("API Smart City running ...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});