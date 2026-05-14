import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import reservationRoutes from "./routes/reservations.js";
import responsibleRoutes from "./routes/responsibles.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/reservations", reservationRoutes);
app.use("/api/responsibles", responsibleRoutes);  // ← Déplacer ICI après app.use

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "API Mairie de Fianarantsoa", 
    version: "1.0.0",
    endpoints: {
      "GET /api/reservations": "Liste des réservations",
      "POST /api/reservations": "Créer une réservation",
      "GET /api/reservations/stats/daily": "Statistiques du jour",
      "GET /api/reservations/slots/:date": "Créneaux disponibles",
      "GET /api/reservations/date/:date": "Réservations par date",
      "GET /api/reservations/citizen/:phone": "Réservations par citoyen",
      "PUT /api/reservations/:id/cancel": "Annuler",
      "PUT /api/reservations/:id/complete": "Compléter",
      "PUT /api/reservations/:id/absent": "Absent",
      "GET /api/responsibles": "Liste des responsables",
      "POST /api/responsibles": "Créer un responsable",
      "PUT /api/responsibles/:id": "Modifier un responsable",
      "DELETE /api/responsibles/:id": "Supprimer un responsable"
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API MongoDB: ${process.env.MONGODB_URI}\n`);
});