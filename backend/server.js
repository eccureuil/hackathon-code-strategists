import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import reservationRoutes from "./routes/reservations.js";
import responsibleRoutes from "./routes/responsibles.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/reservations", reservationRoutes);
app.use("/api/responsibles", responsibleRoutes);
app.use("/api/notifications", notificationRoutes);

// AUTO CHECK
setInterval(async () => {
  try {
    await fetch("http://localhost:3000/api/reservations/auto-mark-absent", {
      method: "PUT"
    });
  } catch (e) {}
}, 60000);

// ROOT
app.get("/", (req, res) => {
  res.json({ message: "API OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});