// backend/models/Responsible.js
import mongoose from "mongoose";

const responsibleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  service: { type: String, required: true },
  serviceId: { type: Number, required: true },
  counter: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  phone: { type: String },
  email: { type: String },
  workingHours: {
    start: { type: String, default: "08:00" },
    end: { type: String, default: "17:00" }
  },
  createdAt: { type: Date, default: Date.now }
});

export const Responsible = mongoose.model("Responsible", responsibleSchema);