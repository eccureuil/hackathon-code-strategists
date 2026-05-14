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
app.use("/api/responsibles", responsibleRoutes);

// ⭐ Fonction de vérification automatique des retards
const startAutoAbsentChecker = () => {
  // Vérification toutes les minutes
  setInterval(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/reservations/auto-mark-absent`, {
        method: "PUT"
      });
      const data = await response.json();
      if (data.updatedCount > 0) {
        console.log(`🕐 ${new Date().toLocaleTimeString()} - ${data.message}`);
      }
    } catch (error) {
      // Silencieux pour ne pas polluer les logs
    }
  }, 60000); // Toutes les 60 secondes
};

// Démarrer le vérificateur automatique
startAutoAbsentChecker();

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "API Mairie de Fianarantsoa", 
    version: "1.0.0",
    features: {
      autoAbsent: "✅ Activé (vérification toutes les minutes)"
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📊 API MongoDB: ${process.env.MONGODB_URI}`);
  console.log(`⏰ Vérification automatique des retards: ACTIVE (toutes les minutes)\n`);
});