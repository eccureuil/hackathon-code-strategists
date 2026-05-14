import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, required: true },
  citizenName: { type: String, required: true },
  citizenPhone: { type: String, required: true },
  citizenEmail: { type: String },
  serviceId: { type: Number, required: true },
  serviceName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  motif: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["confirmed", "cancelled", "completed", "absent"],
    default: "confirmed" 
  },
  responsibleName: { type: String, default: "À assigner" },
  counter: { type: String, default: "Guichet 1" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Ticket = mongoose.model("Ticket", ticketSchema);