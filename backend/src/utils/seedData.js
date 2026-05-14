import Stop from "../models/Stop.js";
import BusLine from "../models/BusLine.js";
import connectDB from "../config/db.js";

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
    forwardStops: ["Gare Routière", "Marché Couvert", "Cathédrale", "Lac Anosy", "Université"],
    forwardTimes: [3, 2, 4, 5],
    isActive: true,
  },
  {
    lineName: "101",
    forwardStops: ["Ancien Hôpital", "École Primaire", "Gare Routière", "Cathédrale", "Quartier Sud"],
    forwardTimes: [4, 5, 3, 7],
    isActive: true,
  },
  {
    lineName: "12",
    forwardStops: ["Marché Couvert", "Gare Routière", "Lac Anosy", "Université", "Quartier Sud"],
    forwardTimes: [2, 4, 5, 6],
    isActive: true,
  },
];

const seedData = async () => {
  try {
    console.log("🌱 Début du seed des données...");

    await Stop.deleteMany({});
    await BusLine.deleteMany({});
    console.log("✓ Collections nettoyées");

    const createdStops = await Stop.insertMany(stopsData);
    console.log(`✓ ${createdStops.length} arrêts créés`);

    const stopMap = {};
    createdStops.forEach((stop) => {
      stopMap[stop.name] = stop._id;
    });

    for (const lineData of linesData) {
      const stopIds = lineData.forwardStops.map((stopName) => stopMap[stopName]);
      await BusLine.create({
        lineName: lineData.lineName,
        forwardStops: stopIds,
        forwardTimes: lineData.forwardTimes,
        isActive: lineData.isActive,
      });
    }
    console.log(`✓ ${linesData.length} lignes créées`);

    console.log("✅ Seed terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
  }
};

connectDB().then(() => seedData()).then(() => process.exit());
