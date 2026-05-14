import mongoose from "mongoose";

const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de l'arrêt est requis"],
      unique: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: [true, "La latitude est requise"],
      },
      lng: {
        type: Number,
        required: [true, "La longitude est requise"],
      },
    },
  },
  {
    timestamps: true,
  }
);
const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de l'arrêt est requis"],
      unique: true,
      trim: true,
    },
    coordinates: {
      lat: {
        type: Number,
        default: -21.45,  // Valeur par défaut Fianarantsoa
      },
      lng: {
        type: Number,
        default: 47.08,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index pour la recherche textuelle
stopSchema.index({ name: "text" });

const Stop = mongoose.model("Stop", stopSchema);
export default Stop;