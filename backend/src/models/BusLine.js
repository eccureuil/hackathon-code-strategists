import mongoose from "mongoose";

const busLineSchema = new mongoose.Schema(
  {
    lineName: {
      type: String,
      required: [true, "Le nom de la ligne est requis"],
      unique: true,
      trim: true,
    },
    // Sens aller
    forwardStops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stop",
        required: true,
      },
    ],
    forwardTimes: [
      {
        type: Number,
        required: true,
      },
    ],
    // Sens retour
    hasReturnTrip: {
      type: Boolean,
      default: false,
    },
    returnStops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stop",
      },
    ],
    returnTimes: [
      {
        type: Number,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    // Optionnel : force le nom de la collection si vous ne voulez pas "buslines"
    collection: "buslines" 
  }
);

const BusLine = mongoose.model("BusLine", busLineSchema);
export default BusLine;