import mongoose from "mongoose";
import slugify from "slugify";

const HistoricPlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      unique: true
    },

    category: {
      type: String,
      enum: ["religieux", "colonial", "culturel", "naturel", "gastronomie"],
      required: true
    },

    description: {
      type: String,
      required: true
    },

    aiDescription: {
      type: String
    },

    history: {
      type: String
    },

    photos: {
      type: [String],
      default: []
    },

    location: {
      type: {
        type: String,
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    },

    address: {
      type: String
    },

    tags: {
      type: [String],
      default: []
    },

    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// index pour Google Maps / Leaflet / Mongo geospatial queries
HistoricPlaceSchema.index({ location: "2dsphere" });

HistoricPlaceSchema.pre("save", function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

const HistoricPlace = mongoose.model("HistoricPlace", HistoricPlaceSchema);

export default HistoricPlace;