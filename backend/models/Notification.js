import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  citizenId: String,
  message: String,
  type: {
    type: String,
    enum: ["info", "warning", "success"],
    default: "info"
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Notification = mongoose.model("Notification", notificationSchema);