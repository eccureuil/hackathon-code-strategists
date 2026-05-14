import Stop from "../models/Stop.js";
import BusLine from "../models/BusLine.js";
import mongoose from "mongoose";

// Coordonnées approximatives de Fianarantsoa
const stopsData = [
  { name: "Gare Routière", coordinates: { lat: -21.4532, lng: 47.0856 } },
  { name: "Ancien Hôpital", coordinates: { lat: -21.4489, lng: 47.0889 } },
  { name: "Université", coordinates: { lat: -21.4590, lng: 47.0792 } },
  { name: "Lac Anosy", coordinates: { lat: -21.4555, lng: 47.0822 } },
  { name: "Marché Couvert", coordinates: { lat: -21.4501, lng: 47.0867 } },
  { name: "Cathédrale", coordinates: { lat: -21.4521, lng: 47.0834 } },
  { name: "Quartier Sud", coordinates: { lat: -21.4650, lng: 47.0750 } },
  { name: "École Primaire", coordinates: { lat: -21.4460, lng: 47.0900 } },
];

const linesData = [
  {
    lineName: "40",
    stops: ["Gare Routière", "Marché Couvert", "Cathédrale", "Lac Anosy", "Université"],
    timesBetweenStops: [3, 2, 4, 5],
    isActive: true,
  },
  {
    lineName: "101",
    stops: ["Ancien Hôpital", "École Primaire", "Gare Routière", "Cathédrale", "Quartier Sud"],
    timesBetweenStops: [4, 5, 3, 7],
    isActive: true,
  },
  {
    lineName: "12",
    stops: ["Marché Couvert", "Gare Routière", "Lac Anosy", "Université", "Quartier Sud"],
    timesBetweenStops: [2, 4, 5, 6],
    isActive: true,
  },
];

export const seedData = async () => {
  try {
    console.log("🌱 Début du seed des données...");

    // Nettoyer les collections existantes
    await Stop.deleteMany({});
    await BusLine.deleteMany({});
    console.log("✓ Collections nettoyées");

    // Créer les arrêts
    const createdStops = await Stop.insertMany(stopsData);
    console.log(`✓ ${createdStops.length} arrêts créés`);

    // Créer un mapping nom -> ID
    const stopMap = {};
    createdStops.forEach((stop) => {
      stopMap[stop.name] = stop._id;
    });

    // Créer les lignes
    for (const lineData of linesData) {
      const stopIds = lineData.stops.map((stopName) => stopMap[stopName]);
      await BusLine.create({
        lineName: lineData.lineName,
        stops: stopIds,
        timesBetweenStops: lineData.timesBetweenStops,
        isActive: lineData.isActive,
      });
    }
    console.log(`✓ ${linesData.length} lignes créées`);

    console.log("✅ Seed terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
  }
};

// Pour exécuter directement : node src/utils/seedData.js
if (import.meta.url === `file://${process.argv[1]}`) {
  const connectDB = require("../config/db.js");
  connectDB().then(() => seedData()).then(() => process.exit());
}